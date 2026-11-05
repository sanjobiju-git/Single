import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Calendar } from 'lucide-react';

export default function HeaderHero({ config, activeFilter, setActiveFilter, totalCount }) {
  const { site, filters = [] } = config;

  return (
    <header className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center max-w-3xl mx-auto px-4">
      {/* Top Tagline Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-sky-200/80 shadow-sm backdrop-blur-md text-xs font-semibold text-sky-700 mb-5"
      >
        <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
        <span>{site.taglineBadge || "Our Story"}</span>
        {site.anniversaryDate && (
          <>
            <span className="w-1 h-1 rounded-full bg-sky-300" />
            <span className="text-slate-500 font-normal">{site.anniversaryDate}</span>
          </>
        )}
      </motion.div>

      {/* Main Couple / Memory Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15]"
      >
        {site.mainTitle}
      </motion.h1>

      {/* Subtitle Message */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-4 text-base sm:text-lg text-slate-600 font-normal max-w-xl mx-auto leading-relaxed"
      >
        {site.subtitle}
      </motion.p>

      {/* Aesthetic Filter Pills */}
      {filters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-300/50'
                    : 'glass-pill text-slate-600 hover:text-sky-700 hover:bg-white/90 shadow-sm'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </motion.div>
      )}
    </header>
  );
}

