import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMinus, FiPlus, FiStar, FiArrowLeft, FiTruck, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../stores/cartStore';
import { isSupabaseConfigured, normalizeProduct } from '../lib/utils';
import './ProductDetail.css';

const demoProducts = {
  'pavalam-premium-cup-sambrani': {
    id: '1', name: 'Pavalam Premium Cup Sambrani', slug: 'pavalam-premium-cup-sambrani',
    description: 'The classic divine fragrance that brings tranquility to your daily prayers and rituals. Made from 100% natural resins sourced from the finest forests of Tamil Nadu. Each cup burns for 15-20 minutes, filling your home with a heavenly, long-lasting aroma.',
    short_description: 'Classic divine fragrance for daily prayers — 100% natural resins.',
    price: 149, compare_price: 199, stock: 100, is_featured: true, has_variants: true,
    images: ['/images/WhatsApp Image 2026-08-24 at 7.20.32 PM.jpeg', '/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (2).jpeg'],
    variants: [
      { id: 'v1', name: '12 Cups Pack', price: 149, compare_price: 199, stock: 50 },
      { id: 'v2', name: '24 Cups Pack', price: 269, compare_price: 349, stock: 30 },
      { id: 'v3', name: '48 Cups Pack', price: 499, compare_price: 649, stock: 20 },
    ],
  },
  'pavalam-heritage-collection': {
    id: '2', name: 'Pavalam Heritage Collection', slug: 'pavalam-heritage-collection',
    description: 'Crafted with pure natural resins for an authentic, long-lasting sacred aroma. Our heritage collection brings the finest traditional sambrani experience passed down through generations.',
    short_description: 'Authentic heritage blend — pure natural resins, long-lasting aroma.',
    price: 199, compare_price: 249, stock: 75, has_variants: false,
    images: ['/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (2).jpeg'],
    variants: [],
  },
  'pavalam-traditional-sambrani': {
    id: '3', name: 'Pavalam Traditional Sambrani', slug: 'pavalam-traditional-sambrani',
    description: 'A timeless blend rooted in Tamil Nadu heritage, purifying your sacred spaces. The sweet, earthy aroma eliminates negative energy and brings profound peace and tranquility.',
    short_description: 'Timeless Tamil Nadu heritage blend — purifies and brings peace.',
    price: 129, compare_price: 169, stock: 120, has_variants: false,
    images: ['/images/WhatsApp Image 2026-08-24 at 7.20.31 PM (1).jpeg'],
    variants: [],
  },
  'pavalam-family-pack': {
    id: '4', name: 'Pavalam Family Pack', slug: 'pavalam-family-pack',
    description: 'Value combo pack perfect for families. Contains our bestselling Cup Sambrani along with Sambrani Powder. Ideal for festivals, daily pooja, and special occasions.',
    short_description: 'Best value combo pack — perfect for families and festivals.',
    price: 349, compare_price: 450, stock: 50, has_variants: false,
    images: ['/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (1).jpeg'],
    variants: [],
  },
};

