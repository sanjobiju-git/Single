import React, { useMemo } from 'react';

export default function FloatingHearts({ config }) {
  const { symbols = ["❤️", "💖", "💙", "🤍", "✨", "💕"], leftCount = 8, rightCount = 8 } = config || {};

  // Generate deterministic heart attributes so they stay stable across renders
  const leftHearts = useMemo(() => {
    return Array.from({ length: leftCount }).map((_, i) => ({
      id: `left-${i}`,
      symbol: symbols[i % symbols.length],
      leftPercent: 10 + ((i * 37) % 75), // distribute within the left gutter
      duration: 8 + ((i * 2.3) % 6), // 8s to 14s
      delay: (i * 1.4) % 7, // staggered delay
      size: 14 + ((i * 3) % 12), // 14px to 26px
      opacity: 0.45 + ((i * 0.1) % 0.4), // 0.45 to 0.85
    }));
  }, [leftCount, symbols]);

  const rightHearts = useMemo(() => {
    return Array.from({ length: rightCount }).map((_, i) => ({
      id: `right-${i}`,
      symbol: symbols[(i + 2) % symbols.length],
      rightPercent: 10 + ((i * 41) % 75), // distribute within the right gutter
      duration: 8.5 + ((i * 2.1) % 6),
      delay: (i * 1.6) % 8,
      size: 14 + ((i * 3.5) % 12),
      opacity: 0.45 + ((i * 0.1) % 0.4),
    }));
  }, [rightCount, symbols]);

  return (
    <>
      {/* Left Margin Hearts Channel */}
      <div 
        aria-hidden="true" 
        className="fixed left-0 top-0 bottom-0 w-8 sm:w-14 md:w-20 pointer-events-none z-10 overflow-hidden"
      >
        {leftHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute floating-heart-left select-none text-center"
            style={{
              left: `${heart.leftPercent}%`,
              bottom: '-30px',
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              fontSize: `${heart.size}px`,
              opacity: heart.opacity,
            }}
          >
            {heart.symbol}
          </div>
        ))}
      </div>

      {/* Right Margin Hearts Channel */}
      <div 
        aria-hidden="true" 
        className="fixed right-0 top-0 bottom-0 w-8 sm:w-14 md:w-20 pointer-events-none z-10 overflow-hidden"
      >
        {rightHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute floating-heart-right select-none text-center"
            style={{
              right: `${heart.rightPercent}%`,
              bottom: '-30px',
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              fontSize: `${heart.size}px`,
              opacity: heart.opacity,
            }}
          >
            {heart.symbol}
          </div>
        ))}
      </div>
    </>
  );
}

