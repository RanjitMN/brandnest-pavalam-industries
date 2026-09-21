import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import PageHero from '../components/PageHero';
import './AboutPage.css';

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  { year: '1995', title: 'The first cups', text: 'Pavalam began in Tamil Nadu with a simple promise — natural resins, honest craft, fragrance for daily pooja.' },
  { year: '2008', title: 'Families across India', text: 'Word travelled from temples to homes. Packaging improved, the recipe stayed true.' },
  { year: '2018', title: 'A wider ritual range', text: 'Powder, dhoop, and festival packs joined the cup — still made for sacred spaces, not shelves of perfume.' },
  { year: 'Today', title: 'Thirty years of trust', text: 'Thousands of families light Pavalam every morning. We still source resins the way we started.' },
];

const process = [
  { step: '01', title: 'Source', text: 'Natural resins chosen for a clean, earthy burn — never synthetic fragrance oils.' },
  { step: '02', title: 'Blend', text: 'Heritage proportions mixed in small batches so the aroma stays consistent cup to cup.' },
  { step: '03', title: 'Form', text: 'Cups are shaped to sit steadily on a plate and burn evenly for 15–20 minutes.' },
  { step: '04', title: 'Bless the home', text: 'Light, wait a moment, and let the smoke carry the ritual through the room.' },
];

const values = [
  { title: 'Purity', text: 'No fillers that cheapen the burn. What you smell is resin, not a lab note.' },
  { title: 'Patience', text: 'Tradition is slow on purpose. We do not rush a cup that is meant for prayer.' },
  { title: 'Place', text: 'Tamil Nadu is not a label. It is the forests, festivals, and kitchens we come from.' },
];

export default function About() {
  const pageRef = useRef(null);
  const [activeYear, setActiveYear] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-reveal', { y: 36, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-story', start: 'top 78%' },
      });
      gsap.fromTo('.process-card', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-process-grid', start: 'top 78%' },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <CartDrawer />
      <Navbar />
      <main ref={pageRef} className="about-page">
        <PageHero
          eyebrow="Our story"
          title="Rooted in Tamil Nadu. Crafted for sacred spaces."
          subtitle="Since 1995 we have made cup sambrani the way rituals deserve — natural, unhurried, and meant to be lit."
          crumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
        />

        <section className="about-story section">
          <div className="container about-story-grid">
            <div className="about-story-media about-reveal">
              <img
                src="/images/WhatsApp Image 2026-08-24 at 7.20.31 PM (1).jpeg"
                alt="Pavalam heritage craftsmanship"
              />
              <div className="about-story-badge">
                <strong>30+</strong>
                <span>years of craft</span>
              </div>
            </div>
            <div className="about-story-copy">
              <p className="section-eyebrow about-reveal">Heritage</p>
              <h2 className="section-title about-reveal">
                Not incense as fashion.<br />
                <span className="section-title-gradient">Fragrance as ritual.</span>
              </h2>
              <p className="about-reveal about-lead">
                Pavalam Industries was born in the cultural heart of Tamil Nadu. We make cup sambrani from 100% natural resins — the sweet, earthy aroma that purifies a room and settles a home after prayer.
              </p>
              <p className="about-reveal heritage-copy">
                Every cup is a small act of continuity: the same intent as a grandmother’s pooja, packed so families anywhere in India can light it with confidence.
              </p>
            </div>
          </div>
        </section>

        <section className="about-timeline section">
          <div className="container">
            <div className="text-center" style={{ marginBottom: '2.5rem' }}>
              <p className="section-eyebrow" style={{ justifyContent: 'center' }}>The path</p>
              <h2 className="section-title">A quiet history of <span className="section-title-gradient">trust</span></h2>
            </div>
            <div className="timeline-tabs" role="tablist">
              {timeline.map((t, i) => (
                <button
                  key={t.year}
                  type="button"
                  role="tab"
                  aria-selected={activeYear === i}
                  className={`timeline-tab ${activeYear === i ? 'is-active' : ''}`}
                  onClick={() => setActiveYear(i)}
                >
                  {t.year}
                </button>
              ))}
            </div>
            <div className="timeline-panel" key={activeYear}>
              <h3>{timeline[activeYear].title}</h3>
              <p>{timeline[activeYear].text}</p>
            </div>
          </div>
        </section>

        <section className="about-process section">
          <div className="container">
            <div className="text-center" style={{ marginBottom: '2.5rem' }}>
              <p className="section-eyebrow" style={{ justifyContent: 'center' }}>How a cup is born</p>
              <h2 className="section-title">From forest resin to <span className="section-title-gradient">flame</span></h2>
            </div>
            <div className="about-process-grid">
              {process.map((p) => (
                <article key={p.step} className="process-card">
                  <span className="process-step">{p.step}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-values section">
          <div className="container about-values-grid">
            {values.map((v) => (
              <article key={v.title} className="value-card">
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-cta">
          <div className="container about-cta-inner">
            <h2>Bring the ritual home.</h2>
            <p>Explore cups, powders, and family packs made for daily pooja.</p>
            <div className="about-cta-actions">
              <Link to="/products" className="btn btn-secondary btn-lg">View products</Link>
              <Link to="/contact" className="btn about-cta-ghost btn-lg">Talk to us</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
