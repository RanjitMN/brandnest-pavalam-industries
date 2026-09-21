import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag,
  FiSettings, FiMenu, FiX, FiLogOut, FiChevronRight, FiLayers
} from 'react-icons/fi';
import { useAuthStore } from '../../stores/authStore';
import BrandLogo from '../../components/BrandLogo';
import './AdminLayout.css';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid size={18} />, exact: true },
  { to: '/admin/products', label: 'Products', icon: <FiPackage size={18} /> },
  { to: '/admin/orders', label: 'Orders', icon: <FiShoppingBag size={18} /> },
  { to: '/admin/customers', label: 'Customers', icon: <FiUsers size={18} /> },
  { to: '/admin/categories', label: 'Categories', icon: <FiLayers size={18} /> },
  { to: '/admin/coupons', label: 'Coupons', icon: <FiTag size={18} /> },
  { to: '/admin/settings', label: 'Settings', icon: <FiSettings size={18} /> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Backdrop (mobile) */}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <Link to="/" className="admin-logo-link">
            <BrandLogo height={40} />
            <span className="admin-logo-badge">Admin</span>
          </Link>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <FiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-nav-item ${isActive(item) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              id={`admin-nav-${item.label.toLowerCase()}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-label">{item.label}</span>
              {isActive(item) && <FiChevronRight size={14} className="admin-nav-arrow" />}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-user-avatar">
              {profile?.full_name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">{profile?.full_name || 'Admin'}</span>
              <span className="admin-user-role">Administrator</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/" className="admin-footer-btn" title="View Store" id="admin-view-store-btn">
              🏪
            </Link>
            <button className="admin-footer-btn danger" onClick={handleLogout} title="Sign Out" id="admin-logout-btn">
              <FiLogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)} id="admin-menu-toggle">
            <FiMenu size={20} />
          </button>
          <div className="topbar-breadcrumb">
            {navItems.find(i => isActive(i))?.label || 'Dashboard'}
          </div>
          <div className="topbar-actions">
            <Link to="/products" className="btn btn-outline btn-sm" id="admin-topbar-store-btn">
              View Store
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
