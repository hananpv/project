import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import '../css/Navbar.css';    

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/wishListContext';

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
     
        {/* LOGO */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <span className="logo-main">PIXELVAULT</span>
            <span className="logo-sub">GAME STORE</span>
          </Link>
        </div>

        {/* LINKS */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/games" className="nav-link">Games</Link>
          <Link to="/about" className="nav-link">About</Link>

          {isAuthenticated && (
            <>
              <Link to="/orders" className="nav-link">Orders</Link>
              <Link to="/library" className="nav-link">Library</Link>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">

          {/* ICONS */}
          <div className="nav-icons">
            <Link to="/wishlist" className="nav-icon">
              <FaHeart />
              {wishlist.length > 0 && (
                <span className="badge">{wishlist.length}</span>
              )}
            </Link>

            <Link to="/cart" className="nav-icon">
              <FaShoppingCart />
              {cart.length > 0 && (
                <span className="badge">{cart.length}</span>
              )}
            </Link>
          </div>

          {/* AUTH */}
          <div className="auth-section">
            {isAuthenticated ? (
              <div className="user-dropdown">
                <button className="user-menu">
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{user.username || user.name}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                <div className="dropdown-menu">
                  <Link to="/Profile" className="dropdown-item">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn">Login</Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
