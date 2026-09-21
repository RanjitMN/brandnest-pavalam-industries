import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WhyChooseUs.css';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: '100% Natural',
    desc: 'Pure resins only — no synthetic fragrance, no artificial fillers.',
  },
  {
    title: 'Temple Craft',
    desc: 'Decades of Tamil Nadu tradition in every carefully made cup.',
  },
  {
    title: 'Pan-India',
    desc: 'Reliable delivery nationwide. Free shipping on orders above ₹500.',
  },
  {
    title: 'Earth Kind',
    desc: 'Biodegradable cups from sustainably sourced natural materials.',
  },
];

const WhyChooseUs = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.why-header',
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

      gsap.fromTo(
        '.why-item',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.why-grid',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="why-choose section" id="about" ref={sectionRef}>
      <div className="container">
        <div className="text-center why-header" style={{ marginBottom: '2.75rem' }}>
          <div className="section-eyebrow">Why Pavalam</div>
          <h2 className="section-title">
            Crafted with <span className="section-title-gradient">care & heritage</span>
          </h2>
          <p className="section-subtitle">
            Every cup carries natural ingredients, spiritual intent, and generations of trust.
          </p>
        </div>

        <div className="why-grid">
          {features.map((f, i) => (
            <div key={f.title} className="why-item">
              <span className="why-index">0{i + 1}</span>
              <h3 className="why-title">{f.title}</h3>
              <p className="why-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
