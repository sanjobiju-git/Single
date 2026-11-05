import React, { useState, useEffect, useMemo } from 'react';
import { memoryConfig } from './config/memoryConfig';
import FloatingHearts from './components/FloatingHearts';
import HiddenBackgroundAudio from './components/HiddenBackgroundAudio';
import GhostFibers from './components/GhostFibers';
import Hero from './components/Hero';
import MasonryCard from './components/MasonryCard';
import LightboxModal from './components/LightboxModal';
import HeaderHero from './components/HeaderHero';
import Footer from './components/Footer';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxItem, setLightboxItem] = useState(null);

  // Persistent Likes State via localStorage
  const [likesState, setLikesState] = useState(() => {
    try {
      const saved = localStorage.getItem('memory_likes_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial = {};
    memoryConfig.memories.forEach((m) => {
      initial[m.id] = {
        count: m.initialLikes || 0,
        liked: false,
      };
    });
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem('memory_likes_v1', JSON.stringify(likesState));
    } catch {}
  }, [likesState]);

  const handleToggleLike = (id) => {
    setLikesState((prev) => {
      const current = prev[id] || { count: 0, liked: false };
      const isLiked = !current.liked;
      const newCount = isLiked ? current.count + 1 : Math.max(0, current.count - 1);
      return {
        ...prev,
        [id]: { count: newCount, liked: isLiked },
      };
    });
  };

  // Filter memories based on active category
  const filteredMemories = useMemo(() => {
    if (activeFilter === 'all') return memoryConfig.memories;
    return memoryConfig.memories.filter((item) => item.tag === activeFilter);
  }, [activeFilter]);

  // Media list for lightbox navigation (photos and videos only)
  const mediaItems = useMemo(() => {
    return memoryConfig.memories.filter((item) => item.type === 'photo' || item.type === 'video');
  }, []);

  const currentMediaIndex = useMemo(() => {
    if (!lightboxItem) return -1;
    return mediaItems.findIndex((m) => m.id === lightboxItem.id);
  }, [lightboxItem, mediaItems]);

  const handleNextMedia = () => {
    if (currentMediaIndex >= 0 && currentMediaIndex < mediaItems.length - 1) {
      setLightboxItem(mediaItems[currentMediaIndex + 1]);
    } else if (mediaItems.length > 0) {
      setLightboxItem(mediaItems[0]);
    }
  };

  const handlePrevMedia = () => {
    if (currentMediaIndex > 0) {
      setLightboxItem(mediaItems[currentMediaIndex - 1]);
    } else if (mediaItems.length > 0) {
      setLightboxItem(mediaItems[mediaItems.length - 1]);
    }
  };

  if (!hasEntered) {
    return (
      <div className="w-full h-screen min-h-screen overflow-hidden">
        <Hero onProceed={() => setHasEntered(true)} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-800 antialiased selection:bg-pink-200 selection:text-pink-900 transition-opacity duration-700">
      {/* Hidden Infinite Background Audio: 'Uyire' by Sid Sriram */}
      <HiddenBackgroundAudio />

      {/* Dynamic GhostFibers Background Animation (React Bits) */}
      {memoryConfig.ghostFibers?.enabled && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-85 transition-opacity duration-700"
          aria-hidden="true"
        >
          <GhostFibers
            {...memoryConfig.ghostFibers}
          />
        </div>
      )}

      {/* 1. Continuous Floating Love Hearts along Left & Right Margins */}
      {memoryConfig.floatingHearts?.enabled && (
        <FloatingHearts config={memoryConfig.floatingHearts} />
      )}

      {/* 2. Main Page Container */}
      <div className="relative z-10 px-4 sm:px-10 md:px-16 lg:px-20 max-w-7xl mx-auto">
        {/* Header Hero Section */}
        <HeaderHero
          config={memoryConfig}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          totalCount={memoryConfig.memories.length}
        />

        {/* 3. Central Responsive Aesthetic Masonry Grid */}
        <main className="mt-8">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-20 bg-white/40 rounded-3xl backdrop-blur-sm border border-white/60">
              <p className="text-slate-500 font-medium">No memories found in this category.</p>
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-3 text-xs font-semibold text-sky-600 hover:underline"
              >
                View all memories
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
              {filteredMemories.map((item) => {
                const likeData = likesState[item.id] || { count: item.initialLikes || 0, liked: false };
                return (
                  <MasonryCard
                    key={item.id}
                    item={item}
                    onOpenMedia={setLightboxItem}
                    onLike={handleToggleLike}
                    isLiked={likeData.liked}
                    likesCount={likeData.count}
                  />
                );
              })}
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer footerConfig={memoryConfig.footer} />
      </div>

      {/* 4. High-Res Media Lightbox Modal */}
      <LightboxModal
        activeItem={lightboxItem}
        onClose={() => setLightboxItem(null)}
        onNext={mediaItems.length > 1 ? handleNextMedia : undefined}
        onPrev={mediaItems.length > 1 ? handlePrevMedia : undefined}
        onLike={handleToggleLike}
        isLiked={lightboxItem ? likesState[lightboxItem.id]?.liked : false}
        likesCount={lightboxItem ? likesState[lightboxItem.id]?.count : 0}
      />
    </div>
  );
}
