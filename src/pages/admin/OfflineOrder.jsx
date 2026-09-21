import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { insertOrderWithItems, generateOrderNumber } from '../../lib/orders';
import { formatInr, isSupabaseConfigured, normalizeProduct } from '../../lib/utils';
import './AdminLayout.css';
import './OfflineOrder.css';

const emptyLine = () => ({ productId: '', variantId: '', quantity: 1 });

export default function OfflineOrder() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    payment_method: 'cash',
    payment_status: 'paid',
    notes: '',
  });
  const [lines, setLines] = useState([emptyLine()]);

  useEffect(() => {
    const load = async () => {
      if (!isSupabaseConfigured) return;
      const { data, error } = await supabase
        .from('products')
        .select('*, variants:product_variants(*)')
        .eq('is_active', true)
        .order('name');
      if (!error && data) setProducts(data.map(normalizeProduct));
    };
    load();
  }, []);

  const catalog = useMemo(() => {
    return products.map((p) => ({
      ...p,
      variants: (p.variants || []).filter((v) => v.is_active !== false),
    }));
  }, [products]);

  const resolvedLines = lines.map((line) => {
    const product = catalog.find((p) => p.id === line.productId);
    const variant = product?.variants?.find((v) => v.id === line.variantId);
    const unit = Number(variant?.price ?? product?.price ?? 0);
    const qty = Math.max(1, Number(line.quantity) || 1);
    return {
      ...line,
      product,
      variant,
      unit,
      qty,
      total: unit * qty,
    };
  });

  const subtotal = resolvedLines.reduce((s, l) => s + l.total, 0);
  const gstRate = 5;
  const gst = (subtotal * gstRate) / 100;
  const total = subtotal + gst;

  const updateLine = (idx, patch) => {
    setLines((rows) => rows.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      toast.error('Connect Supabase to record offline orders.');
      return;
    }
    if (!form.customer_name.trim() || !form.customer_phone.trim()) {
      toast.error('Customer name and phone are required.');
      return;
    }
    const validLines = resolvedLines.filter((l) => l.product && l.qty > 0 && l.unit > 0);
    if (!validLines.length) {
      toast.error('Add at least one product.');
      return;
    }

    setSaving(true);
    try {
      const orderItems = validLines.map((l) => ({
        product_id: l.product.id,
        variant_id: l.variant?.id || null,
        product_name: l.product.name,
        variant_name: l.variant?.name || null,
        price: l.unit,
        quantity: l.qty,
        total: l.total,
        image_url: l.product.images?.[0] || null,
      }));

      const order = await insertOrderWithItems(
        {
          order_number: generateOrderNumber('OFF'),
          user_id: null,
          customer_email: form.customer_email.trim() || 'offline@pavalam.local',
          customer_name: form.customer_name.trim(),
          customer_phone: form.customer_phone.trim(),
          items: orderItems,
          subtotal,
          delivery_charge: 0,
          discount: 0,
          gst_amount: gst,
          gst_rate: gstRate,
          total,
          status: 'delivered',
          payment_method: form.payment_method,
          payment_status: form.payment_status,
          channel: 'offline',
          notes: form.notes.trim() || 'Walk-in / counter sale',
          shipping_address: {
            type: 'store_pickup',
            full_name: form.customer_name.trim(),
            phone: form.customer_phone.trim(),
            address_line1: 'In-store purchase',
            city: 'Counter',
            state: 'Tamil Nadu',
            pincode: '000000',
          },
          delivered_at: new Date().toISOString(),
        },
        orderItems
      );

      toast.success(`Offline order ${order.order_number} saved`);
      navigate(`/admin/orders/${order.id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Could not save offline order. Run the latest SQL migration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">New offline order</h1>
          <p className="admin-page-subtitle">Record a walk-in / counter sale and keep stock in sync.</p>
        </div>
      </div>

      <form className="offline-form" onSubmit={handleSubmit}>
        <section className="offline-card">
          <h2>Customer</h2>
          <div className="offline-grid">
            <label className="form-group">
              <span className="form-label">Name</span>
              <input className="form-input" value={form.customer_name} onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))} required />
            </label>
            <label className="form-group">
              <span className="form-label">Phone</span>
              <input className="form-input" value={form.customer_phone} onChange={(e) => setForm((f) => ({ ...f, customer_phone: e.target.value }))} required />
            </label>
            <label className="form-group">
              <span className="form-label">Email (optional)</span>
              <input className="form-input" type="email" value={form.customer_email} onChange={(e) => setForm((f) => ({ ...f, customer_email: e.target.value }))} />
            </label>
            <label className="form-group">
              <span className="form-label">Payment</span>
              <select className="form-select" value={form.payment_method} onChange={(e) => setForm((f) => ({ ...f, payment_method: e.target.value }))}>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="cod">COD collected</option>
              </select>
            </label>
            <label className="form-group">
              <span className="form-label">Payment status</span>
              <select className="form-select" value={form.payment_status} onChange={(e) => setForm((f) => ({ ...f, payment_status: e.target.value }))}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </label>
          </div>
        </section>

        <section className="offline-card">
          <div className="offline-card-head">
            <h2>Items</h2>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setLines((l) => [...l, emptyLine()])}>
              Add line
            </button>
          </div>
          {resolvedLines.map((line, idx) => (
            <div className="offline-line" key={idx}>
              <select
                className="form-select"
                value={line.productId}
                onChange={(e) => updateLine(idx, { productId: e.target.value, variantId: '' })}
              >
                <option value="">Select product</option>
                {catalog.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {line.product?.variants?.length > 0 && (
                <select
                  className="form-select"
                  value={line.variantId}
                  onChange={(e) => updateLine(idx, { variantId: e.target.value })}
                >
                  <option value="">Select pack</option>
                  {line.product.variants.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} — ₹{formatInr(v.price)}</option>
                  ))}
                </select>
              )}
              <input
                className="form-input"
                type="number"
                min="1"
                value={line.quantity}
                onChange={(e) => updateLine(idx, { quantity: e.target.value })}
              />
              <div className="offline-line-total">₹{formatInr(line.total)}</div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setLines((l) => l.filter((_, i) => i !== idx))} disabled={lines.length === 1}>
                Remove
              </button>
            </div>
          ))}
        </section>

        <section className="offline-card">
          <h2>Notes</h2>
          <textarea className="form-textarea" rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Counter note, bill number…" />
          <div className="offline-totals">
            <div><span>Subtotal</span><strong>₹{formatInr(subtotal)}</strong></div>
            <div><span>GST 5%</span><strong>₹{formatInr(gst)}</strong></div>
            <div className="offline-grand"><span>Total</span><strong>₹{formatInr(total)}</strong></div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save offline order'}
          </button>
        </section>
      </form>
    </div>
  );
}
