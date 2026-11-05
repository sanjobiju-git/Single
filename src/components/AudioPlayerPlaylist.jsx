import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Music, ChevronDown, ChevronUp, 
  Search, X, SkipBack, SkipForward, Minus, Maximize2, AlertCircle, Loader2
} from 'lucide-react';
import { initialPlaylist, moodChips } from '../data/initialPlaylist';
import { SearchService } from '../services/SearchService';
import { playerService } from '../services/PlayerService';

function formatTime(timeInSeconds) {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default function AudioPlayerPlaylist({ className = "" }) {
  // Central Player State with localStorage persistence
  const [currentTrack, setCurrentTrack] = useState(() => {
    try {
      const saved = localStorage.getItem('music_player_last_track');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialPlaylist[0]; // "Nilavil Ellame" by default
  });

  const [queue] = useState(initialPlaylist);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(222);
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('music_player_volume');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 70;
  });
  const [isMuted, setIsMuted] = useState(false);

  // Search & Filter States (Exclusively Malayalam)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  // UI States
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const debounceTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Subscribe to PlayerService Events
  useEffect(() => {
    playerService.setVolume(volume);

    const unsubscribeProgress = playerService.subscribeProgress((data) => {
      setProgress(data.currentTime || 0);
      if (data.duration && data.duration > 0) {
        setDuration(data.duration);
      }
      if (typeof data.isPlaying === 'boolean') {
        setIsPlaying(data.isPlaying);
      }
    });

    const unsubscribeState = playerService.subscribeState((state) => {
      setIsPlaying(state.isPlaying);
      if (state.volume !== undefined) setVolume(state.volume);
      if (state.isMuted !== undefined) setIsMuted(state.isMuted);
    });

    const unsubscribeEnd = playerService.subscribeTrackEnded(() => {
      handleNextTrack();
    });

    const unsubscribeError = playerService.subscribeError((err) => {
      if (err.autoSkip) {
        showToast(err.message || 'Auto-skipping track...');
        handleNextTrack();
      } else {
        showToast(err.message || 'Playback error occurred.');
      }
    });

    return () => {
      unsubscribeProgress();
      unsubscribeState();
      unsubscribeEnd();
      unsubscribeError();
    };
  }, []);

  useEffect(() => {
    if (currentTrack) {
      try {
        localStorage.setItem('music_player_last_track', JSON.stringify(currentTrack));
      } catch {}
    }
  }, [currentTrack]);

  useEffect(() => {
    try {
      localStorage.setItem('music_player_volume', volume.toString());
    } catch {}
  }, [volume]);

  const selectTrack = useCallback((track) => {
    setCurrentTrack(track);
    setProgress(0);
    playerService.playTrack(track);
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      playerService.pause();
    } else {
      if (!playerService.currentTrack && currentTrack) {
        playerService.playTrack(currentTrack);
      } else {
        playerService.resume();
      }
    }
  };

  const displayList = searchResults !== null ? searchResults : queue;

  const handleNextTrack = useCallback(() => {
    const list = displayList;
    if (!list || list.length === 0) return;
    const currentIndex = list.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % list.length;
    selectTrack(list[nextIndex]);
  }, [displayList, currentTrack, selectTrack]);

  const handlePrevTrack = useCallback(() => {
    const list = displayList;
    if (!list || list.length === 0) return;
    const currentIndex = list.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    selectTrack(list[prevIndex]);
  }, [displayList, currentTrack, selectTrack]);

  const handleSeek = (e) => {
    const newPercent = parseFloat(e.target.value);
    const newSeconds = (newPercent / 100) * duration;
    setProgress(newSeconds);
    playerService.seek(newSeconds);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseInt(e.target.value, 10);
    setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
      playerService.setMuted(false);
    }
    playerService.setVolume(newVol);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    playerService.setMuted(nextMuted);
  };

  // Search with 400ms Debounce (Malayalam only)
  const executeSearch = useCallback(async (query, moodId) => {
    if (!query.trim() && moodId === 'all') {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const moodObj = moodChips.find((m) => m.id === moodId);

    try {
      const response = await SearchService.search({
        query,
        mood: moodId,
        presetQuery: moodObj?.presetQuery || '',
      });

      setSearchResults(response.results);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      executeSearch(val, selectedMood);
    }, 400);
  };

  const handleMoodChange = (moodId) => {
    setSelectedMood(moodId);
    executeSearch(searchQuery, moodId);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedMood('all');
    setSearchResults(null);
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume;

  return (
    <div className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[410px] max-w-full sm:max-w-[420px] transition-all duration-300 ${className}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute -top-12 left-4 right-4 sm:left-0 sm:right-0 bg-slate-900/90 text-white text-xs font-medium px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md border border-white/20 flex items-center gap-2 animate-bounce">
          <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* MINIMIZED BUBBLE */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-full shadow-2xl border border-white/90 transition-transform active:scale-95 ml-auto mr-4 mb-4 ${
            isPlaying 
              ? 'bg-sky-500 text-white animate-pulse-subtle' 
              : 'bg-white/95 text-slate-800 hover:bg-white'
          }`}
          title="Open Music Player"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Music className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold leading-none truncate max-w-[140px]">{currentTrack.title}</p>
            <p className="text-[10px] opacity-80 leading-none mt-1 truncate max-w-[140px]">{currentTrack.artist}</p>
          </div>
          <Maximize2 className="w-3.5 h-3.5 opacity-70 ml-1" />
        </button>
      ) : (
        /* AUDIO PLAYER CARD */
        <div className="glass-panel bg-white/95 backdrop-blur-md rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl shadow-sky-950/20 border border-white/90 max-h-[92vh] sm:max-h-[85vh] flex flex-col">
          
          {/* ROW 1: Squircle Icon, Title & Artist, Chevron & Minimize */}
          <div className="flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/25">
                <Music className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight truncate leading-tight" title={currentTrack.title}>
                  {currentTrack.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate leading-tight" title={currentTrack.artist}>
                  {currentTrack.artist}
                  {currentTrack.movie ? ` (${currentTrack.movie})` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                className={`p-1.5 rounded-lg transition ${
                  isPlaylistOpen 
                    ? 'text-sky-600 bg-sky-50' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/60'
                }`}
                title={isPlaylistOpen ? "Collapse playlist" : "Open search & playlist"}
                aria-label="Toggle playlist"
              >
                {isPlaylistOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100/60 rounded-lg transition"
                title="Minimize player"
                aria-label="Minimize player"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ROW 2: Soundwave ||., Seekable Progress Slider, Timestamp */}
          <div className="mt-4 flex items-center gap-2.5 shrink-0">
            <div className="flex items-end gap-1 h-5 mr-1 shrink-0 select-none" aria-hidden="true">
              <span 
                className={`w-1 bg-sky-500 rounded-full transition-all duration-300 ${
                  isPlaying ? 'h-4 animate-[equalizer_0.9s_ease-in-out_infinite]' : 'h-3.5'
                }`} 
              />
              <span 
                className={`w-1 bg-sky-500 rounded-full transition-all duration-300 ${
                  isPlaying ? 'h-5 animate-[equalizer_1.2s_ease-in-out_infinite_0.2s]' : 'h-4.5'
                }`} 
              />
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full self-end mb-0.5" />
            </div>

            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progressPercent || 0}
                onChange={handleSeek}
                className="w-full sky-slider"
                style={{
                  background: `linear-gradient(to right, #0ea5e9 ${progressPercent}%, #e0f2fe ${progressPercent}%)`
                }}
                aria-label="Track progress slider"
              />
            </div>

            <span className="text-xs text-slate-500 font-mono ml-1.5 shrink-0 select-none">
              {formatTime(progress)}
            </span>
          </div>

          {/* ROW 3: Circular Play/Pause, Skip, Volume Slider */}
          <div className="mt-4 pt-0.5 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 active:scale-95 text-white flex items-center justify-center shadow-md shadow-sky-500/30 transition cursor-pointer shrink-0"
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-white text-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevTrack}
                  className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition"
                  title="Previous track"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextTrack}
                  className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition"
                  title="Next track"
                  aria-label="Next track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={toggleMute}
                className="text-slate-600 hover:text-slate-900 transition p-1"
                title={isMuted ? "Unmute" : "Mute"}
                aria-label="Toggle mute"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2.5 flex-1 max-w-[140px] justify-end">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-18 sm:w-22 sky-slider"
                style={{
                  background: `linear-gradient(to right, #0ea5e9 ${volumePercent}%, #e0f2fe ${volumePercent}%)`
                }}
                aria-label="Volume slider"
              />
              <span className="text-xs text-slate-400 font-mono w-7 text-right select-none">
                {volumePercent}%
              </span>
            </div>
          </div>

          {/* Quick Toggle Button */}
          <div className="mt-3 pt-2.5 border-t border-sky-100/90 flex items-center justify-between shrink-0">
            <button
              onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
              className="w-full py-1.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100/80 text-sky-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Search className="w-3.5 h-3.5 text-sky-500" />
              <span>{isPlaylistOpen ? "Close Search & Playlist" : "Search & Playlist"}</span>
              {isPlaylistOpen ? <ChevronUp className="w-3.5 h-3.5 opacity-60" /> : <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
            </button>
          </div>

          {/* SEARCH & PLAYLIST SECTION (Exclusively Malayalam) */}
          {isPlaylistOpen && (
            <div className="mt-3.5 pt-1 flex flex-col flex-1 min-h-0 overflow-hidden">
              
              {/* Search Bar */}
              <div className="relative mb-2.5 shrink-0">
                <Search className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search Malayalam romantic songs or artist..."
                  value={searchQuery}
                  onChange={handleQueryChange}
                  className="w-full pl-9 pr-9 py-2 text-xs bg-sky-50/70 border border-sky-200/80 rounded-2xl placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:bg-white transition"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mood Chips: Romantic, Late Night, Acoustic Chill, Feel Good, etc. */}
              <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto pb-1 text-[11px] shrink-0">
                {moodChips.map((m) => {
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleMoodChange(m.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0 transition ${
                        isSelected
                          ? 'bg-sky-100 text-sky-800 ring-1 ring-sky-400'
                          : 'bg-white border border-slate-200/70 text-slate-600 hover:bg-sky-50'
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Section Header */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 px-1 shrink-0">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  {searchResults !== null 
                    ? `SEARCH RESULTS (${displayList.length})` 
                    : `MALAYALAM SONGS (${displayList.length})`}
                </span>
                <span className="text-[10px] text-sky-600 font-medium">
                  Tap track to play
                </span>
              </div>

              {/* Scrollable Song Items List */}
              <div className="space-y-1.5 overflow-y-auto pr-0.5 flex-1 max-h-[240px]">
                {isSearching ? (
                  <div className="space-y-2 py-4">
                    <div className="flex items-center justify-center gap-2 text-sky-600 text-xs py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Finding Malayalam songs...</span>
                    </div>
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="flex items-center gap-3 p-2 rounded-xl bg-slate-100/70 animate-pulse">
                        <div className="w-7 h-7 rounded-lg bg-slate-200" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-slate-200 rounded w-3/4" />
                          <div className="h-2.5 bg-slate-200 rounded w-1/2" />
                        </div>
                        <div className="w-10 h-3 bg-slate-200 rounded" />
                      </div>
                    ))}
                  </div>
                ) : displayList.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    <p className="font-semibold text-slate-600">No Malayalam songs found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try another song or singer name</p>
                    <button
                      onClick={clearSearch}
                      className="mt-2.5 text-[11px] text-sky-600 font-semibold underline"
                    >
                      Reset to all Malayalam songs
                    </button>
                  </div>
                ) : (
                  displayList.map((track, idx) => {
                    const isCurrent = currentTrack?.id === track.id || currentTrack?.title === track.title;

                    return (
                      <div
                        key={track.id || idx}
                        onClick={() => selectTrack(track)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl cursor-pointer text-left transition-all ${
                          isCurrent
                            ? 'bg-sky-50 text-sky-900 border-l-4 border-sky-500 font-semibold shadow-sm'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-6 h-6 flex items-center justify-center shrink-0">
                            {isCurrent && isPlaying ? (
                              <div className="flex items-end gap-0.5 h-3.5">
                                <span className="w-0.5 bg-sky-500 h-2.5 animate-[equalizer_0.9s_ease-in-out_infinite]" />
                                <span className="w-0.5 bg-sky-500 h-3.5 animate-[equalizer_1.2s_ease-in-out_infinite_0.2s]" />
                                <span className="w-0.5 bg-sky-500 h-1.5 animate-[equalizer_0.8s_ease-in-out_infinite_0.4s]" />
                              </div>
                            ) : isCurrent ? (
                              <Play className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                            ) : (
                              <span className="text-[11px] font-mono text-slate-400">
                                {idx + 1}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs truncate font-medium">
                              {track.title}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {track.artist} {track.movie ? `• ${track.movie}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="text-[10px] font-mono text-slate-400">
                            {track.duration || '3:30'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
