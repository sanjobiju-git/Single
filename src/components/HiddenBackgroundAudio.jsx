import React, { useEffect, useRef } from 'react';

/**
 * Hidden Background Audio Component
 * Automatically plays the authentic track 'Uyire' by Sid Sriram (from Gauthamante Radham).
 * Completely hidden: No media player UI, infinitely looping in the background with no popups.
 */
export default function HiddenBackgroundAudio() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.6; // Gentle, soothing ambient volume
    audio.loop = true;

    const playAudio = () => {
      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // If browser restricts audio before user interaction,
          // resume immediately upon the first interaction (touch, click, scroll)
          // without displaying any popups or dialogs
          const handleFirstGesture = () => {
            audio.play().catch(() => {});
            window.removeEventListener('pointerdown', handleFirstGesture);
            window.removeEventListener('touchstart', handleFirstGesture);
            window.removeEventListener('scroll', handleFirstGesture);
            window.removeEventListener('click', handleFirstGesture);
            window.removeEventListener('keydown', handleFirstGesture);
          };

          window.addEventListener('pointerdown', handleFirstGesture, { once: true });
          window.addEventListener('touchstart', handleFirstGesture, { once: true });
          window.addEventListener('scroll', handleFirstGesture, { once: true });
          window.addEventListener('click', handleFirstGesture, { once: true });
          window.addEventListener('keydown', handleFirstGesture, { once: true });
        });
      }
    };

    playAudio();
  }, []);

  return (
    <audio
      ref={audioRef}
      preload="auto"
      loop
      style={{ display: 'none' }}
      aria-hidden="true"
    >
      <source src="/audio/uyire.m4a" type="audio/mp4" />
      <source src="/audio/uyire.mp3" type="audio/mp4" />
      <source src="https://aac.saavncdn.com/335/44431ed7aa343c931e6a360c426efe3b_320.mp4" type="audio/mp4" />
      <source src="https://aac.saavncdn.com/335/44431ed7aa343c931e6a360c426efe3b_160.mp4" type="audio/mp4" />
    </audio>
  );
}
