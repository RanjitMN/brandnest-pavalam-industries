import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProductCard from './ProductCard';
import './FeaturedProducts.css';

// Fallback demo data when Supabase isn't configured
const demoProducts = [
  {
    id: '1', name: 'Pavalam Premium Cup Sambrani', slug: 'pavalam-premium-cup-sambrani',
    short_description: 'Classic divine fragrance for daily prayers — 100% natural resins.',
    price: 149, compare_price: 199, stock: 100, is_featured: true, has_variants: true,
    images: ['/images/WhatsApp Image 2026-08-24 at 7.20.32 PM.jpeg'],
    variants: [
      { id: 'v1', name: '12 Cups', price: 149, compare_price: 199, stock: 50 },
      { id: 'v2', name: '24 Cups', price: 269, compare_price: 349, stock: 30 },
      { id: 'v3', name: '48 Cups', price: 499, compare_price: 649, stock: 20 },
    ],
  },
  {
    id: '2', name: 'Pavalam Heritage Collection', slug: 'pavalam-heritage-collection',
    short_description: 'Authentic heritage blend — pure natural resins, long-lasting aroma.',
    price: 199, compare_price: 249, stock: 75, is_featured: true, has_variants: false,
    images: ['/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (2).jpeg'],
    variants: [],
  },
  {
    id: '3', name: 'Pavalam Traditional Sambrani', slug: 'pavalam-traditional-sambrani',
    short_description: 'Timeless Tamil Nadu heritage blend — purifies and brings peace.',
    price: 129, compare_price: 169, stock: 120, is_featured: false, has_variants: false,
    images: ['/images/WhatsApp Image 2026-08-24 at 7.20.31 PM (1).jpeg'],
    variants: [],
  },
  {
    id: '4', name: 'Pavalam Family Pack', slug: 'pavalam-family-pack',
    short_description: 'Best value combo pack — perfect for families and festivals.',
    price: 349, compare_price: 450, stock: 50, is_featured: true, has_variants: false,
    images: ['/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (1).jpeg'],
    variants: [],
  },
];

const FeaturedProducts = () => {
  const [products, setProducts] = useState(demoProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, variants:product_variants(*)')
          .eq('is_active', true)
          .order('is_featured', { ascending: false })
          .limit(4);
        if (!error && data?.length > 0) setProducts(data);
      } catch {
        // Use demo data
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="featured-products section" id="products">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <div className="section-eyebrow">Our Products</div>
          <h2 className="section-title">
            Bestselling <span className="section-title-gradient">Sambrani</span>
          </h2>
          <p className="section-subtitle">
            Discover our most loved products — pure, natural, and crafted to elevate your spiritual experience.
          </p>
        </div>

        {loading ? (
          <div className="products-loading">
            {[1,2,3,4].map((i) => (
              <div key={i} className="skeleton" style={{ height: 340, borderRadius: 20 }} />
            ))}
          </div>
        ) : (
          <div className="featured-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center" style={{ marginTop: '3rem' }}>
          <Link to="/shop" className="btn btn-outline btn-lg" id="featured-view-all-btn">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
