import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import './AdminLayout.css';

const EMPTY = { code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '', max_uses: '', is_active: true, expires_at: '' };

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (data) setCoupons(data);
    } catch {}
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discount_value) { toast.error('Code and discount value are required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        code: form.code.toUpperCase().trim(),
        discount_value: parseFloat(form.discount_value),
        min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        expires_at: form.expires_at || null,
      };
      if (form.id) {
        await supabase.from('coupons').update(payload).eq('id', form.id);
        toast.success('Coupon updated');
      } else {
        await supabase.from('coupons').insert(payload);
        toast.success('Coupon created');
      }
      await fetchCoupons();
      setForm(null);
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await supabase.from('coupons').delete().eq('id', id);
      setCoupons(c => c.filter(x => x.id !== id));
      toast.success('Coupon deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const toggleActive = async (coupon) => {
    try {
      await supabase.from('coupons').update({ is_active: !coupon.is_active }).eq('id', coupon.id);
      setCoupons(c => c.map(x => x.id === coupon.id ? { ...x, is_active: !x.is_active } : x));
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coupons</h1>
          <p className="admin-page-subtitle">{coupons.length} coupon codes</p>
        </div>
        <button className="btn btn-primary" onClick={() => setForm(EMPTY)} id="admin-add-coupon-btn">
          <FiPlus size={16} /> Add Coupon
        </button>
      </div>

      {/* Inline Form */}
      {form && (
        <div style={{ background: 'var(--color-surface)', border: '2px solid var(--color-primary)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-serif)' }}>{form.id ? 'Edit Coupon' : 'New Coupon'}</h3>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Coupon Code *</label>
                <input className="form-input" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SAVE20" id="coupon-form-code" style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Discount Type</label>
                <select className="form-select" value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))} id="coupon-form-type">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Discount Value *</label>
                <input type="number" className="form-input" value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))} placeholder={form.discount_type === 'percentage' ? '20 (%)' : '50 (₹)'} id="coupon-form-value" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Min Order Amount (₹)</label>
                <input type="number" className="form-input" value={form.min_order_amount} onChange={e => setForm(f => ({ ...f, min_order_amount: e.target.value }))} placeholder="0 (no minimum)" id="coupon-form-min-order" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Max Uses</label>
                <input type="number" className="form-input" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} placeholder="Unlimited" id="coupon-form-max-uses" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Expiry Date</label>
                <input type="datetime-local" className="form-input" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} id="coupon-form-expiry" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /> Active
              </label>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving} id="coupon-save-btn"><FiSave size={14} /> {saving ? 'Saving...' : 'Save Coupon'}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(null)}><FiX size={14} /> Cancel</button>
            </div>
          </form>
        </div>
      )}

      {coupons.length === 0 ? (
        <div className="admin-empty">
          <FiTag size={48} strokeWidth={1} />
          <h3>No coupons yet</h3>
          <p>Create your first coupon to offer discounts to customers</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Uses</th><th>Expiry</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FiTag size={13} style={{ color: 'var(--color-primary)' }} />
                      <code style={{ fontWeight: 800, letterSpacing: '0.06em', fontSize: '0.875rem' }}>{coupon.code}</code>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{coupon.discount_type === 'percentage' ? 'Percentage' : 'Fixed'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-success)' }}>
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{coupon.min_order_amount ? `₹${coupon.min_order_amount}` : 'None'}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{coupon.uses_count || 0}{coupon.max_uses ? `/${coupon.max_uses}` : ''}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString('en-IN') : 'Never'}</td>
                  <td>
                    <button
                      className={`badge ${coupon.is_active ? 'badge-success' : 'badge-error'}`}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => toggleActive(coupon)}
                    >
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => setForm(coupon)} title="Edit" id={`admin-edit-coupon-${coupon.id}`}><FiEdit2 size={14} /></button>
                      <button className="table-action-btn danger" onClick={() => handleDelete(coupon.id)} title="Delete" id={`admin-delete-coupon-${coupon.id}`}><FiTrash2 size={14} /></button>
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
