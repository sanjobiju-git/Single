import React from 'react';
import './Hero.css';

export default function Hero({ onProceed }) {
  return (
    <section className="hero-landing">
      <button
        type="button"
        className="hero-dodge-pill hero-dodge-pill--ready"
        onClick={() => {
          if (onProceed) onProceed();
        }}
      >
        Adii Broo
      </button>
    </section>
  );
}
