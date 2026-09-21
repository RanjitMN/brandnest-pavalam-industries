import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CategoryCards.css';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    slug: 'cup-sambrani',
    name: 'Cup Sambrani',
    desc: 'Traditional cups for daily pooja',
    image: '/images/WhatsApp Image 2026-08-24 at 7.20.32 PM.jpeg',
  },
  {
    slug: 'sambrani-powder',
    name: 'Sambrani Powder',
    desc: 'Pure powder for special rituals',
    image: '/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (2).jpeg',
  },
  {
    slug: 'dhoop-sticks',
    name: 'Dhoop Sticks',
    desc: 'Long-lasting sacred fragrance',
    image: '/images/WhatsApp Image 2026-08-24 at 7.20.31 PM (1).jpeg',
  },
  {
    slug: 'combo-packs',
    name: 'Combo Packs',
    desc: 'Best value for families',
    image: '/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (1).jpeg',
  },
];

const CategoryCards = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cat-header',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            delay: index * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 68%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="categories section" ref={sectionRef}>
      <div className="container">
        <div className="text-center cat-header" style={{ marginBottom: '2.75rem' }}>
          <div className="section-eyebrow">Collections</div>
          <h2 className="section-title">
            Shop by <span className="section-title-gradient">Category</span>
          </h2>
          <p className="section-subtitle">
            Sacred fragrance for every ritual — from daily pooja to festive celebrations.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="category-card"
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              id={`category-${cat.slug}`}
            >
              <div className="category-photo">
                <img src={cat.image} alt="" />
              </div>
              <div className="category-body">
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-desc">{cat.desc}</p>
                <span className="category-arrow">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
