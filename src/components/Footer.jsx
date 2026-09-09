import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="contact">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="footer-logo-icon">🪔</span>
                <div>
                  <span className="footer-logo-name">Pavalam</span>
                  <span className="footer-logo-sub">Industries</span>
                </div>
              </div>
              <p className="footer-brand-desc">
                Crafting India's finest cup sambrani since 1995. Pure natural resins, divine fragrances, and the essence of Tamil Nadu's spiritual heritage in every cup.
              </p>
              <div className="footer-social">
                <a href="#" className="social-btn" aria-label="Instagram" id="footer-instagram">
                  <FiInstagram size={18} />
                </a>
                <a href="#" className="social-btn" aria-label="Facebook" id="footer-facebook">
                  <FiFacebook size={18} />
                </a>
                <a href="https://wa.me" className="social-btn" aria-label="WhatsApp" id="footer-whatsapp">
                  <span style={{ fontSize: '1.1rem' }}>💬</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/#about">About Us</Link></li>
                <li><Link to="/#contact">Contact</Link></li>
                <li><Link to="/login">My Account</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-col">
              <h4 className="footer-heading">Categories</h4>
              <ul className="footer-links">
                <li><Link to="/shop?category=cup-sambrani">Cup Sambrani</Link></li>
                <li><Link to="/shop?category=sambrani-powder">Sambrani Powder</Link></li>
                <li><Link to="/shop?category=dhoop-sticks">Dhoop Sticks</Link></li>
                <li><Link to="/shop?category=combo-packs">Combo Packs</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4 className="footer-heading">Contact Us</h4>
              <div className="footer-contact-list">
                <div className="footer-contact-item">
                  <FiMapPin size={15} className="contact-icon" />
                  <span>Tamil Nadu, India</span>
                </div>
                <div className="footer-contact-item">
                  <FiPhone size={15} className="contact-icon" />
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </div>
                <div className="footer-contact-item">
                  <FiMail size={15} className="contact-icon" />
                  <a href="mailto:info@pavalam.com">info@pavalam.com</a>
                </div>
              </div>
              <div className="footer-payment">
                <p className="footer-payment-label">We Accept</p>
                <div className="payment-icons">
                  <span className="payment-chip">💵 Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <p className="footer-copy">
            © {year} Pavalam Industries. All rights reserved. Made with ❤️ in Tamil Nadu
          </p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span className="footer-dot">•</span>
            <a href="#">Terms of Service</a>
            <span className="footer-dot">•</span>
            <a href="#">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
