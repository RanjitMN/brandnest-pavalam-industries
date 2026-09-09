import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProductShowcase.css';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    name: 'Pavalam Premium Cup Sambrani',
    desc: 'The classic divine fragrance that brings tranquility to your daily prayers and rituals.',
    image: '/images/WhatsApp Image 2026-08-24 at 7.20.32 PM.jpeg',
  },
  {
    id: 2,
    name: 'Pavalam Heritage Collection',
    desc: 'Crafted with pure natural resins for an authentic, long-lasting sacred aroma.',
    image: '/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (2).jpeg',
  },
  {
    id: 3,
    name: 'Pavalam Traditional Sambrani',
    desc: 'A timeless blend rooted in Tamil Nadu heritage, purifying your sacred spaces.',
    image: '/images/WhatsApp Image 2026-08-24 at 7.20.31 PM (1).jpeg',
  },
];

const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(card,
        { y: 60, opacity: 0, rotateX: 8 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);

  return (
    <section className="products section" id="products" ref={sectionRef}>
      <div className="section-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6.01,68.42-16.4,96.91-28.13L1200,0Z" fill="var(--color-surface)" />
        </svg>
      </div>
      <div className="container">
        <div className="text-center">
          <span className="section-badge">Our Collections</span>
          <h2 className="section-title">Premium Cup Sambrani</h2>
          <p className="section-subtitle" style={{marginBottom: '4rem'}}>
            Discover our range of meticulously crafted sambrani cups, designed to elevate your spiritual journey.
          </p>
        </div>
        
        <div className="product-grid">
          {products.map((product, index) => (
            <div 
              className="product-card" 
              key={product.id}
              ref={el => cardsRef.current[index] = el}
            >
              <div className="product-image-container">
                <img src={product.image} alt={product.name} />
                <div className="product-overlay">
                  <button className="btn btn-primary">Quick View</button>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.desc}</p>
                <div className="product-footer">
                  <span className="product-price">Explore →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
