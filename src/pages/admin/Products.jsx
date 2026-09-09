import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import './AdminLayout.css';

const demoProducts = [
  { id: '1', name: 'Pavalam Premium Cup Sambrani', price: 149, stock: 100, is_active: true, is_featured: true, images: [] },
  { id: '2', name: 'Pavalam Heritage Collection', price: 199, stock: 75, is_active: true, is_featured: true, images: [] },
  { id: '3', name: 'Pavalam Traditional Sambrani', price: 129, stock: 120, is_active: true, is_featured: false, images: [] },
  { id: '4', name: 'Pavalam Family Pack', price: 349, stock: 50, is_active: true, is_featured: true, images: [] },
];

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*, category:categories(name)').order('created_at', { ascending: false });
      if (!error && data?.length > 0) setProducts(data);
      else setProducts(demoProducts);
    } catch { setProducts(demoProducts); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await supabase.from('products').delete().eq('id', id);
      setProducts(p => p.filter(x => x.id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggleActive = async (product) => {
    try {
      await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id);
      setProducts(p => p.map(x => x.id === product.id ? { ...x, is_active: !x.is_active } : x));
      toast.success(product.is_active ? 'Product hidden' : 'Product published');
    } catch { toast.error('Failed to update'); }
  };

  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">{products.length} products in catalog</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary" id="admin-add-product-btn">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="admin-search" style={{ marginBottom: '1.5rem' }}>
        <FiSearch size={15} className="admin-search-icon" />
        <input
          className="admin-search-input"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          id="admin-products-search"
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" style={{ width: 36, height: 36, margin: '0 auto' }} /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="admin-empty"><h3>No products found</h3></td></tr>
              ) : filtered.map(product => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0, overflow: 'hidden' }}>
                        {product.images?.[0] ? <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🪔'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{product.name}</div>
                        {product.has_variants && <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>Has Variants</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{product.category?.name || '—'}</td>
                  <td style={{ fontWeight: 700 }}>₹{product.price}</td>
                  <td>
                    <span className={`badge ${product.stock === 0 ? 'badge-error' : product.stock < 10 ? 'badge-warning' : 'badge-success'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${product.is_featured ? 'badge-secondary' : ''}`}>
                      {product.is_featured ? '⭐ Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`badge ${product.is_active ? 'badge-success' : 'badge-error'}`}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}
                      onClick={() => handleToggleActive(product)}
                      title={product.is_active ? 'Click to hide' : 'Click to publish'}
                    >
                      {product.is_active ? <><FiToggleRight size={14} /> Active</> : <><FiToggleLeft size={14} /> Hidden</>}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => navigate(`/admin/products/edit/${product.id}`)} title="Edit" id={`admin-edit-product-${product.id}`}>
                        <FiEdit2 size={14} />
                      </button>
                      <button className="table-action-btn danger" onClick={() => handleDelete(product.id)} title="Delete" id={`admin-delete-product-${product.id}`}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
