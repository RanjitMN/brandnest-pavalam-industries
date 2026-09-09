import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiUsers, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import './AdminLayout.css';

const statusColors = {
  pending: 'badge-warning', confirmed: 'badge-info', packed: 'badge-secondary',
  shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-error',
};

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, products: 0, customers: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [ordersRes, productsRes, customersRes, recentRes, lowStockRes] = await Promise.all([
          supabase.from('orders').select('id, total, status'),
          supabase.from('products').select('id').eq('is_active', true),
          supabase.from('profiles').select('id').eq('role', 'customer'),
          supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('products').select('id, name, stock').eq('is_active', true).lt('stock', 10).order('stock'),
        ]);

        const orders = ordersRes.data || [];
        const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
        setStats({
          orders: orders.length,
          products: productsRes.data?.length || 0,
          customers: customersRes.data?.length || 0,
          revenue,
        });
        setRecentOrders(recentRes.data || []);
        setLowStock(lowStockRes.data || []);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  // Demo data if supabase not connected
  const displayOrders = recentOrders.length > 0 ? recentOrders : [
    { id: '1', order_number: 'PAV-20260901-1234', customer_name: 'Priya S.', total: 299, status: 'delivered', created_at: new Date().toISOString() },
    { id: '2', order_number: 'PAV-20260902-5678', customer_name: 'Ramesh K.', total: 199, status: 'shipped', created_at: new Date().toISOString() },
    { id: '3', order_number: 'PAV-20260903-9012', customer_name: 'Lakshmi D.', total: 349, status: 'pending', created_at: new Date().toISOString() },
  ];

  const statData = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toFixed(0)}`, icon: <FiTrendingUp size={20} />, color: 'var(--color-primary)', change: '+12% this month' },
    { label: 'Total Orders', value: stats.orders || '24', icon: <FiShoppingBag size={20} />, color: 'var(--color-secondary)', change: '+5 today' },
    { label: 'Products', value: stats.products || '4', icon: <FiPackage size={20} />, color: '#1565C0', change: 'In catalog' },
    { label: 'Customers', value: stats.customers || '128', icon: <FiUsers size={20} />, color: 'var(--color-success)', change: '+8 this week' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back! Here's what's happening with Pavalam today.</p>
        </div>
        <Link to="/admin/orders" className="btn btn-primary btn-sm" id="admin-view-orders-btn">
          View All Orders
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        {statData.map(s => (
          <div key={s.label} className="stat-card" style={{ '--stat-color': s.color }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-change" style={{ color: 'var(--color-success)' }}>{s.change}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div>
          <div className="admin-page-header" style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Recent Orders</h2>
            <Link to="/admin/orders" className="btn btn-outline btn-sm" id="admin-all-orders-link">View All</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map(order => (
                  <tr key={order.id}>
                    <td><Link to={`/admin/orders/${order.id}`} style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>{order.order_number}</Link></td>
                    <td>{order.customer_name || 'Customer'}</td>
                    <td style={{ fontWeight: 700 }}>₹{order.total?.toFixed(2)}</td>
                    <td><span className={`badge ${statusColors[order.status] || 'badge-primary'}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div>
          <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-sans)', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiAlertCircle size={16} style={{ color: 'var(--color-warning)' }} /> Low Stock Alerts
          </h2>
          {lowStock.length === 0 ? (
            <div className="admin-table-wrap" style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-success)', fontWeight: 500 }}>✅ All products have sufficient stock!</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Product</th><th>Stock</th><th>Action</th></tr></thead>
                <tbody>
                  {lowStock.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td><span className={`badge ${p.stock === 0 ? 'badge-error' : 'badge-warning'}`}>{p.stock === 0 ? 'Out of stock' : `${p.stock} left`}</span></td>
                      <td><Link to={`/admin/products/edit/${p.id}`} className="btn btn-outline btn-sm">Update</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`.dashboard-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; } @media (min-width: 1024px) { .dashboard-grid { grid-template-columns: 1.5fr 1fr; } }`}</style>
    </div>
  );
}
