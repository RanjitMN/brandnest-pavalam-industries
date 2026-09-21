import { useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import RitualAltar from './RitualAltar';
import ErrorBoundary from './ErrorBoundary';
import { useGPUDetect } from '../hooks/useGPUDetect';
import './RitualAltar.css';
import './Hero.css';

const Scene3D = lazy(() => import('./Scene3D'));

const Hero = () => {
  const containerRef = useRef(null);
  const { canRender3D, checked } = useGPUDetect();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-kicker', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.1 })
        .fromTo('.hero-brand', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.4')
        .fromTo('.hero-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 }, '-=0.55')
        .fromTo('.hero-subtitle', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, '-=0.5')
        .fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
        .fromTo('.hero-visual', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 1.1 }, '-=0.9');
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const showModel = checked && canRender3D;

  return (
    <section className="hero" ref={containerRef}>
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-paisley" />
        <div className="hero-smoke hero-smoke-1" />
        <div className="hero-smoke hero-smoke-2" />
        <div className="hero-vignette" />
        <div className="hero-gold-line hero-gold-line-top" />
        <div className="hero-gold-line hero-gold-line-bot" />
      </div>

      <div className="hero-layout">
        <div className="hero-copy">
          <p className="hero-kicker">✦ Tamil Nadu · Cup Sambrani · Since 1995 ✦</p>
          <p className="hero-brand">Pavalam</p>
          <h1 className="hero-title">
            Divine aroma for pooja, festivals &amp; every sacred morning
          </h1>
          <p className="hero-subtitle">
            100% natural resins, temple-crafted cups, and a fragrance that fills the home like a blessing.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-btn">
              Shop the collection
            </Link>
            <Link to="/about" className="btn btn-outline btn-lg" id="hero-about-btn">
              Our heritage
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          {showModel ? (
            <ErrorBoundary fallback={<RitualAltar />}>
              <div className="hero-model-stage">
                <div className="hero-model-mandala" aria-hidden="true" />
                <Suspense fallback={<div className="hero-3d-loading"><div className="hero-3d-loading-ring" /></div>}>
                  <Scene3D />
                </Suspense>
              </div>
            </ErrorBoundary>
          ) : (
            <RitualAltar />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
