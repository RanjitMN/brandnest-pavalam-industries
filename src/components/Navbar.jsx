import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const itemCount = useCartStore((s) => s.getItemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { user, profile, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'About', to: '/#about' },
    { label: 'Contact', to: '/#contact' },
  ];

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="navbar-inner container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">🪔</div>
            <div className="logo-text">
              <span className="logo-name">Pavalam</span>
              <span className="logo-tagline">Industries</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Search */}
            <div className="search-wrapper" ref={searchRef}>
              <button
                className="icon-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                id="navbar-search-btn"
              >
                <FiSearch size={20} />
              </button>
              {searchOpen && (
                <form className="search-dropdown" onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="search-input"
                  />
                  <button type="submit" className="search-submit">
                    <FiSearch size={16} />
                  </button>
                </form>
              )}
            </div>

            {/* Cart */}
            <button
              className="icon-btn cart-btn"
              onClick={toggleCart}
              aria-label="Open cart"
              id="navbar-cart-btn"
            >
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount > 9 ? '9+' : itemCount}</span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <button
                  className="user-avatar-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  id="navbar-user-btn"
                >
                  <div className="user-avatar">
                    {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <span className="user-name">{profile?.full_name || 'User'}</span>
                      <span className="user-email">{user.email}</span>
                      {profile?.role === 'admin' && (
                        <span className="badge badge-primary" style={{ marginTop: '0.25rem', fontSize: '0.7rem' }}>Admin</span>
                      )}
                    </div>
                    <div className="user-dropdown-divider" />
                    <Link to="/account" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <FiPackage size={15} /> My Orders
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link to="/admin" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <FiSettings size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className="user-dropdown-divider" />
                    <button className="user-dropdown-item danger" onClick={handleLogout}>
                      <FiLogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm" id="navbar-login-btn">
                Login
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              id="navbar-mobile-toggle"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="mobile-nav-link"
              >
                {link.label}
              </Link>
            ))}
            <div className="mobile-menu-divider" />
            {user ? (
              <>
                <Link to="/account" className="mobile-nav-link">My Orders</Link>
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="mobile-nav-link">Admin Panel</Link>
                )}
                <button className="mobile-nav-link danger-link" onClick={handleLogout}>
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ margin: '0.5rem 1.5rem' }}>
                Login
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Spacer to prevent content jump */}
      <div className="navbar-spacer" />
    </>
  );
};

export default Navbar;
