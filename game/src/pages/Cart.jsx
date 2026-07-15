
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../api/Axios';
import '../css/Cart.css';

const Cart = () => {
  const navigate = useNavigate();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart
  } = useCart();

  if (!cart || cart.length === 0) {
    return <div className="cart-empty">Your cart is empty</div>;
  }

  return (
    <div className="cart-container">

      <h1 className="cart-title">Your Cart</h1>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">

     
            <img
              src={getImageUrl(item.image)}
              alt={item.title}
              className="cart-image"
            />

         
            <div className="cart-info">
              <h3 className="cart-name">{item.title}</h3>
              <p className="cart-price">₹{item.price}</p>
            </div>

          
            <div className="cart-qty">
              <button
                className="qty-btn"
                onClick={() => decreaseQuantity(item.id)}
              >
                -
              </button>

              <span className="qty-number">{item.quantity}</span>

              <button
                className="qty-btn"
                onClick={() => increaseQuantity(item.id)}
              >
                +
              </button>
            </div>

       
            <div className="cart-total">
              ₹{item.price * item.quantity}
            </div>

           
            <button
              className="cart-remove"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>

          </div>
        ))}
      </div>

   
      <div className="cart-summary">
        <h2 className="summary-text">Total: ₹{getTotalPrice()}</h2>

        <div className="summary-buttons">
          <button className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>

          <button
            className="checkout-btn"
            onClick={() => navigate('/payment')}
          >
            Checkout
          </button>
        </div>
      </div>

    </div>
  );
};

export default Cart;
