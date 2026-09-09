import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.fromTo(imageRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo(textRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
      "-=0.6"
    );
  }, []);

  return (
    <section className="about section" id="about" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          <div className="about-image" ref={imageRef}>
            <div className="about-image-inner">
              <img src="/images/WhatsApp Image 2026-08-24 at 7.20.31 PM (1).jpeg" alt="Pavalam Heritage" />
              <div className="experience-badge">
                <span className="number">Premium</span>
                <span className="text">Quality</span>
              </div>
            </div>
          </div>
          <div className="about-text" ref={textRef}>
            <h4 className="section-subtitle">Our Heritage</h4>
            <h2 className="section-title">Rooted in Tradition, Crafted with Purity</h2>
            <p className="about-description">
              At Pavalam Industries, we bring you the finest quality cup sambrani, made with pure and natural ingredients. Originating from the cultural heart of Tamil Nadu, our products are designed to elevate your spiritual practices.
            </p>
            <p className="about-description">
              The sweet, earthy aroma of our sambrani purifies the air, eliminates negative energy, and brings a profound sense of peace and tranquility to your home or workplace.
            </p>
            
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">🌿</div>
                <div>
                  <h4 className="feature-title">100% Natural</h4>
                  <p className="feature-desc">Sourced from the finest natural resins.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✨</div>
                <div>
                  <h4 className="feature-title">Long Lasting Aroma</h4>
                  <p className="feature-desc">Fills the room with a heavenly fragrance.</p>
                </div>
              </div>
            </div>
            
            <button className="btn btn-outline" style={{ marginTop: '2rem' }}>Learn More About Us</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
