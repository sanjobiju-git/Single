import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music2, ChevronDown, ChevronUp } from 'lucide-react';

export default function AudioPlayer({ audioConfig, isPlaying, setIsPlaying, audioRef }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      // Audio loops naturally, but restart if needed
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };
    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioRef, volume, setIsPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch((err) => {
          console.warn("Audio play blocked or unavailable:", err);
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const seekTime = (e.target.value / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 transition-all duration-300">
      {/* Hidden Audio Tag */}
      <audio
        ref={audioRef}
        src={audioConfig.src}
        preload="auto"
        loop
      />

      {isCollapsed ? (
        /* Collapsed Floating Music Bubble */
        <button
          onClick={() => setIsCollapsed(false)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-lg border border-white/80 transition-transform active:scale-95 ${
            isPlaying 
              ? 'bg-sky-500 text-white animate-pulse-subtle' 
              : 'bg-white/90 text-sky-700 hover:bg-white'
          }`}
          title="Open Audio Player"
        >
          <Music2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
          <span className="text-xs font-medium tracking-wide">
            {isPlaying ? "Playing Music" : "Audio"}
          </span>
          <ChevronUp className="w-3.5 h-3.5 opacity-70" />
        </button>
      ) : (
        /* Expanded Minimalist Audio Player */
        <div className="glass-panel rounded-2xl shadow-xl shadow-sky-900/10 p-3 sm:p-4 border border-white/90 w-[300px] sm:w-[340px] text-slate-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`p-2 rounded-xl transition-colors ${isPlaying ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'bg-sky-100 text-sky-600'}`}>
                <Music2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate" title={audioConfig.title}>
                  {audioConfig.title}
                </p>
                <p className="text-[11px] text-slate-500 truncate" title={audioConfig.artist}>
                  {audioConfig.artist}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCollapsed(true)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-sky-100/50 transition-colors"
              title="Minimize Player"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Equalizer animation bars & Progress Slider */}
          <div className="mt-2.5 flex items-center gap-2">
            {/* Visualizer bars */}
            <div className="flex items-end gap-[2px] h-4 w-5 px-0.5 justify-center">
              <span className={`w-1 bg-sky-400 rounded-full transition-all duration-300 ${isPlaying ? 'animate-[equalizer_0.9s_ease-in-out_infinite]' : 'h-1'}`}></span>
              <span className={`w-1 bg-sky-500 rounded-full transition-all duration-300 ${isPlaying ? 'animate-[equalizer_1.2s_ease-in-out_infinite_0.2s]' : 'h-2'}`}></span>
              <span className={`w-1 bg-sky-400 rounded-full transition-all duration-300 ${isPlaying ? 'animate-[equalizer_0.8s_ease-in-out_infinite_0.4s]' : 'h-1'}`}></span>
            </div>

            {/* Scrubber slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercent || 0}
              onChange={handleSeek}
              className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
              aria-label="Audio scrubber"
            />
            <span className="text-[10px] text-slate-500 font-mono shrink-0">
              {formatTime(currentTime)}
            </span>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-sky-100/80">
            <div className="flex items-center gap-1.5">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 active:scale-95 text-white flex items-center justify-center shadow-md shadow-sky-500/20 transition"
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="w-7 h-7 rounded-full text-slate-600 hover:bg-sky-100/70 flex items-center justify-center transition"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Volume mini control */}
            <div className="flex items-center gap-1.5">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (audioRef.current) {
                    audioRef.current.volume = val;
                    if (isMuted && val > 0) {
                      setIsMuted(false);
                      audioRef.current.muted = false;
                    }
                  }
                }}
                className="w-16 h-1 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
                aria-label="Volume level"
              />
              <span className="text-[10px] text-slate-400">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>

          {audioError && (
            <p className="text-[11px] text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded">
              Could not load remote audio. You can plug in a local MP3 file in memoryConfig.js.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

