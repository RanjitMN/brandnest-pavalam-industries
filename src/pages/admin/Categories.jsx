import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import './AdminLayout.css';

const EMPTY = { name: '', slug: '', description: '', is_active: true, sort_order: 0 };

const placeholderCategories = [
  { id: '1', name: 'Cup Sambrani', slug: 'cup-sambrani', is_active: true, sort_order: 1 },
  { id: '2', name: 'Sambrani Powder', slug: 'sambrani-powder', is_active: true, sort_order: 2 },
  { id: '3', name: 'Dhoop Sticks', slug: 'dhoop-sticks', is_active: true, sort_order: 3 },
  { id: '4', name: 'Combo Packs', slug: 'combo-packs', is_active: true, sort_order: 4 },
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null); // null = closed, {} = add, {...} = edit
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('*').order('sort_order');
      if (data?.length > 0) setCategories(data);
      else setCategories(placeholderCategories);
    } catch { setCategories(placeholderCategories); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Category name is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
      if (form.id) {
        await supabase.from('categories').update(payload).eq('id', form.id);
        toast.success('Category updated');
      } else {
        await supabase.from('categories').insert(payload);
        toast.success('Category created');
      }
      await fetchCategories();
      setForm(null);
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await supabase.from('categories').delete().eq('id', id);
      setCategories(c => c.filter(x => x.id !== id));
      toast.success('Category deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const toggleActive = async (cat) => {
    try {
      await supabase.from('categories').update({ is_active: !cat.is_active }).eq('id', cat.id);
      setCategories(c => c.map(x => x.id === cat.id ? { ...x, is_active: !x.is_active } : x));
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-subtitle">{categories.length} categories</p>
        </div>
        <button className="btn btn-primary" onClick={() => setForm(EMPTY)} id="admin-add-category-btn">
          <FiPlus size={16} /> Add Category
        </button>
      </div>

      {/* Inline Form */}
      {form && (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>{form.id ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: '0.75rem', alignItems: 'end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Name *</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Category name" id="category-form-name" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Slug</label>
              <input className="form-input" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Sort Order</label>
              <input type="number" className="form-input" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) }))} placeholder="0" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving} id="category-save-btn">
                {saving ? '...' : <><FiSave size={14} /> Save</>}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(null)}><FiX size={14} /></button>
            </div>
          </form>
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Description (optional)</label>
            <input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description" />
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Slug</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id}>
                <td style={{ color: 'var(--color-text-subtle)' }}>{i + 1}</td>
                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                <td><code style={{ fontSize: '0.8rem', background: 'var(--color-bg-alt)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>{cat.slug}</code></td>
                <td>
                  <button
                    className={`badge ${cat.is_active ? 'badge-success' : 'badge-error'}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => toggleActive(cat)}
                  >
                    {cat.is_active ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="table-action-btn" onClick={() => setForm(cat)} title="Edit" id={`admin-edit-category-${cat.id}`}><FiEdit2 size={14} /></button>
                    <button className="table-action-btn danger" onClick={() => handleDelete(cat.id)} title="Delete" id={`admin-delete-category-${cat.id}`}><FiTrash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
