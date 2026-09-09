import './MarqueeStrip.css';

const items = [
  { icon: '🪔', text: 'Since 1995' },
  { icon: '🌿', text: '100% Natural Resins' },
  { icon: '🕉️', text: 'Sacred Ritual Fragrance' },
  { icon: '✨', text: 'Long Lasting Aroma' },
  { icon: '🚚', text: 'Pan-India Delivery' },
  { icon: '🛡️', text: 'Secure Packaging' },
  { icon: '⭐', text: '4.9 Star Rated' },
  { icon: '🌸', text: 'Pure Sambrani' },
];

const MarqueeStrip = () => (
  <section className="marquee-strip">
    <div className="marquee-track">
      {[...items, ...items, ...items].map((item, i) => (
        <div key={i} className="marquee-item">
          <span className="marquee-icon">{item.icon}</span>
          <span className="marquee-text">{item.text}</span>
          <span className="marquee-dot">•</span>
        </div>
      ))}
    </div>
  </section>
);

export default MarqueeStrip;
