import './Testimonials.css';

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

const Testimonials = () => {
  return (
    <section className="testimonials section" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <div className="section-eyebrow">Customer Love</div>
          <h2 className="section-title">
            What Our <span className="section-title-gradient">Customers Say</span>
          </h2>
          <p className="section-subtitle">
            Over 2,400+ happy customers trust Pavalam for their daily rituals.
          </p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((r, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">
                {'⭐'.repeat(r.rating)}
              </div>
              <p className="testimonial-text">"{r.text}"</p>
              <div className="testimonial-product">
                <span className="product-tag">🪔 {r.product}</span>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <span>{r.initials}</span>
                </div>
                <div>
                  <div className="author-name">{r.name}</div>
                  <div className="author-location">📍 {r.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div className="testimonials-summary">
          <div className="summary-stat">
            <span className="stat-value">4.9★</span>
            <span className="stat-label">Average Rating</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-stat">
            <span className="stat-value">2,400+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-stat">
            <span className="stat-value">98%</span>
            <span className="stat-label">Repeat Orders</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-stat">
            <span className="stat-value">30+</span>
            <span className="stat-label">Cities Served</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
