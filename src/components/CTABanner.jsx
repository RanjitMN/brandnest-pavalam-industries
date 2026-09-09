import { Link } from 'react-router-dom';
import './CTABanner.css';

const CTABanner = () => (
  <section className="cta-banner">
    <div className="cta-orb cta-orb-1" />
    <div className="cta-orb cta-orb-2" />
    <div className="container">
      <div className="cta-inner">
        <div className="cta-icon">🪔</div>
        <h2 className="cta-title">
          Ready to Fill Your Home with<br />
          <span>Divine Fragrance?</span>
        </h2>
        <p className="cta-subtitle">
          Join 2,400+ families who trust Pavalam for their daily pooja and sacred rituals.
          <br />Free delivery on orders above ₹500!
        </p>
        <div className="cta-actions">
          <Link to="/shop" className="btn btn-secondary btn-lg" id="cta-shop-btn">
            Shop Now →
          </Link>
          <Link to="/register" className="btn cta-register-btn btn-lg" id="cta-register-btn">
            Create Account
          </Link>
        </div>
        <div className="cta-features">
          {['🌿 100% Natural', '🚚 Free Delivery ₹500+', '💰 COD Available', '⭐ 4.9 Rated'].map((f) => (
            <span key={f} className="cta-feature">{f}</span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default CTABanner;
