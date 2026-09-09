import './WhyChooseUs.css';

const features = [
  {
    icon: '🌿',
    title: '100% Natural',
    desc: 'Made from pure natural resins. No artificial chemicals, no synthetic fragrances — just authentic purity.',
    color: '#5C6E3D',
    bg: 'linear-gradient(135deg, #eef4e8, #dfecd4)',
  },
  {
    icon: '🪔',
    title: 'Sacred Quality',
    desc: 'Crafted with the reverence of decades of tradition, every cup is a commitment to spiritual excellence.',
    color: '#9B1C22',
    bg: 'linear-gradient(135deg, #fdf0ef, #fce4e4)',
  },
  {
    icon: '🚚',
    title: 'Fast Delivery',
    desc: 'Pan-India delivery at your doorstep. Free delivery on orders above ₹500 — quick and secure packaging.',
    color: '#1565C0',
    bg: 'linear-gradient(135deg, #e3f0ff, #d0e6ff)',
  },
  {
    icon: '♻️',
    title: 'Eco-Friendly',
    desc: 'Our sambrani cups are biodegradable and sustainably sourced, caring for nature as you care for your soul.',
    color: '#2D7A4F',
    bg: 'linear-gradient(135deg, #e8f5ee, #d4edde)',
  },
];

const WhyChooseUs = () => (
  <section className="why-choose section" id="about">
    <div className="container">
      <div className="text-center" style={{ marginBottom: '3rem' }}>
        <div className="section-eyebrow">Why Pavalam?</div>
        <h2 className="section-title">
          Crafted with <span className="section-title-gradient">Care & Heritage</span>
        </h2>
        <p className="section-subtitle">
          Every Pavalam product carries generations of trust, natural ingredients, and spiritual intent.
        </p>
      </div>

      <div className="why-grid">
        {features.map((f) => (
          <div
            key={f.title}
            className="why-card"
            style={{ '--why-color': f.color, '--why-bg': f.bg }}
          >
            <div className="why-icon-wrap">
              <span className="why-icon">{f.icon}</span>
            </div>
            <h3 className="why-title">{f.title}</h3>
            <p className="why-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
