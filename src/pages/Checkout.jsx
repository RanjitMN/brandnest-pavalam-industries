import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiMapPin, FiUser, FiPhone, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { insertOrderWithItems, recordCouponUse, generateOrderNumber } from '../lib/orders';
import { isSupabaseConfigured } from '../lib/utils';
import './Checkout.css';

const defaultSettings = { delivery_charge: '60', free_delivery_above: '500', gst_rate: '5' };

export default function Checkout() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { items, getSubtotal, getDiscount, getDeliveryCharge, getGST, getTotal, coupon, clearCart } = useCartStore();
  const [settings, setSettings] = useState(defaultSettings);
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState(1); // 1: address, 2: review

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('settings').select('key, value');
        if (data) { const obj = {}; data.forEach(r => { obj[r.key] = r.value; }); setSettings(prev => ({...prev, ...obj})); }
      } catch {}
    };
    fetchSettings();
  }, []);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCharge = getDeliveryCharge(settings);
  const gst = getGST(settings);
  const total = getTotal(settings);

  const validate = () => {
    const e = {};
    if (!form.full_name) e.full_name = 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone || form.phone.length < 10) e.phone = 'Valid phone required';
    if (!form.address_line1) e.address_line1 = 'Address is required';
    if (!form.city) e.city = 'City is required';
    if (!form.state) e.state = 'State is required';
    if (!form.pincode || form.pincode.length !== 6) e.pincode = 'Valid 6-digit pincode required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) { toast.error('Please fix the errors below'); return; }
    if (!items.length) { toast.error('Your cart is empty'); navigate('/products'); return; }
    if (!isSupabaseConfigured) {
      toast.error('Online checkout is not connected yet. Add Supabase keys to .env');
      return;
    }
    setPlacing(true);
    try {
      const orderNumber = generateOrderNumber('PAV');
      const orderItems = items.map(item => ({
        product_id: item.product.id?.length === 36 ? item.product.id : null,
        variant_id: item.variant?.id?.length === 36 ? item.variant.id : null,
        product_name: item.product.name,
        variant_name: item.variant?.name || null,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        image_url: item.image,
      }));

      const order = await insertOrderWithItems({
        order_number: orderNumber,
        user_id: user.id,
        customer_email: form.email,
        customer_name: form.full_name,
        customer_phone: form.phone,
        items: orderItems,
        subtotal,
        delivery_charge: deliveryCharge,
        discount,
        gst_amount: gst,
        gst_rate: parseFloat(settings.gst_rate),
        total,
        status: 'pending',
        payment_method: 'cod',
        payment_status: 'pending',
        channel: 'online',
        shipping_address: {
          full_name: form.full_name,
          phone: form.phone,
          address_line1: form.address_line1,
          address_line2: form.address_line2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        coupon_code: coupon?.code || null,
      }, orderItems);

      if (coupon?.code) await recordCouponUse(coupon.code);

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const indianStates = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh','Puducherry'];

  return (
    <>
      <Navbar />
      <main className="checkout-page">
        <div className="container">
          <h1 className="checkout-title">Checkout</h1>

          {/* Steps */}
          <div className="checkout-steps">
            {['Shipping Address', 'Review & Place Order'].map((s, i) => (
              <div key={i} className={`checkout-step ${step > i+1 ? 'done' : ''} ${step === i+1 ? 'active' : ''}`}>
                <div className="step-num">
                  {step > i+1 ? <FiCheckCircle size={16} /> : i+1}
                </div>
                <span>{s}</span>
              </div>
            ))}
          </div>

          <div className="checkout-layout">
            {/* Form */}
            <div className="checkout-form">
              {step === 1 && (
                <div className="form-section animate-fade-up">
                  <h2 className="form-section-title"><FiMapPin /> Shipping Address</h2>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label"><FiUser size={13} /> Full Name</label>
                      <input className={`form-input ${errors.full_name ? 'error' : ''}`} value={form.full_name} onChange={e => setForm(f => ({...f, full_name: e.target.value}))} placeholder="Your full name" id="checkout-name" />
                      {errors.full_name && <span className="form-error">{errors.full_name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label"><FiPhone size={13} /> Phone</label>
                      <input className={`form-input ${errors.phone ? 'error' : ''}`} value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="10-digit mobile number" type="tel" id="checkout-phone" />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label"><FiMail size={13} /> Email</label>
                      <input className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="Email address" type="email" id="checkout-email" />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Address Line 1</label>
                      <input className={`form-input ${errors.address_line1 ? 'error' : ''}`} value={form.address_line1} onChange={e => setForm(f => ({...f, address_line1: e.target.value}))} placeholder="House no., Street name" id="checkout-address1" />
                      {errors.address_line1 && <span className="form-error">{errors.address_line1}</span>}
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Address Line 2 (optional)</label>
                      <input className="form-input" value={form.address_line2} onChange={e => setForm(f => ({...f, address_line2: e.target.value}))} placeholder="Apartment, landmark, etc." id="checkout-address2" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className={`form-input ${errors.city ? 'error' : ''}`} value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} placeholder="City" id="checkout-city" />
                      {errors.city && <span className="form-error">{errors.city}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pincode</label>
                      <input className={`form-input ${errors.pincode ? 'error' : ''}`} value={form.pincode} onChange={e => setForm(f => ({...f, pincode: e.target.value.replace(/\D/g,'').slice(0,6)}))} placeholder="6-digit pincode" id="checkout-pincode" />
                      {errors.pincode && <span className="form-error">{errors.pincode}</span>}
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">State</label>
                      <select className={`form-select ${errors.state ? 'error' : ''}`} value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))} id="checkout-state">
                        <option value="">Select State</option>
                        {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <span className="form-error">{errors.state}</span>}
                    </div>
                  </div>
                  <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} onClick={() => { if(validate()) setStep(2); }} id="checkout-continue-btn">
                    Continue to Review →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="form-section animate-fade-up">
                  <h2 className="form-section-title">Review Your Order</h2>
                  <div className="review-address">
                    <h4><FiMapPin size={14} /> Delivering to:</h4>
                    <p>{form.full_name} • {form.phone}</p>
                    <p>{form.address_line1}{form.address_line2 ? `, ${form.address_line2}` : ''}</p>
                    <p>{form.city}, {form.state} — {form.pincode}</p>
                    <button className="edit-address-btn" onClick={() => setStep(1)}>Edit Address</button>
                  </div>

                  <div className="review-items">
                    {items.map(item => (
                      <div key={item.key} className="review-item">
                        <div className="review-item-img">
                          {item.image ? <img src={item.image} alt="" /> : <span>🪔</span>}
                        </div>
                        <div className="review-item-info">
                          <span className="review-item-name">{item.product.name}{item.variant ? ` — ${item.variant.name}` : ''}</span>
                          <span className="review-item-qty">Qty: {item.quantity}</span>
                        </div>
                        <span className="review-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="payment-method-display">
                    <span>💵</span>
                    <div>
                      <strong>Payment Method: Cash on Delivery</strong>
                      <p>Pay ₹{total.toFixed(2)} when your order arrives</p>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-lg place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    id="checkout-place-order-btn"
                  >
                    {placing ? <><div className="spinner" style={{width:18,height:18}} /> Placing Order...</> : '🪔 Place Order — COD'}
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary sidebar */}
            <div className="checkout-summary">
              <h3>Order Summary</h3>
              <div className="summary-lines">
                <div className="summary-line"><span>Subtotal ({items.length} items)</span><span>₹{subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="summary-line" style={{color:'var(--color-success)'}}><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
                <div className="summary-line"><span>Delivery</span><span>{deliveryCharge === 0 ? <span style={{color:'var(--color-success)'}}>Free</span> : `₹${deliveryCharge.toFixed(2)}`}</span></div>
                <div className="summary-line"><span>GST ({settings.gst_rate}%)</span><span>₹{gst.toFixed(2)}</span></div>
                <div className="summary-divider" />
                <div className="summary-line" style={{fontWeight:700,fontSize:'1.1rem'}}><span>Total</span><span style={{color:'var(--color-primary)'}}>₹{total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
