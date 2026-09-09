import { Link } from 'react-router-dom';
import './CategoryCards.css';

const categories = [
  {
    slug: 'cup-sambrani',
    name: 'Cup Sambrani',
    desc: 'Traditional cups for daily pooja',
    icon: '🪔',
    color: '#9B1C22',
    bg: 'linear-gradient(135deg, #fdf0ef, #fce4e4)',
  },
  {
    slug: 'sambrani-powder',
    name: 'Sambrani Powder',
    desc: 'Pure powder for special rituals',
    icon: '🌿',
    color: '#5C6E3D',
    bg: 'linear-gradient(135deg, #eef4e8, #dfecd4)',
  },
  {
    slug: 'dhoop-sticks',
    name: 'Dhoop Sticks',
    desc: 'Long-lasting dhoop fragrance',
    icon: '🌸',
    color: '#8B4513',
    bg: 'linear-gradient(135deg, #fdf4e8, #fae5cb)',
  },
  {
    slug: 'combo-packs',
    name: 'Combo Packs',
    desc: 'Best value for families',
    icon: '🎁',
    color: '#D4AF37',
    bg: 'linear-gradient(135deg, #fdf9e6, #faefc8)',
  },
];

const CategoryCards = () => (
  <section className="categories section">
    <div className="container">
      <div className="text-center" style={{ marginBottom: '3rem' }}>
        <div className="section-eyebrow">Browse Categories</div>
        <h2 className="section-title">
          Shop by <span className="section-title-gradient">Category</span>
        </h2>
        <p className="section-subtitle">
          Explore our curated collection of sacred fragrance products, each crafted for your spiritual journey.
        </p>
      </div>

      <div className="category-grid">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop?category=${cat.slug}`}
            className="category-card"
            style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
            id={`category-${cat.slug}`}
          >
            <div className="category-icon-wrap">
              <span className="category-icon">{cat.icon}</span>
            </div>
            <h3 className="category-name">{cat.name}</h3>
            <p className="category-desc">{cat.desc}</p>
            <span className="category-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryCards;
