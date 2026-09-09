import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiX, FiSave, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import './AdminLayout.css';

const EMPTY_FORM = {
  name: '', slug: '', short_description: '', description: '',
  price: '', compare_price: '', stock: '', weight_grams: '', sku: '',
  category_id: '', is_active: true, is_featured: false, has_variants: false, images: [],
};
const EMPTY_VARIANT = { name: '', price: '', compare_price: '', stock: '', weight_grams: '' };

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const { data: cats } = await supabase.from('categories').select('id, name').eq('is_active', true);
        if (cats) setCategories(cats);
        if (isEdit) {
          const { data: product } = await supabase.from('products').select('*, variants:product_variants(*)').eq('id', id).single();
          if (product) {
            setForm({ ...EMPTY_FORM, ...product });
            setVariants(product.variants || []);
          }
        }
      } catch {} finally { setLoading(false); }
    };
    init();
  }, [id, isEdit]);

  const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm(f => ({ ...f, name, slug: f.slug || slugify(name) }));
  };

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setForm(f => ({ ...f, images: [...(f.images || []), imageUrl.trim()] }));
    setImageUrl('');
  };

  const removeImage = (i) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const addVariant = () => setVariants(v => [...v, { ...EMPTY_VARIANT, id: `new-${Date.now()}` }]);
  const updateVariant = (idx, field, value) => setVariants(v => v.map((x, i) => i === idx ? { ...x, [field]: value } : x));
  const removeVariant = (idx) => setVariants(v => v.filter((_, i) => i !== idx));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      toast.error('Name, price and stock are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        stock: parseInt(form.stock),
        weight_grams: form.weight_grams ? parseInt(form.weight_grams) : null,
        slug: form.slug || slugify(form.name),
        has_variants: variants.length > 0,
      };
      delete payload.variants;

      let productId = id;
      if (isEdit) {
        await supabase.from('products').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id);
      } else {
        const { data } = await supabase.from('products').insert(payload).select().single();
        productId = data?.id;
      }

      // Save variants
      if (productId) {
        await supabase.from('product_variants').delete().eq('product_id', productId);
        if (variants.length > 0) {
          const variantPayload = variants.map((v, i) => ({
            product_id: productId,
            name: v.name,
            price: parseFloat(v.price),
            compare_price: v.compare_price ? parseFloat(v.compare_price) : null,
            stock: parseInt(v.stock),
            weight_grams: v.weight_grams ? parseInt(v.weight_grams) : null,
            sort_order: i,
          }));
          await supabase.from('product_variants').insert(variantPayload);
        }
      }

      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      navigate('/admin/products');
    } catch (err) {
      toast.error('Failed to save. Check console.');
      console.error(err);
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" style={{ width: 40, height: 40, margin: '0 auto' }} /></div>;

  return (
    <form onSubmit={handleSave}>
      <div className="admin-page-header">
        <div>
          <button type="button" className="back-btn" style={{ marginBottom: '0.25rem' }} onClick={() => navigate('/admin/products')}>
            <FiArrowLeft size={14} /> Back to Products
          </button>
          <h1 className="admin-page-title">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving} id="admin-save-product-btn">
          {saving ? 'Saving...' : <><FiSave size={15} /> Save Product</>}
        </button>
      </div>

      <div className="product-form-grid">
        {/* Main Info */}
        <div className="product-form-main">
          <div className="admin-form-card">
            <h3 className="form-card-title">Basic Information</h3>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input className="form-input" value={form.name} onChange={handleNameChange} placeholder="e.g. Pavalam Premium Cup Sambrani" id="product-form-name" />
            </div>
            <div className="form-group">
              <label className="form-label">URL Slug</label>
              <input className="form-input" value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))} placeholder="auto-generated from name" id="product-form-slug" />
            </div>
            <div className="form-group">
              <label className="form-label">Short Description</label>
              <input className="form-input" value={form.short_description} onChange={e => setForm(f => ({...f, short_description: e.target.value}))} placeholder="One-line product description" id="product-form-short-desc" />
            </div>
            <div className="form-group">
              <label className="form-label">Full Description</label>
              <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={5} placeholder="Detailed product description..." id="product-form-desc" />
            </div>
          </div>

          {/* Images */}
          <div className="admin-form-card">
            <h3 className="form-card-title">Product Images</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input className="form-input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL or /images/filename.jpg" id="product-form-image-url" />
              <button type="button" className="btn btn-outline btn-sm" onClick={addImage}>Add</button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {form.images?.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '1px solid var(--color-border)' }} />
                  <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, background: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>✕</button>
                </div>
              ))}
              {(!form.images || form.images.length === 0) && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>No images added yet</p>}
            </div>
          </div>

          {/* Variants */}
          <div className="admin-form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="form-card-title" style={{ margin: 0 }}>Product Variants (Optional)</h3>
              <button type="button" className="btn btn-outline btn-sm" onClick={addVariant} id="admin-add-variant-btn">
                <FiPlus size={14} /> Add Variant
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Use variants for different pack sizes (e.g. 12 Cups, 24 Cups, 48 Cups). If no variants, the base price/stock apply.
            </p>
            {variants.map((v, i) => (
              <div key={v.id || i} className="variant-form-row">
                <div className="variant-form-grid">
                  <div className="form-group">
                    <label className="form-label">Variant Name</label>
                    <input className="form-input" value={v.name} onChange={e => updateVariant(i, 'name', e.target.value)} placeholder="e.g. 12 Cups Pack" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input type="number" className="form-input" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Compare Price (₹)</label>
                    <input type="number" className="form-input" value={v.compare_price} onChange={e => updateVariant(i, 'compare_price', e.target.value)} placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input type="number" className="form-input" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} placeholder="0" />
                  </div>
                </div>
                <button type="button" className="variant-remove-btn" onClick={() => removeVariant(i)}><FiX size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="product-form-sidebar">
          {/* Pricing */}
          <div className="admin-form-card">
            <h3 className="form-card-title">Pricing</h3>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input type="number" className="form-input" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} placeholder="0.00" id="product-form-price" />
            </div>
            <div className="form-group">
              <label className="form-label">Compare Price (₹)</label>
              <input type="number" className="form-input" value={form.compare_price} onChange={e => setForm(f => ({...f, compare_price: e.target.value}))} placeholder="0.00 (shows discount)" id="product-form-compare-price" />
            </div>
          </div>

          {/* Inventory */}
          <div className="admin-form-card">
            <h3 className="form-card-title">Inventory</h3>
            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input type="number" className="form-input" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} placeholder="0" id="product-form-stock" />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (grams)</label>
              <input type="number" className="form-input" value={form.weight_grams} onChange={e => setForm(f => ({...f, weight_grams: e.target.value}))} placeholder="0" id="product-form-weight" />
            </div>
            <div className="form-group">
              <label className="form-label">SKU (Optional)</label>
              <input className="form-input" value={form.sku} onChange={e => setForm(f => ({...f, sku: e.target.value}))} placeholder="e.g. PAV-PCS-001" id="product-form-sku" />
            </div>
          </div>

          {/* Organization */}
          <div className="admin-form-card">
            <h3 className="form-card-title">Organization</h3>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category_id} onChange={e => setForm(f => ({...f, category_id: e.target.value}))} id="product-form-category">
                <option value="">No Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({...f, is_active: e.target.checked}))} id="product-form-active" />
                <span>Active (visible in store)</span>
              </label>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({...f, is_featured: e.target.checked}))} id="product-form-featured" />
                <span>Featured (show on homepage)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .product-form-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 1024px) { .product-form-grid { grid-template-columns: 1fr 300px; align-items: start; } }
        .admin-form-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .form-card-title { font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-muted); margin-bottom: 0.25rem; }
        .product-form-sidebar .admin-form-card { margin-bottom: 1.5rem; }
        .variant-form-row { display: flex; gap: 0.75rem; align-items: flex-end; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); margin-bottom: 0.75rem; background: var(--color-bg-alt); }
        .variant-form-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 0.75rem; flex: 1; }
        @media (max-width: 768px) { .variant-form-grid { grid-template-columns: 1fr 1fr; } }
        .variant-remove-btn { width: 30px; height: 30px; background: var(--color-error-bg); border: 1px solid rgba(192,57,43,0.2); border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--color-error); flex-shrink: 0; }
        .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--color-text); cursor: pointer; }
        .checkbox-label input { accent-color: var(--color-primary); width: 16px; height: 16px; }
        .back-btn { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; color: var(--color-text-muted); background: none; border: none; cursor: pointer; font-family: var(--font-sans); padding: 0; }
        .back-btn:hover { color: var(--color-primary); }
      `}</style>
    </form>
  );
}
