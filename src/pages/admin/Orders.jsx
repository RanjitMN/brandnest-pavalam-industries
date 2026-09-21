import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiEye, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { formatInr, isSupabaseConfigured } from '../../lib/utils';
import './AdminLayout.css';

const statusOptions = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'badge-warning', confirmed: 'badge-info', packed: 'badge-secondary',
  shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-error',
};

const demoOrders = [
  { id: '1', order_number: 'PAV-20260901-1234', customer_name: 'Priya Subramaniam', customer_phone: '9876543210', total: 299, status: 'delivered', payment_method: 'cod', channel: 'online', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', order_number: 'OFF-20260902-5678', customer_name: 'Walk-in customer', customer_phone: '8765432109', total: 199, status: 'delivered', payment_method: 'cash', channel: 'offline', created_at: new Date(Date.now() - 3600000).toISOString() },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      if (channelFilter !== 'all') query = query.eq('channel', channelFilter);
      const { data, error } = await query;
      if (error) {
        if (String(error.message || '').includes('channel')) {
          let fallback = supabase.from('orders').select('*').order('created_at', { ascending: false });
          if (statusFilter !== 'all') fallback = fallback.eq('status', statusFilter);
          const res = await fallback;
          setOrders(res.data || []);
          return;
        }
        throw error;
      }
      setOrders(data || []);
    } catch {
      setOrders(isSupabaseConfigured ? [] : demoOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, channelFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId);
      setOrders(o => o.map(x => x.id === orderId ? { ...x, status: newStatus } : x));
      toast.success(`Order status updated to "${newStatus}"`);
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = orders.filter(o =>
    o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_phone?.includes(search)
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">{orders.length} total orders</p>
        </div>
        <Link to="/admin/orders/offline" className="btn btn-primary" id="admin-new-offline-order">
          <FiPlus size={16} /> New offline order
        </Link>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="admin-search">
          <FiSearch size={15} className="admin-search-icon" />
          <input className="admin-search-input" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} id="admin-orders-search" />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', 'online', 'offline'].map(s => (
            <button
              key={s}
              className={`btn btn-sm ${channelFilter === s ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setChannelFilter(s)}
            >
              {s === 'all' ? 'All channels' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          {['all', ...statusOptions].map(s => (
            <button
              key={s}
              className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setStatusFilter(s)}
              id={`orders-filter-${s}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" style={{ width: 36, height: 36, margin: '0 auto' }} /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="admin-empty"><h3>No orders found</h3></td></tr>
              ) : filtered.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{order.order_number}</td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{order.customer_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{order.customer_phone}</div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{formatInr(order.total)}</td>
                  <td>
                    <span className="badge badge-info">{(order.payment_method || 'cod').toUpperCase()}</span>
                    {order.channel === 'offline' && <span className="badge badge-secondary" style={{ marginLeft: 6 }}>Offline</span>}
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      id={`order-status-${order.id}`}
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/orders/${order.id}`} className="table-action-btn" title="View" id={`admin-view-order-${order.id}`}>
                        <FiEye size={14} />
                      </Link>
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
