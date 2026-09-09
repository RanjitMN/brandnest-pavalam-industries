import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiTag, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { useCartStore } from '../stores/cartStore';
import { supabase } from '../lib/supabase';
import './Cart.css';

const defaultSettings = { delivery_charge: '60', free_delivery_above: '500', gst_rate: '5' };

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, coupon, applyCoupon, removeCoupon, getSubtotal, getDiscount, getDeliveryCharge, getGST, getTotal } = useCartStore();
  const [settings, setSettings] = useState(defaultSettings);
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('settings').select('key, value');
        if (data) {
          const obj = {};
          data.forEach(r => { obj[r.key] = r.value; });
          setSettings(prev => ({ ...prev, ...obj }));
        }
      } catch { /* use defaults */ }
    };
    fetchSettings();
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponInput.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) { toast.error('Invalid or expired coupon code'); return; }

      const subtotal = getSubtotal();
      if (data.min_order_amount && subtotal < data.min_order_amount) {
        toast.error(`Minimum order ₹${data.min_order_amount} required for this coupon`);
        return;
      }

      applyCoupon(data);
      toast.success(`Coupon "${data.code}" applied! 🎉`);
    } catch {
      toast.error('Failed to apply coupon. Try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCharge = getDeliveryCharge(settings);
  const gst = getGST(settings);
  const total = getTotal(settings);
  const freeDeliveryAbove = parseFloat(settings.free_delivery_above || 500);

  return (
    <>
      <CartDrawer />
      <Navbar />
      <main className="cart-page">
        <div className="container">
          <div className="cart-header">
            <button className="back-btn" onClick={() => navigate('/shop')}>
              <FiArrowLeft size={16} /> Continue Shopping
            </button>
            <h1 className="cart-title">Shopping Cart</h1>
            {items.length > 0 && <span className="cart-item-count">{items.length} items</span>}
          </div>

          {items.length === 0 ? (
            <div className="empty-cart-page">
              <div className="empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some divine sambrani products to get started!</p>
              <Link to="/shop" className="btn btn-primary btn-lg">
                Shop Now →
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Items */}
              <div className="cart-items">
                {/* Free delivery bar */}
                {subtotal < freeDeliveryAbove && (
                  <div className="cart-free-delivery-bar">
                    <div className="fd-text">
                      Add <strong>₹{(freeDeliveryAbove - subtotal).toFixed(0)}</strong> more for free delivery!
                    </div>
                    <div className="fd-progress">
                      <div className="fd-fill" style={{ width: `${(subtotal / freeDeliveryAbove) * 100}%` }} />
                    </div>
                  </div>
                )}
                {subtotal >= freeDeliveryAbove && (
                  <div className="cart-free-delivery-bar achieved">
                    🎉 You qualify for <strong>free delivery!</strong>
                  </div>
                )}

                {items.map(item => (
                  <div key={item.key} className="cart-item">
                    <div className="cart-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.product.name} />
                      ) : <div className="cart-img-placeholder">🪔</div>}
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-top">
                        <div>
                          <h3 className="cart-item-name">{item.product.name}</h3>
                          {item.variant && <p className="cart-item-variant">{item.variant.name}</p>}
                          <p className="cart-item-price">₹{item.price.toFixed(2)} each</p>
                        </div>
                        <button className="cart-item-remove" onClick={() => removeItem(item.key)} id={`cart-remove-${item.key}`}>
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      <div className="cart-item-bottom">
                        <div className="cart-qty">
                          <button className="qty-btn" onClick={() => updateQuantity(item.key, item.quantity - 1)} id={`cart-minus-${item.key}`}>
                            <FiMinus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateQuantity(item.key, item.quantity + 1)} id={`cart-plus-${item.key}`}>
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <span className="cart-item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="cart-summary">
                <h2 className="summary-title">Order Summary</h2>

                {/* Coupon */}
                <div className="coupon-section">
                  {coupon ? (
                    <div className="coupon-applied">
                      <span><FiTag size={14} /> {coupon.code} applied</span>
                      <button className="remove-coupon" onClick={removeCoupon} id="cart-remove-coupon">✕ Remove</button>
                    </div>
                  ) : (
                    <div className="coupon-input-row">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="coupon-input form-input"
                        id="cart-coupon-input"
                      />
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        id="cart-apply-coupon"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="summary-lines">
                  <div className="summary-line"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  {discount > 0 && <div className="summary-line discount"><span>Discount ({coupon?.code})</span><span>-₹{discount.toFixed(2)}</span></div>}
                  <div className="summary-line"><span>Delivery</span><span>{deliveryCharge === 0 ? <span style={{ color: 'var(--color-success)' }}>Free</span> : `₹${deliveryCharge.toFixed(2)}`}</span></div>
                  <div className="summary-line"><span>GST ({settings.gst_rate}%)</span><span>₹{gst.toFixed(2)}</span></div>
                  <div className="summary-divider" />
                  <div className="summary-line total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                </div>

                <div className="cod-badge">
                  <span>💵</span>
                  <div>
                    <strong>Cash on Delivery</strong>
                    <p>Pay when your order arrives</p>
                  </div>
                </div>

                <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn" id="cart-checkout-btn">
                  Proceed to Checkout →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
