import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeritageStrip.css';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: '🪔', title: 'Since 1995', desc: 'Decades of sacred tradition' },
  { icon: '🌿', title: '100% Natural', desc: 'Pure resin ingredients' },
  { icon: '🕉️', title: 'Sacred Rituals', desc: 'For daily pooja & prayers' },
  { icon: '✨', title: 'Long Lasting', desc: 'Divine fragrance for hours' },
];

const HeritageStrip = () => {
  const stripRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current.forEach((item, index) => {
      gsap.fromTo(item,
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: index * 0.12,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: stripRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);

  return (
    <section className="heritage-strip" ref={stripRef}>
      <div className="container">
        <div className="heritage-grid">
          {features.map((feature, index) => (
            <div 
              className="heritage-item" 
              key={index}
              ref={el => itemsRef.current[index] = el}
            >
              <div className="heritage-icon">{feature.icon}</div>
              <h4 className="heritage-title">{feature.title}</h4>
              <p className="heritage-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeritageStrip;
