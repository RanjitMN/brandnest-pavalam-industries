import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from './ProductCard';
import { supabase } from '../lib/supabase';
import { isSupabaseConfigured, normalizeProduct } from '../lib/utils';
import './FeaturedProducts.css';

gsap.registerPlugin(ScrollTrigger);

const demoProducts = [
  { id: '1', name: 'Pavalam Premium Cup Sambrani', slug: 'pavalam-premium-cup-sambrani', short_description: 'Classic divine fragrance for daily prayers — 100% natural resins.', price: 149, compare_price: 199, stock: 100, is_featured: true, has_variants: true, images: ['/images/WhatsApp Image 2026-08-24 at 7.20.32 PM.jpeg'], variants: [{ id: 'v1', name: '12 Cups', price: 149, compare_price: 199, stock: 50 }, { id: 'v2', name: '24 Cups', price: 269, compare_price: 349, stock: 30 }] },
  { id: '2', name: 'Pavalam Heritage Collection', slug: 'pavalam-heritage-collection', short_description: 'Authentic heritage blend — pure natural resins, long-lasting aroma.', price: 199, compare_price: 249, stock: 75, is_featured: true, has_variants: false, images: ['/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (2).jpeg'], variants: [] },
  { id: '3', name: 'Pavalam Traditional Sambrani', slug: 'pavalam-traditional-sambrani', short_description: 'Timeless Tamil Nadu heritage blend — purifies and brings peace.', price: 129, compare_price: 169, stock: 120, is_featured: false, has_variants: false, images: ['/images/WhatsApp Image 2026-08-24 at 7.20.31 PM (1).jpeg'], variants: [] },
  { id: '4', name: 'Pavalam Family Pack', slug: 'pavalam-family-pack', short_description: 'Best value combo pack — perfect for families and festivals.', price: 349, compare_price: 450, stock: 50, is_featured: true, has_variants: false, images: ['/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (1).jpeg'], variants: [] },
];

const FeaturedProducts = () => {
  const sectionRef = useRef(null);
  const [displayProducts, setDisplayProducts] = useState(isSupabaseConfigured ? [] : demoProducts);

  useEffect(() => {
    const load = async () => {
      if (!isSupabaseConfigured) return;
      const { data, error } = await supabase
        .from('products')
        .select('*, variants:product_variants(*)')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8);
      if (!error && data?.length) setDisplayProducts(data.map(normalizeProduct));
      else if (!error && data) {
        const { data: fallback } = await supabase
          .from('products')
          .select('*, variants:product_variants(*)')
          .eq('is_active', true)
          .limit(8);
        setDisplayProducts((fallback || []).map(normalizeProduct));
      }
    };
    load();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.featured-header',
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

      gsap.fromTo('.product-card',
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.featured-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="featured-products section" ref={sectionRef}>
      <div className="container">
        <div className="text-center featured-header" style={{ marginBottom: '3rem' }}>
          <div className="section-eyebrow">Customer Favorites</div>
          <h2 className="section-title">
            Best <span className="section-title-gradient">Sellers</span>
          </h2>
          <p className="section-subtitle">
            Discover our most loved sambrani products, trusted by thousands of families for their daily spiritual practices.
          </p>
        </div>

        <div className="featured-grid">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center" style={{ marginTop: '3rem' }}>
          <Link to="/products" className="btn btn-outline btn-lg" id="featured-view-all-btn">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
