import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '../stores/cartStore';
import './CartDrawer.css';

const CartDrawer = () => {
  const {
    items, isOpen, closeCart,
    removeItem, updateQuantity,
    getSubtotal, getItemCount,
  } = useCartStore();

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const freeDeliveryAbove = 500;
  const remaining = Math.max(0, freeDeliveryAbove - subtotal);

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={closeCart} />

      {/* Drawer */}
      <div className="cart-drawer">
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <FiShoppingBag size={20} />
            <span className="drawer-title">Your Cart</span>
            {getItemCount() > 0 && (
              <span className="drawer-count">{getItemCount()} items</span>
            )}
          </div>
          <button className="drawer-close" onClick={closeCart} id="cart-drawer-close">
            <FiX size={20} />
          </button>
        </div>

        {/* Free delivery progress */}
        {items.length > 0 && (
          <div className="free-delivery-bar">
            {remaining > 0 ? (
              <>
                <span>Add <strong>₹{remaining.toFixed(0)}</strong> more for free delivery!</span>
                <div className="delivery-progress">
                  <div
                    className="delivery-progress-fill"
                    style={{ width: `${Math.min(100, (subtotal / freeDeliveryAbove) * 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <span className="free-delivery-achieved">🎉 You've unlocked <strong>free delivery!</strong></span>
            )}
          </div>
        )}

        {/* Items */}
        <div className="drawer-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some divine sambrani to your cart</p>
              <button className="btn btn-primary" onClick={closeCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.key} className="drawer-item">
                <div className="drawer-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.product.name} />
                  ) : (
                    <div className="drawer-item-placeholder">🪔</div>
                  )}
                </div>
                <div className="drawer-item-info">
                  <p className="drawer-item-name">{item.product.name}</p>
                  {item.variant && (
                    <p className="drawer-item-variant">{item.variant.name}</p>
                  )}
                  <p className="drawer-item-price">₹{item.price.toFixed(2)}</p>
                  <div className="drawer-item-controls">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        id={`cart-item-minus-${item.key}`}
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        id={`cart-item-plus-${item.key}`}
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                    <span className="drawer-item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.key)}
                      id={`cart-item-remove-${item.key}`}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span>Subtotal</span>
              <span className="subtotal-value">₹{subtotal.toFixed(2)}</span>
            </div>
            <p className="drawer-footer-note">Delivery charge and GST calculated at checkout</p>
            <Link to="/cart" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeCart} id="cart-drawer-view-cart">
              View Cart
            </Link>
            <Link to="/checkout" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} onClick={closeCart} id="cart-drawer-checkout">
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
