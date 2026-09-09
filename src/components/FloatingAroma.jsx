import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './FloatingAroma.css';

const FloatingAroma = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const particles = containerRef.current.querySelectorAll('.smoke-particle');
    
    particles.forEach((particle, index) => {
      // Start particles near the bottom center (like a sambrani cup)
      gsap.set(particle, {
        x: 'random(-50, 50)',
        y: 'random(80, 120)', 
        opacity: 0,
        scale: 'random(0.5, 1)'
      });

      // Create flowing smoke animation
      gsap.to(particle, {
        x: '+=random(-150, 150)', // Drift horizontally
        y: '-=random(400, 600)', // Move high up
        opacity: 'random(0.3, 0.7)',
        scale: 'random(2, 4)', // Expand as it rises
        rotation: 'random(-90, 90)',
        duration: 'random(6, 12)',
        repeat: -1,
        ease: 'sine.inOut',
        delay: index * 0.5 // Stagger the start times
      });
      
      // Fade out at the end of the life
      gsap.to(particle, {
        opacity: 0,
        duration: 'random(2, 4)',
        delay: `random(4, 8) + ${index * 0.5}`,
        repeat: -1,
        repeatDelay: 'random(4, 8)'
      });
    });
  }, []);

  return (
    <div className="smoke-container" ref={containerRef}>
      {[...Array(20)].map((_, i) => (
        <div key={i} className="smoke-particle"></div>
      ))}
    </div>
  );
};

export default FloatingAroma;
