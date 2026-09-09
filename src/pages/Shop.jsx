import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown, FiSearch } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import './Shop.css';

const demoProducts = [
  { id: '1', name: 'Pavalam Premium Cup Sambrani', slug: 'pavalam-premium-cup-sambrani', short_description: 'Classic divine fragrance for daily prayers — 100% natural resins.', price: 149, compare_price: 199, stock: 100, is_featured: true, has_variants: true, images: ['/images/WhatsApp Image 2026-08-24 at 7.20.32 PM.jpeg'], variants: [{ id: 'v1', name: '12 Cups', price: 149, compare_price: 199, stock: 50 }, { id: 'v2', name: '24 Cups', price: 269, compare_price: 349, stock: 30 }] },
  { id: '2', name: 'Pavalam Heritage Collection', slug: 'pavalam-heritage-collection', short_description: 'Authentic heritage blend — pure natural resins, long-lasting aroma.', price: 199, compare_price: 249, stock: 75, is_featured: true, has_variants: false, images: ['/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (2).jpeg'], variants: [] },
  { id: '3', name: 'Pavalam Traditional Sambrani', slug: 'pavalam-traditional-sambrani', short_description: 'Timeless Tamil Nadu heritage blend — purifies and brings peace.', price: 129, compare_price: 169, stock: 120, is_featured: false, has_variants: false, images: ['/images/WhatsApp Image 2026-08-24 at 7.20.31 PM (1).jpeg'], variants: [] },
  { id: '4', name: 'Pavalam Family Pack', slug: 'pavalam-family-pack', short_description: 'Best value combo pack — perfect for families and festivals.', price: 349, compare_price: 450, stock: 50, is_featured: true, has_variants: false, images: ['/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (1).jpeg'], variants: [] },
];

const categories = [
  { slug: 'all', name: 'All Products' },
  { slug: 'cup-sambrani', name: 'Cup Sambrani' },
  { slug: 'sambrani-powder', name: 'Sambrani Powder' },
  { slug: 'dhoop-sticks', name: 'Dhoop Sticks' },
  { slug: 'combo-packs', name: 'Combo Packs' },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(demoProducts);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceMax, setPriceMax] = useState(1000);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*, variants:product_variants(*)')
          .eq('is_active', true);

        if (selectedCategory !== 'all') {
          const { data: catData } = await supabase.from('categories').select('id').eq('slug', selectedCategory).single();
          if (catData) query = query.eq('category_id', catData.id);
        }

        if (searchQuery) query = query.ilike('name', `%${searchQuery}%`);

        const { data, error } = await query;
        if (!error && data?.length > 0) {
          let sorted = [...data];
          if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
          if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
          if (sortBy === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
          if (sortBy === 'featured') sorted.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
          setProducts(sorted.filter(p => p.price <= priceMax));
        }
      } catch {
        // Keep demo data
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, priceMax]);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') params.delete('category');
    else params.set('category', slug);
    setSearchParams(params);
  };

  const filteredDemo = demoProducts.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (p.price > priceMax) return false;
    return true;
  });

  const displayProducts = products.length ? products : filteredDemo;

  return (
    <>
      <CartDrawer />
      <Navbar />
      <main className="shop-page">
        {/* Header */}
        <div className="shop-header">
          <div className="container">
            <h1 className="shop-title">Our Products</h1>
            <p className="shop-subtitle">Discover our complete range of sacred sambrani</p>
            <nav className="breadcrumb">
              <Link to="/">Home</Link> <span>/</span> <span>Shop</span>
            </nav>
          </div>
        </div>

        <div className="container">
          <div className="shop-layout">
            {/* Sidebar Filter */}
            <aside className={`shop-sidebar ${filterOpen ? 'open' : ''}`}>
              <div className="sidebar-header">
                <h3>Filters</h3>
                <button className="sidebar-close" onClick={() => setFilterOpen(false)}><FiX /></button>
              </div>

              {/* Search */}
              <div className="filter-section">
                <h4 className="filter-label">Search</h4>
                <div className="filter-search">
                  <FiSearch size={15} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="filter-search-input"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="filter-section">
                <h4 className="filter-label">Category</h4>
                <div className="filter-options">
                  {categories.map(cat => (
                    <label key={cat.slug} className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.slug}
                        onChange={() => handleCategoryChange(cat.slug)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h4 className="filter-label">Max Price: ₹{priceMax}</h4>
                <input
                  type="range"
                  min="100" max="1000" step="50"
                  value={priceMax}
                  onChange={e => setPriceMax(Number(e.target.value))}
                  className="price-slider"
                />
                <div className="price-range-labels">
                  <span>₹100</span>
                  <span>₹1000</span>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="shop-main">
              {/* Toolbar */}
              <div className="shop-toolbar">
                <button className="filter-toggle-btn" onClick={() => setFilterOpen(true)} id="shop-filter-btn">
                  <FiFilter size={16} /> Filters
                </button>
                <span className="product-count">{displayProducts.length} products</span>
                <div className="sort-wrap">
                  <FiChevronDown size={14} />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="sort-select"
                    id="shop-sort-select"
                  >
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="shop-grid">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="skeleton" style={{ height: 340, borderRadius: 20 }} />
                  ))}
                </div>
              ) : displayProducts.length > 0 ? (
                <div className="shop-grid">
                  {displayProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="shop-empty">
                  <span>🔍</span>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters</p>
                  <button className="btn btn-outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setPriceMax(1000); }}>
                    Clear Filters
                  </button>
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
