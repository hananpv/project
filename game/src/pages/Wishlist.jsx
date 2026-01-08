import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import '../css/Wishlist.css';

const Wishlist = () => {
  const {
    wishlist,
    removeFromWishlist
  } = useWishlist();

  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        Your wishlist is empty ❤️
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">Your Wishlist</h1>

      <div className="wishlist-items">
        {wishlist.map((item) => (
          <div key={item.id} className="wishlist-item">
            
            <div className="wishlist-item-image">
              <img src={item.image} alt={item.title} />
            </div>

            <div className="wishlist-item-details">
              <h3 className="wishlist-item-name">
                {item.title}
              </h3>
              <p className="wishlist-item-price">
                ₹{item.price}
              </p>
            </div>

            <div className="wishlist-item-actions">
              <button
                className="wishlist-add-to-cart"
                onClick={() => handleMoveToCart(item)}
              >
                Add to Cart
              </button>

              <button
                className="wishlist-remove"
                onClick={() => removeFromWishlist(item.id)}
              >
                Remove
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
