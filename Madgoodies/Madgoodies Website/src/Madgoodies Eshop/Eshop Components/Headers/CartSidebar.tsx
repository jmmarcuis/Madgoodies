import React, { useEffect } from "react";
import "../../Eshop Component Styles/CartSidebar.css";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current cart contents:", cart);
  }, [cart]);

  const handleCheckout = () => {
    onClose();

    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/checkout" } });
    }
  };

  const getQuantityDisplay = (item: CartItem) => {
    if (item.packageQuantity) {
      const packCount = item.quantity / item.packageQuantity;
      return `${packCount} pack(s)`;
    } else {
      return `${item.quantity} pcs`;
    }
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-sidebar-flex">
          <h2>Your Cart</h2>
          <button className="cart-sidebar-close-button" onClick={onClose}>
            X
          </button>
        </div>
        {cart.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty.</p>
        ) : (
          <div className="cart-items-container">
            <div className="cart-items">
              {cart.map((item) => (
                <div
                  key={
                    item.productID +
                    (item.packagingID ? `-${item.packagingID}` : "")
                  }
                  className="cart-item"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <p className="cart-item-price">₱{item.price.toFixed(2)}</p>
                    {item.packageQuantity && (
                      <p>Package: {item.packageQuantity} units</p>
                    )}
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productID,
                            Math.max(
                              item.baseQuantity,
                              item.quantity - item.baseQuantity
                            ),
                            item.packagingID
                          )
                        }
                      >
                        −
                      </button>
                      <span>{getQuantityDisplay(item)}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productID,
                            item.quantity + item.baseQuantity,
                            item.packagingID
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(item.productID, item.packagingID)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="cart-summary">
          <p className="cart-total">Total: ₱{total.toFixed(2)}</p>
          <button className="clear-cart-button" onClick={clearCart}>
            Clear Cart
          </button>
          <button className="checkout-button" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;