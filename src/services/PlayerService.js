/**
 * ==============================================================================
 * PLAYER SERVICE
 * ==============================================================================
 * Dual-engine audio player wrapping:
 * 1. Hidden 1x1px YouTube IFrame Player API (for full YouTube tracks)
 * 2. HTML5 Audio (for iTunes 30s previewUrl & local MP3 files)
 *
 * Provides a single, unified API:
 * - play(track)
 * - pause()
 * - resume()
 * - seek(seconds)
 * - setVolume(0-100)
 * - setMuted(boolean)
 * - subscribeProgress(callback)
 * - subscribeState(callback)
 * - subscribeError(callback)
 * ==============================================================================
 */

class PlayerService {
  constructor() {
    this.ytPlayer = null;
    this.audioElement = null;
    this.currentTrack = null;
    this.isPlaying = false;
    this.volume = 50;
    this.isMuted = false;
    this.engine = 'idle'; // 'youtube' | 'audio' | 'idle'

    this.progressInterval = null;
    this.isYtReady = false;
    this.pendingTrack = null;

    // Callbacks
    this.stateListeners = new Set();
    this.progressListeners = new Set();
    this.trackEndListeners = new Set();
    this.errorListeners = new Set();

    this.initAudioElement();
    this.loadYouTubeIframeAPI();
  }

