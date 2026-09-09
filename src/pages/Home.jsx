import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MarqueeStrip from '../components/MarqueeStrip';
import CategoryCards from '../components/CategoryCards';
import FeaturedProducts from '../components/FeaturedProducts';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import CTABanner from '../components/CTABanner';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

// Heritage/About section inline (full width image + text)
const HeritageSection = () => (
  <section className="heritage-section" id="about-heritage">
    <div className="container">
      <div className="heritage-grid">
        {/* Image */}
        <div className="heritage-image-wrap">
          <div className="heritage-image-inner">
            <img
              src="/images/WhatsApp Image 2026-08-24 at 7.20.31 PM (1).jpeg"
              alt="Pavalam Heritage Craftsmanship"
            />
            <div className="heritage-badge">
              <span className="heritage-badge-icon">🌿</span>
              <div>
                <span className="heritage-badge-title">Since 1995</span>
                <span className="heritage-badge-sub">30+ Years of Trust</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="heritage-text">
          <div className="section-eyebrow">Our Heritage</div>
          <h2 className="section-title">
            Rooted in Tradition,<br />
            <span className="section-title-gradient">Crafted with Purity</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: '1rem' }}>
            At Pavalam Industries, we bring you the finest quality cup sambrani, made with pure and natural ingredients. Originating from the cultural heart of Tamil Nadu, our products are designed to elevate your spiritual practices.
          </p>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: '2rem' }}>
            The sweet, earthy aroma of our sambrani purifies the air, eliminates negative energy, and brings a profound sense of peace and tranquility to your home or workplace.
          </p>

          <div className="heritage-features">
            {[
              { icon: '🌿', title: '100% Natural Resins', desc: 'Sourced from the finest forests of Tamil Nadu' },
              { icon: '✨', title: 'Long Lasting Aroma', desc: 'Each cup burns for 15–20 minutes of divine fragrance' },
              { icon: '🕉️', title: 'Sacred Rituals', desc: 'Perfect for daily pooja, festivals and special occasions' },
            ].map((f) => (
              <div key={f.title} className="heritage-feature">
                <div className="heritage-feature-icon">{f.icon}</div>
                <div>
                  <h4 className="heritage-feature-title">{f.title}</h4>
                  <p className="heritage-feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .heritage-section {
        padding: 6rem 0;
        background: var(--color-surface);
      }
      .heritage-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 4rem;
        align-items: center;
      }
      @media (min-width: 1024px) {
        .heritage-grid { grid-template-columns: 1fr 1fr; }
      }
      .heritage-image-wrap {
        position: relative;
      }
      .heritage-image-inner {
        position: relative;
        border-radius: 24px;
        overflow: hidden;
      }
      .heritage-image-inner img {
        width: 100%;
        height: 460px;
        object-fit: cover;
        border-radius: 24px;
      }
      .heritage-badge {
        position: absolute;
        bottom: 24px;
        right: 24px;
        background: white;
        border-radius: 16px;
        padding: 1rem 1.25rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 8px 32px rgba(43,24,19,0.15);
        border: 1px solid var(--color-border-soft);
      }
      .heritage-badge-icon { font-size: 2rem; }
      .heritage-badge-title {
        display: block;
        font-family: var(--font-serif);
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--color-primary);
        line-height: 1.2;
      }
      .heritage-badge-sub {
        display: block;
        font-size: 0.75rem;
        color: var(--color-text-muted);
        font-weight: 500;
      }
      .heritage-text {
        display: flex;
        flex-direction: column;
        gap: 0;
      }
      .heritage-features {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .heritage-feature {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid var(--color-border);
        background: var(--color-bg-alt);
        transition: all 0.3s ease;
      }
      .heritage-feature:hover {
        border-color: var(--color-border-soft);
        transform: translateX(4px);
        box-shadow: var(--shadow-sm);
      }
      .heritage-feature-icon { font-size: 1.5rem; flex-shrink: 0; }
      .heritage-feature-title {
        font-family: var(--font-sans);
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--color-text);
        margin-bottom: 0.2rem;
      }
      .heritage-feature-desc {
        font-size: 0.82rem;
        color: var(--color-text-muted);
        line-height: 1.5;
      }
    `}</style>
  </section>
);

const Home = () => {
  return (
    <>
      <CartDrawer />
      <Navbar />
      <main>
        <Hero />
        <MarqueeStrip />
        <CategoryCards />
        <FeaturedProducts />
        <WhyChooseUs />
        <HeritageSection />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
};

export default Home;
