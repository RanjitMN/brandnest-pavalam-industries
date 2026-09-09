import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiMapPin, FiPhone } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders').select('*').eq('id', orderId).single();
        if (!error && data) setOrder(data);
      } catch {} finally { setLoading(false); }
    };
    fetchOrder();
  }, [orderId]);

  const statusMap = {
    pending: { label: 'Order Placed', color: 'var(--color-warning)', icon: '⏳' },
    confirmed: { label: 'Confirmed', color: 'var(--color-info)', icon: '✅' },
    packed: { label: 'Packed', color: 'var(--color-secondary)', icon: '📦' },
    shipped: { label: 'Shipped', color: 'var(--color-primary)', icon: '🚚' },
    delivered: { label: 'Delivered', color: 'var(--color-success)', icon: '🎉' },
  };

  if (loading) return (
    <><Navbar /><div style={{display:'flex',justifyContent:'center',padding:'8rem 0'}}><div className="spinner" style={{width:40,height:40}} /></div><Footer /></>
  );

  return (
    <>
      <Navbar />
      <main className="confirmation-page">
        <div className="container">
          <div className="confirmation-card">
            {/* Success Icon */}
            <div className="confirmation-icon">
              <FiCheckCircle size={60} strokeWidth={1.5} />
            </div>

            <h1 className="confirmation-title">Order Placed Successfully! 🪔</h1>
            <p className="confirmation-subtitle">
              Thank you for your order. Your divine sambrani is on its way!
            </p>

            {order && (
              <>
                <div className="order-number-badge">
                  Order #{order.order_number}
                </div>

                <div className="confirmation-details">
                  <div className="detail-row">
                    <span className="detail-label">Status</span>
                    <span className="detail-value" style={{ color: statusMap[order.status]?.color }}>
                      {statusMap[order.status]?.icon} {statusMap[order.status]?.label}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Payment</span>
                    <span className="detail-value">💵 Cash on Delivery</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total Amount</span>
                    <span className="detail-value" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.2rem' }}>
                      ₹{order.total?.toFixed(2)}
                    </span>
                  </div>
                  {order.shipping_address && (
                    <div className="detail-row">
                      <span className="detail-label"><FiMapPin size={13} /> Delivering to</span>
                      <span className="detail-value" style={{ textAlign: 'right' }}>
                        {order.shipping_address.full_name}<br />
                        {order.shipping_address.city}, {order.shipping_address.state}
                      </span>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="confirmation-items">
                  <h3>Items Ordered</h3>
                  {order.items?.map((item, i) => (
                    <div key={i} className="conf-item">
                      <FiPackage size={14} className="conf-item-icon" />
                      <span className="conf-item-name">
                        {item.product_name}{item.variant_name ? ` — ${item.variant_name}` : ''}
                      </span>
                      <span className="conf-item-qty">×{item.quantity}</span>
                      <span className="conf-item-price">₹{item.total?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="confirmation-note">
                  <span>📧</span>
                  <p>A confirmation has been sent to <strong>{order.customer_email}</strong></p>
                </div>
              </>
            )}

            <div className="confirmation-actions">
              <Link to="/account" className="btn btn-primary" id="confirmation-track-btn">
                Track My Orders
              </Link>
              <Link to="/shop" className="btn btn-outline" id="confirmation-shop-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