  // 1. Initialize HTML5 Audio Fallback Engine
  initAudioElement() {
    if (typeof window === 'undefined') return;
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';
    this.audioElement.volume = this.volume / 100;

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notifyState();
      this.notifyTrackEnded();
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.notifyState();
      this.startProgressPolling();
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notifyState();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('HTML5 Audio playback error:', e);
      this.notifyError({ message: 'Audio playback failed' });
    });
  }

  // 2. Load YouTube IFrame API Script & create hidden off-screen 1x1 container
  loadYouTubeIframeAPI() {
    if (typeof window === 'undefined') return;

    // Check if container div exists, otherwise create it
    let container = document.getElementById('yt-hidden-player-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'yt-hidden-player-container';
      // Crucial: 1x1px off-screen (NOT display:none, otherwise browser blocks playback)
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.pointerEvents = 'none';
      container.style.opacity = '0.01';
      container.style.zIndex = '-999';
      document.body.appendChild(container);

      const placeholder = document.createElement('div');
      placeholder.id = 'yt-player-iframe';
      container.appendChild(placeholder);
    }

    if (window.YT && window.YT.Player) {
      this.initYouTubePlayer();
      return;
    }

    // Set callback on global window
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousReady) previousReady();
      this.initYouTubePlayer();
    };

    if (!document.getElementById('yt-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  // 3. Initialize the YT.Player instance
  initYouTubePlayer() {
    try {
      this.ytPlayer = new window.YT.Player('yt-player-iframe', {
        height: '1',
        width: '1',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            this.isYtReady = true;
            this.ytPlayer.setVolume(this.volume);
            if (this.isMuted) this.ytPlayer.mute();
            if (this.pendingTrack) {
              const t = this.pendingTrack;
              this.pendingTrack = null;
              this.playTrack(t);
            }
          },
          onStateChange: (event) => {
            // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
            if (event.data === window.YT.PlayerState.PLAYING) {
              this.isPlaying = true;
              this.notifyState();
              this.startProgressPolling();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              this.isPlaying = false;
              this.notifyState();
            } else if (event.data === window.YT.PlayerState.ENDED) {
              this.isPlaying = false;
              this.notifyState();
              this.notifyTrackEnded();
            }
          },
          onError: (event) => {
            console.warn('YouTube Player error code:', event.data);
            // 101 or 150 = owner restricted embedding
            let message = 'Playback error occurred.';
            if (event.data === 101 || event.data === 150) {
              message = 'Embedding restricted by owner. Auto-skipping to next track...';
            }
            this.notifyError({ code: event.data, message, autoSkip: true });
          },
        },
      });
    } catch (err) {
      console.warn('Could not initialize YouTube Player:', err);
    }
  }

  // 4. Play a given track (decides between YouTube and HTML5 Audio)
  playTrack(track) {
    if (!track) return;
    this.currentTrack = track;

    // Reset progress callback immediately
    this.notifyProgress({ currentTime: 0, duration: track.durationSec || 0, progressPercent: 0 });

    // DECISION: Does the track have a YouTube videoId?
    if (track.videoId) {
      // Pause HTML5 audio if active
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.src = '';
      }

      this.engine = 'youtube';

      if (!this.isYtReady || !this.ytPlayer || !this.ytPlayer.loadVideoById) {
        this.pendingTrack = track;
        return;
      }

      try {
        this.ytPlayer.loadVideoById(track.videoId);
        this.ytPlayer.setVolume(this.volume);
        if (this.isMuted) {
          this.ytPlayer.mute();
        } else {
          this.ytPlayer.unMute();
        }
        this.ytPlayer.playVideo();
        this.isPlaying = true;
        this.notifyState();
        this.startProgressPolling();
      } catch (err) {
        console.error('Error playing YouTube video:', err);
      }
    }
    // FALLBACK ENGINE: HTML5 Audio (iTunes preview or local file)
    else if (track.previewUrl || track.audioFilePath) {
      // Pause YouTube player if active
      if (this.ytPlayer && this.ytPlayer.pauseVideo) {
        try {
          this.ytPlayer.pauseVideo();
        } catch { }
      }

      this.engine = 'audio';
      const src = track.previewUrl || track.audioFilePath;

      if (this.audioElement) {
        this.audioElement.src = src;
        this.audioElement.currentTime = 0;
        this.audioElement.volume = this.volume / 100;
        this.audioElement.muted = this.isMuted;
        this.audioElement.load();

        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isPlaying = true;
              this.notifyState();
              this.startProgressPolling();
            })
            .catch((err) => {
              if (err.name !== 'AbortError') {
                console.warn('HTML5 play interrupted:', err);
                this.isPlaying = false;
                this.notifyState();
              }
            });
        }
      }
    }
  }

  // Pause
  pause() {
    this.isPlaying = false;
    if (this.engine === 'youtube' && this.ytPlayer && this.ytPlayer.pauseVideo) {
      try {
        this.ytPlayer.pauseVideo();
      } catch { }
    } else if (this.engine === 'audio' && this.audioElement) {
      this.audioElement.pause();
    }
    this.stopProgressPolling();
    this.notifyState();
  }

  // Resume
  resume() {
    if (!this.currentTrack) return;
    this.isPlaying = true;
    if (this.engine === 'youtube' && this.ytPlayer && this.ytPlayer.playVideo) {
      try {
        this.ytPlayer.playVideo();
      } catch { }
    } else if (this.engine === 'audio' && this.audioElement) {
      this.audioElement.play().catch(() => { });
    }
    this.startProgressPolling();
    this.notifyState();
  }

  // Toggle Play / Pause
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      if (this.currentTrack) {
        this.resume();
      }
    }
  }

  // Seek (in seconds)
  seek(seconds) {
    if (this.engine === 'youtube' && this.ytPlayer && this.ytPlayer.seekTo) {
      try {
        this.ytPlayer.seekTo(seconds, true);
      } catch { }
    } else if (this.engine === 'audio' && this.audioElement) {
      this.audioElement.currentTime = seconds;
    }
    this.notifyProgress({
      currentTime: seconds,
      duration: this.getDuration(),
      progressPercent: this.getDuration() > 0 ? (seconds / this.getDuration()) * 100 : 0,
    });
  }

  // Set Volume (0 to 100)
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(100, vol));
    if (this.ytPlayer && this.ytPlayer.setVolume) {
      try {
        this.ytPlayer.setVolume(this.volume);
      } catch { }
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume / 100;
    }
    this.notifyState();
  }

  // Set Mute
  setMuted(muted) {
    this.isMuted = muted;
    if (this.ytPlayer) {
      try {
        if (muted) {
          this.ytPlayer.mute();
        } else {
          this.ytPlayer.unMute();
          this.ytPlayer.setVolume(this.volume);
        }
      } catch { }
    }
    if (this.audioElement) {
      this.audioElement.muted = muted;
    }
    this.notifyState();
  }

  getCurrentTime() {
    if (this.engine === 'youtube' && this.ytPlayer && this.ytPlayer.getCurrentTime) {
      try {
        return this.ytPlayer.getCurrentTime() || 0;
      } catch {
        return 0;
      }
    } else if (this.engine === 'audio' && this.audioElement) {
      return this.audioElement.currentTime || 0;
    }
    return 0;
  }

  getDuration() {
    if (this.engine === 'youtube' && this.ytPlayer && this.ytPlayer.getDuration) {
      try {
        const d = this.ytPlayer.getDuration();
        if (d && d > 0) return d;
      } catch { }
    } else if (this.engine === 'audio' && this.audioElement) {
      const d = this.audioElement.duration;
      if (d && !isNaN(d) && d > 0) return d;
    }
    return this.currentTrack?.durationSec || 0;
  }

  // 5. 500ms Progress Polling (as specified in prompt)
  startProgressPolling() {
    this.stopProgressPolling();
    this.progressInterval = setInterval(() => {
      const curr = this.getCurrentTime();
      const dur = this.getDuration();
      const pct = dur > 0 ? (curr / dur) * 100 : 0;
      this.notifyProgress({
        currentTime: curr,
        duration: dur,
        progressPercent: pct,
        isPlaying: this.isPlaying,
      });
    }, 500);
  }

  stopProgressPolling() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  // Subscriptions
  subscribeProgress(cb) {
    this.progressListeners.add(cb);
    return () => this.progressListeners.delete(cb);
  }

  subscribeState(cb) {
    this.stateListeners.add(cb);
    return () => this.stateListeners.delete(cb);
  }

  subscribeTrackEnded(cb) {
    this.trackEndListeners.add(cb);
    return () => this.trackEndListeners.delete(cb);
  }

  subscribeError(cb) {
    this.errorListeners.add(cb);
    return () => this.errorListeners.delete(cb);
  }

  notifyState() {
    const data = {
      currentTrack: this.currentTrack,
      isPlaying: this.isPlaying,
      volume: this.volume,
      isMuted: this.isMuted,
      engine: this.engine,
    };
    this.stateListeners.forEach((cb) => cb(data));
  }

  notifyProgress(data) {
    this.progressListeners.forEach((cb) => cb(data));
  }

  notifyTrackEnded() {
    this.trackEndListeners.forEach((cb) => cb());
  }

  notifyError(err) {
    this.errorListeners.forEach((cb) => cb(err));
  }
}

// Export singleton instance
export const playerService = new PlayerService();

