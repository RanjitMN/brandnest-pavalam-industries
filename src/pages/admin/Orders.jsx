import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import './AdminLayout.css';

const statusOptions = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'badge-warning', confirmed: 'badge-info', packed: 'badge-secondary',
  shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-error',
};

const demoOrders = [
  { id: '1', order_number: 'PAV-20260901-1234', customer_name: 'Priya Subramaniam', customer_phone: '9876543210', total: 299, status: 'delivered', payment_method: 'cod', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', order_number: 'PAV-20260902-5678', customer_name: 'Ramesh Kumar', customer_phone: '8765432109', total: 199, status: 'shipped', payment_method: 'cod', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', order_number: 'PAV-20260903-9012', customer_name: 'Lakshmi Devi', customer_phone: '7654321098', total: 349, status: 'pending', payment_method: 'cod', created_at: new Date().toISOString() },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      const { data, error } = await query;
      if (!error && data?.length > 0) setOrders(data);
      else setOrders(demoOrders);
    } catch { setOrders(demoOrders); } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

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
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="admin-search">
          <FiSearch size={15} className="admin-search-icon" />
          <input className="admin-search-input" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} id="admin-orders-search" />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
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
                  <td style={{ fontWeight: 700 }}>₹{order.total?.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-info">💵 COD</span>
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
