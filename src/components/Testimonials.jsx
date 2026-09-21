import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  {
    name: 'Priya Subramaniam',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    text: 'Absolutely divine fragrance! The aroma fills the entire room and lasts for hours. Perfect for our daily pooja. We have been using Pavalam for 2 years now and will never switch.',
    product: 'Premium Cup Sambrani',
    initials: 'PS',
  },
  {
    name: 'Ramesh Kumar',
    location: 'Coimbatore, Tamil Nadu',
    rating: 5,
    text: 'Best sambrani I have ever used. The quality is outstanding and the fragrance is exactly like the traditional ones my grandmother used. Highly recommended to all devotees!',
    product: 'Heritage Collection',
    initials: 'RK',
  },
  {
    name: 'Lakshmi Devi',
    location: 'Madurai, Tamil Nadu',
    rating: 5,
    text: 'Very good quality sambrani. The heritage collection has a rich, authentic fragrance. Packaging is excellent and the delivery was very fast. Good value for money.',
    product: 'Heritage Collection',
    initials: 'LD',
  },
  {
    name: 'Muthu Krishnan',
    location: 'Tirupur, Tamil Nadu',
    rating: 5,
    text: 'Excellent product! Pure natural ingredients, no artificial fragrance. We use it for our temple daily. Fast and secure delivery. Will order again and again.',
    product: 'Traditional Sambrani',
    initials: 'MK',
  },
  {
    name: 'Anitha Rajan',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    text: 'Great value combo pack! We use Pavalam sambrani every day for pooja. The family pack lasts a full month. Delivery was quick and well packaged.',
    product: 'Family Pack',
    initials: 'AR',
  },
  {
    name: 'Sundar Raj',
    location: 'Hyderabad, Telangana',
    rating: 5,
    text: 'Found Pavalam through a friend and I am so glad I did. The aroma is heavenly and the cups burn perfectly without smoke. Great product, great price!',
    product: 'Premium Cup Sambrani',
    initials: 'SR',
  },
];

const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = parseInt(target, 10);
          const duration = 2000;
          const step = (end / duration) * 16;
          const counter = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(counter);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Testimonials = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.test-header',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      gsap.fromTo('.testimonial-card',
        { y: 40, opacity: 0, scale: 0.97 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.testimonials-scroll',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      gsap.fromTo('.testimonials-summary',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.testimonials-summary',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="testimonials section" ref={sectionRef}>
      <div className="container">
        <div className="text-center test-header" style={{ marginBottom: '3rem' }}>
          <div className="section-eyebrow">Customer Love</div>
          <h2 className="section-title">
            What Our <span className="section-title-gradient">Customers Say</span>
          </h2>
          <p className="section-subtitle">
            Over 2,400+ happy customers trust Pavalam for their daily rituals.
          </p>
        </div>

        <div className="testimonials-scroll">
          <div className="testimonials-grid">
            {reviews.map((r, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars" aria-label={`${r.rating} out of 5 stars`}>
                  {'★'.repeat(r.rating)}
                </div>
                <p className="testimonial-text">"{r.text}"</p>
                <div className="testimonial-product">
                  <span className="product-tag">{r.product}</span>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <span>{r.initials}</span>
                  </div>
                  <div>
                    <div className="author-name">{r.name}</div>
                    <div className="author-location">{r.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary bar with animated counters */}
        <div className="testimonials-summary">
          <div className="summary-stat">
            <span className="stat-value">4.9★</span>
            <span className="stat-label">Average Rating</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-stat">
            <span className="stat-value"><AnimatedCounter target="2400" suffix="+" /></span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-stat">
            <span className="stat-value"><AnimatedCounter target="98" suffix="%" /></span>
            <span className="stat-label">Repeat Orders</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-stat">
            <span className="stat-value"><AnimatedCounter target="30" suffix="+" /></span>
            <span className="stat-label">Cities Served</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
