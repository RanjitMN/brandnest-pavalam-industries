const Mandala = ({ className }) => (
  <svg className={className} viewBox="0 0 400 400" fill="none" aria-hidden="true">
    <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="1" opacity="0.35" />
    <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" opacity="0.45" />
    <circle cx="200" cy="200" r="108" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
    <circle cx="200" cy="200" r="62" stroke="currentColor" strokeWidth="1.4" />
    {[...Array(16)].map((_, i) => {
      const a = (i / 16) * Math.PI * 2;
      const x2 = 200 + Math.cos(a) * 188;
      const y2 = 200 + Math.sin(a) * 188;
      return <line key={i} x1="200" y1="200" x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.7" opacity="0.4" />;
    })}
    {[...Array(8)].map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      const x = 200 + Math.cos(a) * 108;
      const y = 200 + Math.sin(a) * 108;
      return <circle key={`p${i}`} cx={x} cy={y} r="7" fill="currentColor" opacity="0.55" />;
    })}
  </svg>
);

const petals = [
  { left: '8%', delay: '0s', dur: '11s' },
  { left: '22%', delay: '2s', dur: '13s' },
  { left: '48%', delay: '1s', dur: '10s' },
  { left: '71%', delay: '3.5s', dur: '14s' },
  { left: '88%', delay: '0.8s', dur: '12s' },
];

const RitualAltar = () => (
  <div className="ritual-altar">
    <Mandala className="ritual-mandala" />
    <div className="ritual-glow" />

    <div className="ritual-smoke ritual-smoke-a" />
    <div className="ritual-smoke ritual-smoke-b" />
    <div className="ritual-smoke ritual-smoke-c" />

    {petals.map((p, i) => (
      <span
        key={i}
        className="ritual-petal"
        style={{ left: p.left, animationDelay: p.delay, animationDuration: p.dur }}
      />
    ))}

    <figure className="ritual-frame ritual-frame-main">
      <img
        src="/images/WhatsApp Image 2026-08-24 at 7.20.32 PM.jpeg"
        alt="Pavalam premium cup sambrani"
        loading="eager"
        fetchPriority="high"
      />
      <div className="ritual-ember" />
      <figcaption>Premium Cup Sambrani</figcaption>
    </figure>

    <figure className="ritual-frame ritual-frame-a">
      <img src="/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (2).jpeg" alt="" />
    </figure>
    <figure className="ritual-frame ritual-frame-b">
      <img src="/images/WhatsApp Image 2026-08-24 at 7.20.31 PM (1).jpeg" alt="" />
    </figure>

    <div className="ritual-chip ritual-chip-1">
      <strong>Since 1995</strong>
      <span>Tamil Nadu heritage</span>
    </div>
    <div className="ritual-chip ritual-chip-2">
      <strong>4.9 ★</strong>
      <span>Loved in 30+ cities</span>
    </div>
  </div>
);

export default RitualAltar;
