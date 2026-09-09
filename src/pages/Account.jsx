import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiUser, FiMapPin, FiLogOut, FiChevronRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import './Account.css';

const statusColors = {
  pending: 'badge-warning', confirmed: 'badge-info', packed: 'badge-secondary',
  shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-error',
};

export default function Account() {
  const { user, profile, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await supabase
          .from('orders').select('*').eq('user_id', user.id)
          .order('created_at', { ascending: false }).limit(20);
        if (data) setOrders(data);
      } catch {} finally { setLoading(false); }
    };
    if (user) fetchOrders();
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="account-page">
        <div className="container">
          <div className="account-header">
            <div className="account-avatar">
              {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="account-name">{profile?.full_name || 'My Account'}</h1>
              <p className="account-email">{user?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="account-tabs">
            {[{id:'orders',label:'My Orders',icon:<FiPackage size={15} />},{id:'profile',label:'Profile',icon:<FiUser size={15} />}].map(t => (
              <button key={t.id} className={`account-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)} id={`account-tab-${t.id}`}>
                {t.icon} {t.label}
              </button>
            ))}
            <button className="account-tab danger" onClick={logout} id="account-logout-btn">
              <FiLogOut size={15} /> Sign Out
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="account-orders">
              {loading ? (
                <div className="flex items-center justify-center" style={{padding:'4rem'}}><div className="spinner" style={{width:36,height:36}} /></div>
              ) : orders.length === 0 ? (
                <div className="empty-orders">
                  <FiPackage size={48} strokeWidth={1} />
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here</p>
                  <Link to="/shop" className="btn btn-primary">Shop Now</Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-card-header">
                        <div>
                          <span className="order-number">{order.order_number}</span>
                          <span className="order-date">{new Date(order.created_at).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</span>
                        </div>
                        <div className="flex items-center gap-sm">
                          <span className={`badge ${statusColors[order.status] || 'badge-primary'}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <FiChevronRight size={16} className="order-arrow" />
                        </div>
                      </div>
                      <div className="order-card-body">
                        <div>
                          <p className="order-items-summary">
                            {order.items?.slice(0,2).map(i => i.product_name).join(', ')}
                            {order.items?.length > 2 ? ` +${order.items.length - 2} more` : ''}
                          </p>
                          <p className="order-payment">💵 Cash on Delivery</p>
                        </div>
                        <div className="order-total">₹{order.total?.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="profile-info-card">
                <div className="info-row"><FiUser size={15} /><div><label>Full Name</label><p>{profile?.full_name || '—'}</p></div></div>
                <div className="info-row"><FiMapPin size={15} /><div><label>Email</label><p>{user?.email}</p></div></div>
                <div className="info-row"><span style={{fontSize:'1rem'}}>📞</span><div><label>Phone</label><p>{profile?.phone || '—'}</p></div></div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
