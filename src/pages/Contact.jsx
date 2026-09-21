import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import PageHero from '../components/PageHero';
import './Contact.css';

const details = [
  { icon: FiMapPin, label: 'Visit', value: 'Tamil Nadu, India', href: null },
  { icon: FiPhone, label: 'Call', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: FiMail, label: 'Write', value: 'info@pavalam.com', href: 'mailto:info@pavalam.com' },
  { icon: FiClock, label: 'Hours', value: 'Mon–Sat, 9:30am – 6:30pm IST', href: null },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill name, email, and message.');
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setForm({ name: '', email: '', phone: '', message: '' });
      toast.success('Message received. We will reply soon.');
    }, 700);
  };

  return (
    <>
      <CartDrawer />
      <Navbar />
      <main className="contact-page">
        <PageHero
          eyebrow="Contact"
          title="A note, a call, a visit."
          subtitle="Wholesale, festivals, or a question about your order — we are here."
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        />

        <section className="section contact-body">
          <div className="container contact-grid">
            <div className="contact-cards">
              {details.map((d) => {
                const Icon = d.icon;
                const inner = (
                  <>
                    <span className="contact-card-icon"><Icon size={18} /></span>
                    <span className="contact-card-label">{d.label}</span>
                    <span className="contact-card-value">{d.value}</span>
                  </>
                );
                return d.href ? (
                  <a key={d.label} href={d.href} className="contact-card">{inner}</a>
                ) : (
                  <div key={d.label} className="contact-card">{inner}</div>
                );
              })}
              <a
                className="contact-whatsapp"
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>

            <form className="contact-form" onSubmit={onSubmit} noValidate>
              <h2>Send a message</h2>
              <p>Tell us how we can help — orders, bulk, or the ritual itself.</p>
              <label className="form-group">
                <span className="form-label">Name</span>
                <input className="form-input" name="name" value={form.name} onChange={onChange} autoComplete="name" />
              </label>
              <label className="form-group">
                <span className="form-label">Email</span>
                <input className="form-input" type="email" name="email" value={form.email} onChange={onChange} autoComplete="email" />
              </label>
              <label className="form-group">
                <span className="form-label">Phone (optional)</span>
                <input className="form-input" name="phone" value={form.phone} onChange={onChange} autoComplete="tel" />
              </label>
              <label className="form-group">
                <span className="form-label">Message</span>
                <textarea className="form-textarea" name="message" rows={5} value={form.message} onChange={onChange} />
              </label>
              <button type="submit" className="btn btn-primary btn-lg" disabled={sending} id="contact-submit">
                {sending ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
