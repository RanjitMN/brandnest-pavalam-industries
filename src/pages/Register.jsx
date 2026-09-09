import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import './Login.css';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();

  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm_password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.full_name) e.full_name = 'Name required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone || form.phone.length < 10) e.phone = 'Valid 10-digit phone required';
    if (!form.password || form.password.length < 6) e.password = 'Password min 6 characters';
    if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    const result = await register(form);
    if (result.success) {
      toast.success('Account created! Welcome to Pavalam 🪔');
      navigate('/');
    } else {
      setError(result.error || 'Failed to create account');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <span>🪔</span>
          <div><span className="auth-logo-name">Pavalam</span><span className="auth-logo-sub">Industries</span></div>
        </Link>
        <div className="auth-left-content">
          <h2>Join the<br /><span>Pavalam Family</span></h2>
          <p>Create your account and start experiencing divine sambrani delivered to your doorstep.</p>
          <div className="auth-features">
            {['🌿 100% Natural Products','🚚 Pan-India Delivery','💵 Cash on Delivery','⭐ Exclusive Member Offers'].map(f => (
              <span key={f} className="auth-feature">{f}</span>
            ))}
          </div>
        </div>
        <img src="/images/WhatsApp Image 2026-08-24 at 7.20.31 PM (1).jpeg" alt="Sambrani" className="auth-bg-img" />
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join Pavalam Industries today</p>
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrap">
                <FiUser size={16} className="input-icon" />
                <input type="text" className={`form-input input-with-icon ${errors.full_name ? 'error' : ''}`} value={form.full_name} onChange={e => setForm(f => ({...f, full_name: e.target.value}))} placeholder="Your full name" id="register-name" />
              </div>
              {errors.full_name && <span className="form-error">{errors.full_name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <FiMail size={16} className="input-icon" />
                <input type="email" className={`form-input input-with-icon ${errors.email ? 'error' : ''}`} value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="your@email.com" id="register-email" />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-icon-wrap">
                <FiPhone size={16} className="input-icon" />
                <input type="tel" className={`form-input input-with-icon ${errors.phone ? 'error' : ''}`} value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value.replace(/\D/g,'').slice(0,10)}))} placeholder="10-digit mobile number" id="register-phone" />
              </div>
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <FiLock size={16} className="input-icon" />
                <input type={showPassword ? 'text' : 'password'} className={`form-input input-with-icon input-with-right-icon ${errors.password ? 'error' : ''}`} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="Min 6 characters" id="register-password" />
                <button type="button" className="input-right-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrap">
                <FiLock size={16} className="input-icon" />
                <input type="password" className={`form-input input-with-icon ${errors.confirm_password ? 'error' : ''}`} value={form.confirm_password} onChange={e => setForm(f => ({...f, confirm_password: e.target.value}))} placeholder="Confirm password" id="register-confirm-password" />
              </div>
              {errors.confirm_password && <span className="form-error">{errors.confirm_password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit-btn" disabled={loading} id="register-submit-btn">
              {loading ? <><div className="spinner" style={{width:18,height:18}} /> Creating Account...</> : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider"><span>Already have an account?</span></div>
          <Link to="/login" className="btn btn-ghost btn-lg auth-switch-btn" id="register-to-login-btn">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
