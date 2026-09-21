import { Link } from 'react-router-dom';
import './PageHero.css';

const PageHero = ({ eyebrow, title, subtitle, crumbs = [] }) => (
  <header className="page-hero">
    <div className="page-hero-glow" aria-hidden="true" />
    <div className="container page-hero-inner">
      {crumbs.length > 0 && (
        <nav className="page-crumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={c.label}>
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
              {i < crumbs.length - 1 && <span className="page-crumbs-sep">/</span>}
            </span>
          ))}
        </nav>
      )}
      {eyebrow && <p className="page-hero-eyebrow">{eyebrow}</p>}
      <h1 className="page-hero-title">{title}</h1>
      {subtitle && <p className="page-hero-sub">{subtitle}</p>}
    </div>
  </header>
);

export default PageHero;
