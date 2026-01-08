import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../css/Cart.css';

const Cart = () => {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart
  } = useCart();

  if (cart.length === 0) {
    return <div className="cart-empty">Your cart is empty</div>;
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            
            <div className="item-product">
              <img
                src={item.image}
                alt={item.title}
                className="item-image"
              />
              <h3 className="item-name">{item.title}</h3>
            </div>

            <div className="item-price">
              ₹{item.price}
            </div>

            <div className="item-quantity">
              {/* <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity - 1)
                }
              >
                −
              </button> */}

              {/* <span>{item.quantity}</span> */}

              {/* <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1)
                }
              >
                +
              </button> */}
            </div>

            <div className="item-total">
              ₹{item.price * item.quantity}
            </div>

            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Total: ₹{getTotalPrice()}</h2>

        <button className="clear-cart-btn" onClick={clearCart}>
          Clear Cart
        </button>

        {/* ✅ CHECKOUT → PAYMENT */}
        <button
          className="checkout-btn"
          onClick={() => navigate('/payment')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
