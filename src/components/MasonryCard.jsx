import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, MapPin, Maximize2, Play, Sparkles, Quote as QuoteIcon, CheckCircle2 } from 'lucide-react';

export default function MasonryCard({ item, onOpenMedia, onLike, isLiked, likesCount }) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Background color schemes for letters & text blocks
  const themeClasses = {
    rose: 'bg-rose-50/90 border-rose-200/80 text-rose-950',
    sky: 'bg-sky-50/90 border-sky-200/80 text-sky-950',
    lavender: 'bg-purple-50/90 border-purple-200/80 text-purple-950',
    peach: 'bg-amber-50/90 border-amber-200/80 text-amber-950',
    mint: 'bg-emerald-50/90 border-emerald-200/80 text-emerald-950',
  };

  const cardTheme = themeClasses[item.colorTheme] || 'bg-white/90 border-white/80 text-slate-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="break-inside-avoid mb-6 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* PHOTO CARD */}
      {item.type === 'photo' && (
        <div className="glass-card rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1">
          {/* Image Container */}
          <div 
            className="relative cursor-pointer overflow-hidden bg-sky-100/50"
            onClick={() => onOpenMedia(item)}
          >
            <img
              src={item.url}
              alt={item.title || "Memory photo"}
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
              <span className="text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm bg-black/30 px-2.5 py-1 rounded-full">
                <Maximize2 className="w-3.5 h-3.5" /> Tap to expand
              </span>
            </div>

            {/* Date Badge */}
            {item.date && (
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-800 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                  <Calendar className="w-3 h-3 text-sky-600" />
                  {item.date}
                </span>
              </div>
            )}
          </div>

          {/* Card Info Content */}
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-slate-800 text-lg group-hover:text-sky-600 transition-colors">
                  {item.title}
                </h3>
                {item.location && (
                  <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {item.location}
                  </p>
                )}
              </div>

              {/* Heart reaction button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(item.id);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition active:scale-90 ${
                  isLiked 
                    ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                }`}
                title="Send love"
              >
                <Heart className={`w-3.5 h-3.5 transition-transform ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                <span>{likesCount}</span>
              </button>
            </div>

            {item.caption && (
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                {item.caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* VIDEO CARD */}
      {item.type === 'video' && (
        <div className="glass-card rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1">
          <div className="relative overflow-hidden bg-slate-900 group/video">
            <video
              src={item.url}
              poster={item.poster}
              controls
              playsInline
              preload="metadata"
              className="w-full h-auto max-h-[420px] object-cover"
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
            />

            {/* Video overlay badge */}
            <div className="absolute top-3 right-3 pointer-events-none">
              <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
                Video Clip
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-slate-800 text-lg group-hover:text-sky-600 transition-colors">
                  {item.title}
                </h3>
                {item.date && (
                  <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <Calendar className="w-3 h-3 text-sky-500" />
                    {item.date}
                  </p>
                )}
              </div>

              <button
                onClick={() => onLike(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition active:scale-90 ${
                  isLiked 
                    ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{likesCount}</span>
              </button>
            </div>

            {item.caption && (
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                {item.caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* LOVE LETTER / NOTE CARD */}
      {item.type === 'letter' && (
        <div className={`rounded-3xl p-6 sm:p-7 border shadow-lg shadow-sky-950/5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${cardTheme}`}>
          {/* Aesthetic tape strip effect */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/70 backdrop-blur-sm border border-black/5 rotate-[-2deg] rounded-sm shadow-sm pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs font-medium opacity-70">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{item.date || "Love Note"}</span>
            </div>

            <button
              onClick={() => onLike(item.id)}
              className="p-1.5 rounded-full hover:bg-white/80 transition"
              title="Love this note"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'opacity-60'}`} />
            </button>
          </div>

          <h3 className="font-serif font-bold text-xl mb-3">
            {item.title}
          </h3>

          <p className="text-sm sm:text-base leading-relaxed opacity-90 whitespace-pre-line font-sans">
            "{item.content}"
          </p>

          {item.author && (
            <div className="mt-5 text-right">
              <span className="font-handwriting text-xl sm:text-2xl text-sky-800">
                — {item.author}
              </span>
            </div>
          )}
        </div>
      )}

      {/* QUOTE CARD */}
      {item.type === 'quote' && (
        <div className="glass-card rounded-3xl p-6 sm:p-7 relative border-l-4 border-l-sky-400 hover:-translate-y-1 transition-all duration-300">
          <QuoteIcon className="w-8 h-8 text-sky-300/80 mb-3" />
          <blockquote className="font-serif italic text-base sm:text-lg text-slate-800 leading-relaxed">
            "{item.quote}"
          </blockquote>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500">
              — {item.author}
            </span>

            <button
              onClick={() => onLike(item.id)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-500 transition"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      )}

      {/* MILESTONE CARD */}
      {item.type === 'milestone' && (
        <div className="glass-card rounded-3xl p-6 sm:p-7 relative overflow-hidden hover:-translate-y-1 transition-all duration-300 border border-sky-200/80 bg-gradient-to-br from-white/95 to-sky-50/70">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl p-2 rounded-2xl bg-sky-100/80 inline-block shadow-inner">
              {item.icon || "⭐"}
            </span>

            {item.date && (
              <span className="text-[11px] font-semibold text-sky-700 bg-sky-100/70 px-3 py-1 rounded-full">
                {item.date}
              </span>
            )}
          </div>

          <h3 className="text-xl font-serif font-bold text-slate-900 mt-2">
            {item.title}
          </h3>

          {item.subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              {item.subtitle}
            </p>
          )}

          {item.details && item.details.length > 0 && (
            <ul className="mt-4 space-y-2 border-t border-sky-100 pt-3">
              {item.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 mt-0.5 shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 pt-3 flex justify-end">
            <button
              onClick={() => onLike(item.id)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-500 transition"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount} loved</span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

