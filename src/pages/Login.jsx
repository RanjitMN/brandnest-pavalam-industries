import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import BrandLogo from '../components/BrandLogo';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { login, loading } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back! 🪔');
      navigate(result.role === 'admin' ? '/admin' : from, { replace: true });
    } else {
      setError(result.error || 'Invalid email or password');
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <BrandLogo height={58} />
        </Link>
        <div className="auth-left-content">
          <h2>Experience the<br /><span>Divine Fragrance</span></h2>
          <p>Premium cup sambrani crafted with 100% natural resins from Tamil Nadu's finest forests.</p>
          <div className="auth-features">
            {['🌿 100% Natural', '🚚 Pan-India Delivery', '💵 Cash on Delivery', '⭐ 4.9 Rated'].map(f => (
              <span key={f} className="auth-feature">{f}</span>
            ))}
          </div>
        </div>
        <img src="/images/WhatsApp Image 2026-08-24 at 7.20.32 PM (2).jpeg" alt="Sambrani" className="auth-bg-img" />
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your Pavalam account</p>
          </div>

          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <FiMail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-input input-with-icon"
                  value={form.email}
                  onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  placeholder="your@email.com"
                  required
                  id="login-email"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <FiLock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input input-with-icon input-with-right-icon"
                  value={form.password}
                  onChange={e => setForm(f => ({...f, password: e.target.value}))}
                  placeholder="••••••••"
                  required
                  id="login-password"
                  autoComplete="current-password"
                />
                <button type="button" className="input-right-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit-btn"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? <><div className="spinner" style={{width:18,height:18}} /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <Link to="/register" className="btn btn-ghost btn-lg auth-switch-btn" id="login-to-register-btn">
            Create Account
          </Link>

        </div>
      </div>
    </div>
  );
}
