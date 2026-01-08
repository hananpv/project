import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../api/Axios';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);

  // 🔄 Load cart from logged-in user
  useEffect(() => {
    if (user?.cart) {
      setCart(user.cart);
    } else {
      setCart([]);
    }
  }, [user]);

  // ➕ ADD TO CART
  const addToCart = async (product) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    const exists = cart.find(item => item.id === product.id);

    const updatedCart = exists
      ? cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, quantity: 1 }];

    setCart(updatedCart);

    await api.patch(`/users/${user.id}`, {
      cart: updatedCart
    });

    // alert('Added to cart');
  };

  // ❌ REMOVE FROM CART
  const removeFromCart = async (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);

    await api.patch(`/users/${user.id}`, {
      cart: updatedCart
    });
  };

  // 🧹 CLEAR CART
  const clearCart = async () => {
    setCart([]);
    await api.patch(`/users/${user.id}`, { cart: [] });
  };

  // 💰 TOTAL
  const getTotalPrice = () =>
    cart.reduce((t, i) => t + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
