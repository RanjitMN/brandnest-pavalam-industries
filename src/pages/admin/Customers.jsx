import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import './AdminLayout.css';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase.from('profiles').select('*, orders:orders(count)').eq('role', 'customer').order('created_at', { ascending: false });
        if (data?.length > 0) setCustomers(data);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = customers.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customers</h1>
          <p className="admin-page-subtitle">{customers.length} registered customers</p>
        </div>
      </div>

      <div className="admin-search" style={{ marginBottom: '1.5rem' }}>
        <FiSearch size={15} className="admin-search-icon" />
        <input className="admin-search-input" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} id="admin-customers-search" />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" style={{ width: 36, height: 36, margin: '0 auto' }} /></div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <span style={{ fontSize: '3rem' }}>👥</span>
          <h3>{customers.length === 0 ? 'No customers yet' : 'No results found'}</h3>
          <p>{customers.length === 0 ? 'Customers will appear here after they register' : 'Try a different search'}</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Customer</th><th>Phone</th><th>Joined</th><th>Role</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>
                        {c.full_name?.[0]?.toUpperCase() || c.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.full_name || 'No Name'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{c.phone || '—'}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td><span className="badge badge-success">{c.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