const benefits = [
  '🌿 100% natural resins — no chemicals',
  '✨ Burns for 15–20 minutes per cup',
  '🏡 Purifies air and eliminates negative energy',
  '🕉️ Perfect for daily pooja and rituals',
  '♻️ Biodegradable & eco-friendly',
];

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(
    isSupabaseConfigured ? null : (demoProducts[slug] || null)
  );
  const [selectedVariant, setSelectedVariant] = useState(
    demoProducts[slug]?.has_variants && demoProducts[slug]?.variants?.length > 0 
      ? demoProducts[slug].variants[0] 
      : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const addItem = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.openCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, variants:product_variants(*)')
          .eq('slug', slug)
          .single();
        if (!error && data) {
          const normalized = normalizeProduct(data);
          setProduct(normalized);
          if (normalized.has_variants && normalized.variants?.length > 0) {
            setSelectedVariant(normalized.variants[0]);
          } else {
            setSelectedVariant(null);
          }
        } else if (!isSupabaseConfigured && demoProducts[slug]) {
          setProduct(demoProducts[slug]);
        }
      } catch { /* keep current */ }
      finally { setLoading(false); }
    };
    setLoading(isSupabaseConfigured);
    fetchProduct();
    setQuantity(1);
    setActiveImage(0);
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="not-found-page"><div className="spinner" style={{ width: 40, height: 40 }} /></div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="not-found-page">
          <h2>Product not found</h2>
          <Link to="/products" className="btn btn-primary">Back to Shop</Link>
        </div>
        <Footer />
      </>
    );
  }

  const price = selectedVariant ? selectedVariant.price : product.price;
  const comparePrice = selectedVariant ? selectedVariant.compare_price : product.compare_price;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : product.stock > 0;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem(product, selectedVariant, quantity);
    toast.success(`${product.name} added to cart!`, { icon: '🪔' });
    openCart();
  };

  return (
    <>
      <CartDrawer />
      <Navbar />
      <main className="product-detail-page">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb" style={{ padding: '1.5rem 0 0' }}>
            <Link to="/">Home</Link> <span>/</span>
            <Link to="/products">Shop</Link> <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="product-detail-grid">
            {/* Gallery */}
            <div className="product-gallery">
              <div className="gallery-main">
                <img
                  src={product.images?.[activeImage] || '/images/WhatsApp Image 2026-08-24 at 7.20.32 PM.jpeg'}
                  alt={product.name}
                  className="gallery-main-img"
                />
                {discount > 0 && <div className="gallery-discount-badge">-{discount}%</div>}
              </div>
              {product.images?.length > 1 && (
                <div className="gallery-thumbs">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      className={`gallery-thumb ${activeImage === i ? 'active' : ''}`}
                      onClick={() => setActiveImage(i)}
                    >
                      <img src={img} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="product-detail-info">
              <h1 className="detail-name">{product.name}</h1>

              {/* Rating */}
              <div className="detail-rating">
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} size={14} style={{ color: '#D4AF37', fill: '#D4AF37' }} />
                ))}
                <span className="detail-rating-text">4.9 (128 reviews)</span>
              </div>

              {/* Price */}
              <div className="detail-price-group">
                <span className="detail-price">₹{price.toFixed(2)}</span>
                {comparePrice && <span className="detail-compare">₹{comparePrice.toFixed(2)}</span>}
                {discount > 0 && <span className="detail-save">Save {discount}%</span>}
              </div>

              <p className="detail-desc">{product.short_description}</p>

              {/* Variants */}
              {product.has_variants && product.variants?.length > 0 && (
                <div className="detail-variants">
                  <h4 className="detail-variants-label">Select Pack Size</h4>
                  <div className="variants-grid">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        className={`variant-option ${selectedVariant?.id === v.id ? 'active' : ''}`}
                        onClick={() => setSelectedVariant(v)}
                        id={`variant-option-${v.id}`}
                      >
                        <span className="variant-name">{v.name}</span>
                        <span className="variant-price">₹{v.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="detail-actions">
                <div className="detail-qty">
                  <button className="qty-btn-lg" onClick={() => setQuantity(q => Math.max(1, q - 1))} id="detail-qty-minus">
                    <FiMinus />
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button className="qty-btn-lg" onClick={() => setQuantity(q => q + 1)} id="detail-qty-plus">
                    <FiPlus />
                  </button>
                </div>
                <button
                  className={`btn btn-primary btn-lg detail-add-btn ${!inStock ? 'btn-disabled' : ''}`}
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  id="detail-add-to-cart"
                >
                  <FiShoppingCart size={18} />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              {/* Delivery info */}
              <div className="delivery-info">
                <div className="delivery-item">
                  <FiTruck size={16} className="delivery-icon" />
                  <div>
                    <strong>Pan-India Delivery</strong>
                    <p>Free delivery on orders above ₹500. Standard delivery ₹60.</p>
                  </div>
                </div>
                <div className="delivery-item">
                  <FiShield size={16} className="delivery-icon" />
                  <div>
                    <strong>Secure Packaging</strong>
                    <p>Products securely packed to preserve freshness and aroma.</p>
                  </div>
                </div>
                <div className="delivery-item">
                  <span className="delivery-icon" style={{ fontSize: '1rem' }}>💵</span>
                  <div>
                    <strong>Cash on Delivery</strong>
                    <p>Pay conveniently when your order arrives at your doorstep.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="product-tabs">
            <div className="tabs-nav">
              {['description', 'benefits', 'reviews'].map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  id={`product-tab-${tab}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="tab-pane">
                  <p>{product.description}</p>
                </div>
              )}
              {activeTab === 'benefits' && (
                <div className="tab-pane">
                  <ul className="benefits-list">
                    {benefits.map(b => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="tab-pane">
                  <div className="reviews-summary">
                    <div className="reviews-score">
                      <span className="score-value">4.9</span>
                      <div>{'⭐'.repeat(5)}</div>
                      <span>128 reviews</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
