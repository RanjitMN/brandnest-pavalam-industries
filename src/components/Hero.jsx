import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import './Hero.css';

const Hero = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-eyebrow', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.fromTo('.hero-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.35, ease: 'power3.out' });
      gsap.fromTo('.hero-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: 'power3.out' });
      gsap.fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.65, ease: 'power3.out' });
      gsap.fromTo('.hero-trust-badges', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.8, ease: 'power3.out' });
      gsap.fromTo('.hero-image-wrap', { x: 60, opacity: 0, scale: 0.92 }, { x: 0, opacity: 1, scale: 1, duration: 1.1, delay: 0.3, ease: 'power3.out' });
      gsap.fromTo('.hero-particle', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.9, ease: 'back.out(1.7)' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const particles = [
    { emoji: '🪔', x: '10%', y: '20%', size: 28 },
    { emoji: '✨', x: '85%', y: '15%', size: 22 },
    { emoji: '🌿', x: '5%', y: '70%', size: 24 },
    { emoji: '🕉️', x: '88%', y: '75%', size: 26 },
    { emoji: '✨', x: '50%', y: '5%', size: 18 },
  ];

  return (
    <section className="hero" ref={containerRef}>
      {/* Decorative particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="hero-particle"
          style={{ left: p.x, top: p.y, fontSize: p.size }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Background gradient orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />

      <div className="container">
        <div className="hero-grid">
          {/* Text Side */}
          <div className="hero-text-side">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              Premium Cup Sambrani — Since 1995
            </div>

            <h1 className="hero-title">
              Experience the<br />
              <span className="hero-title-highlight">Divine Aroma</span><br />
              of Pavalam
            </h1>

            <p className="hero-subtitle">
              Authentic cup sambrani crafted with 100% natural resins from Tamil Nadu's finest forests. Bringing peace, purity, and heavenly fragrance to your sacred spaces.
            </p>

            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary btn-lg" id="hero-shop-btn">
                Shop Now
              </Link>
              <Link to="/#about" className="btn btn-outline btn-lg" id="hero-about-btn">
                Our Heritage
              </Link>
            </div>

            {/* Trust badges */}
            <div className="hero-trust-badges">
              {[
                { icon: '🌿', label: '100% Natural' },
                { icon: '🚚', label: 'Pan-India Delivery' },
                { icon: '⭐', label: '4.9★ Rated' },
                { icon: '🛡️', label: 'Secure Orders' },
              ].map((badge) => (
                <div key={badge.label} className="trust-badge">
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Side */}
          <div className="hero-image-wrap">
            <div className="hero-image-glow" />
            <div className="hero-image-container">
              <img
                src="/images/WhatsApp Image 2026-08-24 at 7.20.32 PM.jpeg"
                alt="Pavalam Premium Cup Sambrani"
                className="hero-img"
              />
              {/* Floating info card */}
              <div className="hero-float-card">
                <div className="float-card-icon">🪔</div>
                <div>
                  <div className="float-card-title">Best Seller</div>
                  <div className="float-card-sub">Premium Cup Sambrani</div>
                </div>
                <div className="float-card-price">₹149</div>
              </div>
              {/* Floating rating */}
              <div className="hero-float-rating">
                <span>⭐⭐⭐⭐⭐</span>
                <span className="rating-count">2,400+ happy customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--color-bg)" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
