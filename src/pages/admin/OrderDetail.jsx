import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { formatInr } from '../../lib/utils';
import './AdminLayout.css';

const statusOptions = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
const statusColors = {
  pending: 'badge-warning', confirmed: 'badge-info', packed: 'badge-secondary',
  shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-error',
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase.from('orders').select('*').eq('id', id).single();
        if (data) setOrder(data);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
      setOrder(o => ({ ...o, status: newStatus }));
      toast.success(`Status updated to "${newStatus}"`);
    } catch { toast.error('Failed to update status'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" style={{ width: 40, height: 40, margin: '0 auto' }} /></div>;
  if (!order) return <div className="admin-empty"><h3>Order not found</h3><button onClick={() => navigate('/admin/orders')} className="btn btn-outline">Back to Orders</button></div>;

  const addr = order.shipping_address || {};

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <button className="back-btn" onClick={() => navigate('/admin/orders')} style={{ marginBottom: '0.25rem' }}>
            <FiArrowLeft size={14} /> Back to Orders
          </button>
          <h1 className="admin-page-title">{order.order_number}</h1>
          <p className="admin-page-subtitle">
            {new Date(order.created_at).toLocaleString('en-IN')}
            {order.channel === 'offline' ? ' · Offline / counter' : ' · Online'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`badge ${statusColors[order.status] || 'badge-primary'}`} style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <select className="form-select" value={order.status} onChange={e => handleStatusUpdate(e.target.value)} id="order-detail-status" style={{ fontSize: '0.875rem' }}>
            {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Customer Info */}
        <div className="admin-form-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>Customer</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><FiPhone size={14} style={{ color: 'var(--color-primary)' }} /> <span style={{ fontWeight: 600 }}>{order.customer_name}</span></div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><FiPhone size={14} style={{ color: 'var(--color-text-muted)' }} /> {order.customer_phone}</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><FiMail size={14} style={{ color: 'var(--color-text-muted)' }} /> {order.customer_email}</div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="admin-form-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>Shipping Address</h3>
          <div style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem' }}>
            <FiMapPin size={14} style={{ color: 'var(--color-primary)', marginTop: 3, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{addr.full_name}</div>
              <div>{addr.address_line1}</div>
              {addr.address_line2 && <div>{addr.address_line2}</div>}
              <div>{addr.city}, {addr.state} — {addr.pincode}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>Order Items</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>Variant</th><th>Price</th><th>Qty</th><th>Total</th></tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{item.product_name}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{item.variant_name || '—'}</td>
                  <td>₹{formatInr(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td style={{ fontWeight: 700 }}>₹{formatInr(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ maxWidth: 280, marginLeft: 'auto', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { label: 'Subtotal', value: `₹${formatInr(order.subtotal)}` },
            { label: 'Delivery', value: Number(order.delivery_charge) === 0 ? 'Free' : `₹${formatInr(order.delivery_charge)}` },
            { label: `GST (${order.gst_rate}%)`, value: `₹${formatInr(order.gst_amount)}` },
            Number(order.discount) > 0 && { label: 'Discount', value: `-₹${formatInr(order.discount)}` },
          ].filter(Boolean).map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <span>{row.label}</span><span>{row.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
            <span>Total</span><span>₹{formatInr(order.total)}</span>
          </div>
        </div>
      </div>

      <style>{`.admin-form-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.5rem; } .back-btn { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; color: var(--color-text-muted); background: none; border: none; cursor: pointer; font-family: var(--font-sans); padding: 0; } .back-btn:hover { color: var(--color-primary); }`}</style>
    </div>
  );
}
