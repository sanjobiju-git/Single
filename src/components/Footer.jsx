import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Footer({ footerConfig }) {
  const triggerLoveExplosion = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.85 },
        colors: ['#38bdf8', '#ffd1dc', '#f472b6', '#fed7aa', '#bae6fd'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <footer className="mt-20 pb-16 text-center relative max-w-xl mx-auto px-4">
      {/* Heart button */}
      <button
        onClick={triggerLoveExplosion}
        className="w-12 h-12 mx-auto rounded-full bg-white shadow-md shadow-sky-500/10 border border-sky-100 flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-all mb-4 group"
        title="Send more love!"
      >
        <Heart className="w-5 h-5 fill-rose-400 text-rose-500 group-hover:scale-110 transition-transform" />
      </button>

      <p className="font-serif text-lg font-bold text-slate-800">
        {footerConfig.message || "Built with love & cherished memories"}
      </p>

      <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
        {footerConfig.subtext || "Here's to a million more chapters, adventures, and laughs together."}
      </p>

      <p className="text-[11px] text-sky-600/80 mt-4 font-medium">
        💡 To plug in your own photos, videos, and memories, simply edit <code className="bg-sky-100/70 px-1.5 py-0.5 rounded text-sky-800 font-mono">src/config/memoryConfig.js</code>
      </p>
    </footer>
  );
}

