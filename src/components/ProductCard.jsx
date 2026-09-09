import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCartStore } from '../stores/cartStore';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const price = selectedVariant ? selectedVariant.price : product.price;
  const comparePrice = selectedVariant ? selectedVariant.compare_price : product.compare_price;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : product.stock > 0;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!inStock) return;
    addItem(product, selectedVariant);
    setAdded(true);
    toast.success(`${product.name} added to cart!`, { icon: '🪔' });
    setTimeout(() => setAdded(false), 1500);
  };

  const mainImage = product.images?.[0] || null;

  return (
    <div className="product-card">
      {/* Badge */}
      {discount > 0 && (
        <div className="product-discount-badge">-{discount}%</div>
      )}
      {product.is_featured && !discount && (
        <div className="product-featured-badge">⭐ Best Seller</div>
      )}

      {/* Image */}
      <Link to={`/shop/${product.slug}`} className="product-image-link" id={`product-card-view-${product.id}`}>
        <div className="product-image-wrap">
          {mainImage ? (
            <img src={mainImage} alt={product.name} className="product-img" />
          ) : (
            <div className="product-img-placeholder">
              <span>🪔</span>
            </div>
          )}
          <div className="product-overlay">
            <Link
              to={`/shop/${product.slug}`}
              className="overlay-btn"
              id={`product-card-quickview-${product.id}`}
            >
              <FiEye size={16} /> Quick View
            </Link>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="product-info">
        <Link to={`/shop/${product.slug}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>

        {product.short_description && (
          <p className="product-desc">{product.short_description}</p>
        )}

        {/* Rating */}
        <div className="product-rating">
          {[1,2,3,4,5].map((s) => (
            <FiStar key={s} size={12} className={s <= 5 ? 'star-filled' : 'star-empty'} />
          ))}
          <span className="rating-text">(4.9)</span>
        </div>

        {/* Variants */}
        {product.has_variants && product.variants?.length > 0 && (
          <div className="product-variants">
            {product.variants.map((v) => (
              <button
                key={v.id}
                className={`variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                onClick={() => setSelectedVariant(v)}
                id={`product-variant-${v.id}`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}

        {/* Price + Cart */}
        <div className="product-footer">
          <div className="product-price-group">
            <span className="product-price">₹{price.toFixed(2)}</span>
            {comparePrice && (
              <span className="product-compare-price">₹{comparePrice.toFixed(2)}</span>
            )}
          </div>
          <button
            className={`add-cart-btn ${added ? 'added' : ''} ${!inStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!inStock}
            id={`product-card-add-${product.id}`}
          >
            {!inStock ? 'Out of Stock' : added ? '✓ Added!' : <><FiShoppingCart size={15} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
