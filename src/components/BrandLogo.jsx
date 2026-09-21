const BrandLogo = ({ className = '', height = 48, showTagline = false }) => (
  <span className={`brand-logo ${className}`}>
    <img
      src="/images/logo.jpeg"
      alt="Pavalam — Symbol of Quality"
      className="brand-logo-img"
      style={{ height }}
    />
    {showTagline && <span className="brand-logo-aside">Industries</span>}
  </span>
);

export default BrandLogo;
