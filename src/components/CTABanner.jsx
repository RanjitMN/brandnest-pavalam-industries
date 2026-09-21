import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CTABanner.css';

gsap.registerPlugin(ScrollTrigger);

const CTABanner = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-inner',
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="cta-banner" ref={sectionRef}>
      <div className="cta-glow" aria-hidden="true" />
      <div className="container">
        <div className="cta-inner">
          <p className="cta-eyebrow">Bring the aroma home</p>
          <h2 className="cta-title">
            Ready for divine fragrance?
          </h2>
          <p className="cta-subtitle">
            Trusted by thousands of families for daily pooja. Free delivery on orders above ₹500.
          </p>
          <div className="cta-actions">
            <Link to="/products" className="btn btn-secondary btn-lg" id="cta-shop-btn">
              Shop Now
            </Link>
            <Link to="/register" className="btn cta-register-btn btn-lg" id="cta-register-btn">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
