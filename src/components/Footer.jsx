import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BrandLogo from './BrandLogo';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const year = new Date().getFullYear();
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-brand, .footer-col',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" id="contact" ref={footerRef}>
      {/* Wave separator */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,0 L0,0 Z" fill="var(--color-bg)" />
        </svg>
      </div>

      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <BrandLogo height={56} />
              </Link>
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
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/login">My Account</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-col">
              <h4 className="footer-heading">Categories</h4>
              <ul className="footer-links">
                <li><Link to="/products?category=cup-sambrani">Cup Sambrani</Link></li>
                <li><Link to="/products?category=sambrani-powder">Sambrani Powder</Link></li>
                <li><Link to="/products?category=dhoop-sticks">Dhoop Sticks</Link></li>
                <li><Link to="/products?category=combo-packs">Combo Packs</Link></li>
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
