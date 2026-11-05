import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LightboxModal({ activeItem, onClose, onNext, onPrev, onLike, isLiked, likesCount }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeItem) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, onClose, onNext, onPrev]);

  if (!activeItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/40"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Arrows for desktop/tablets */}
          {onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/70 hover:bg-white text-slate-700 shadow-md transition hidden sm:flex items-center justify-center"
              aria-label="Previous item"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/70 hover:bg-white text-slate-700 shadow-md transition hidden sm:flex items-center justify-center"
              aria-label="Next item"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Media Viewport */}
          <div className="flex-1 bg-slate-950 flex items-center justify-center overflow-hidden min-h-[300px] max-h-[60vh] md:max-h-[85vh]">
            {activeItem.type === 'video' ? (
              <video
                src={activeItem.url}
                controls
                autoPlay
                poster={activeItem.poster}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <img
                src={activeItem.url}
                alt={activeItem.title || "Memory detail"}
                className="max-h-full max-w-full object-contain select-none"
              />
            )}
          </div>

          {/* Details Sidebar / Bottom Panel */}
          <div className="w-full md:w-80 p-5 sm:p-6 flex flex-col justify-between bg-white overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {activeItem.date && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                    <Calendar className="w-3 h-3" />
                    {activeItem.date}
                  </span>
                )}
                {activeItem.location && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {activeItem.location}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-serif font-bold text-slate-900 mt-2">
                {activeItem.title || "Special Moment"}
              </h3>

              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {activeItem.caption || activeItem.content}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onLike(activeItem.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition ${
                  isLiked
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{likesCount} {likesCount === 1 ? 'Heart' : 'Hearts'}</span>
              </button>

              <span className="text-[11px] text-slate-400">
                Tap card to zoom
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

