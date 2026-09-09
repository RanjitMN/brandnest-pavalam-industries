import { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import './AdminLayout.css';

const defaultSettings = [
  { key: 'delivery_charge', label: 'Standard Delivery Charge (₹)', type: 'number', value: '60', description: 'Applied to orders below the free delivery threshold' },
  { key: 'free_delivery_above', label: 'Free Delivery Above (₹)', type: 'number', value: '500', description: 'Orders above this amount get free delivery' },
  { key: 'gst_rate', label: 'GST Rate (%)', type: 'number', value: '5', description: 'GST percentage applied to all orders' },
  { key: 'site_name', label: 'Site Name', type: 'text', value: 'Pavalam Industries', description: 'Displayed in browser tab and emails' },
  { key: 'contact_email', label: 'Contact Email', type: 'email', value: 'info@pavalam.com', description: 'Used for customer communication' },
  { key: 'contact_phone', label: 'Contact Phone', type: 'tel', value: '+91 98765 43210', description: 'Displayed in footer and emails' },
  { key: 'whatsapp_number', label: 'WhatsApp Number', type: 'tel', value: '+919876543210', description: 'WhatsApp support number (no spaces)' },
  { key: 'order_prefix', label: 'Order Number Prefix', type: 'text', value: 'PAV', description: 'Prefix for order numbers (e.g. PAV-20260901-1234)' },
];

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('settings').select('key, value');
        if (data) {
          const obj = {};
          data.forEach(r => { obj[r.key] = r.value; });
          setSettings(obj);
        }
      } catch {} finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const getValue = (key, defaultValue) => settings[key] ?? defaultValue;

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const entries = Object.entries(settings).map(([key, value]) => ({ key, value: String(value) }));
      for (const entry of entries) {
        await supabase.from('settings').upsert(entry, { onConflict: 'key' });
      }
      toast.success('Settings saved successfully!');
    } catch { toast.error('Failed to save settings'); } finally { setSaving(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" style={{ width: 36, height: 36, margin: '0 auto' }} /></div>;

  const groups = [
    { title: 'Pricing & Delivery', keys: ['delivery_charge', 'free_delivery_above', 'gst_rate'] },
    { title: 'Store Information', keys: ['site_name', 'contact_email', 'contact_phone', 'whatsapp_number'] },
    { title: 'Order Settings', keys: ['order_prefix'] },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Configure your store settings</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="admin-save-settings-btn">
          {saving ? 'Saving...' : <><FiSave size={15} /> Save Settings</>}
        </button>
      </div>

      <form onSubmit={handleSave}>
        {groups.map(group => (
          <div key={group.title} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
              {group.title}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              {group.keys.map(key => {
                const setting = defaultSettings.find(s => s.key === key);
                if (!setting) return null;
                return (
                  <div key={key} className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">{setting.label}</label>
                    <input
                      type={setting.type}
                      className="form-input"
                      value={getValue(key, setting.value)}
                      onChange={e => handleChange(key, e.target.value)}
                      id={`setting-${key}`}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{setting.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </form>
    </div>
  );
}
