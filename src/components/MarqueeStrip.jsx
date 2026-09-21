import { useState } from 'react';
import './MarqueeStrip.css';

const items = [
  'Since 1995',
  '100% Natural Resins',
  'Sacred Ritual Fragrance',
  'Long Lasting Aroma',
  'Pan-India Delivery',
  'Secure Packaging',
  '4.9 Star Rated',
  'Pure Cup Sambrani',
];

const MarqueeStrip = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      className="marquee-strip"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Brand highlights"
    >
      <div className="marquee-fade marquee-fade-left" aria-hidden="true" />
      <div className={`marquee-track ${isPaused ? 'paused' : ''}`}>
        {[...items, ...items, ...items].map((text, i) => (
          <div key={i} className="marquee-item">
            <span className="marquee-text">{text}</span>
            <span className="marquee-dot" aria-hidden="true">✦</span>
          </div>
        ))}
      </div>
      <div className="marquee-fade marquee-fade-right" aria-hidden="true" />
    </section>
  );
};

export default MarqueeStrip;
