import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WelcomeModal({ isOpen, onClose, onEnterWithMusic, config }) {
  if (!isOpen) return null;

  const handleEnterWithMusic = () => {
    // Fire subtle pastel confetti burst
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#bae6fd', '#ffd1dc', '#fed7aa', '#ddd6fe', '#ffffff'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore if confetti fails
    }
    onEnterWithMusic();
  };

  const { autoPlayPrompt, title, artist } = config.audio || {};
  const { coupleNames, mainTitle } = config.site || {};

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white/95 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-900/20 border border-sky-100 text-center overflow-hidden"
        >
          {/* Decorative soft pastel ambient glow */}
          <div className="absolute -top-16 -left-16 w-36 h-36 bg-sky-200/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-pink-200/50 rounded-full blur-2xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-sky-300 flex items-center justify-center text-white shadow-lg shadow-sky-400/30 mb-5">
            <Heart className="w-8 h-8 fill-white/90 animate-pulse-subtle" />
            <Sparkles className="w-4 h-4 text-amber-200 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          {/* Names / Tag */}
          {coupleNames && (
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-1">
              {coupleNames}
            </p>
          )}

          {/* Main Title */}
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 tracking-tight">
            {autoPlayPrompt?.headline || mainTitle || "Welcome to Our Scrapbook"}
          </h2>

          {/* Description */}
          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
            {autoPlayPrompt?.description || "A collection of our happiest memories, moments, and love stories."}
          </p>

          {/* Song indicator card */}
          <div className="mt-5 p-3 rounded-xl bg-sky-50/80 border border-sky-100/80 flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-sky-200/80 text-sky-700 flex items-center justify-center shrink-0">
              <Music className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">{title}</p>
              <p className="text-[11px] text-slate-500 truncate">{artist}</p>
            </div>
            <span className="text-[10px] uppercase font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full shrink-0">
              Soundtrack
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={handleEnterWithMusic}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-medium text-sm shadow-lg shadow-sky-500/25 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>{autoPlayPrompt?.buttonText || "Click to Enter & Play Music ✨"}</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-6 rounded-2xl text-slate-500 hover:text-slate-700 hover:bg-slate-100/60 font-medium text-xs transition"
            >
              {autoPlayPrompt?.silentButtonText || "Explore Silently"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

