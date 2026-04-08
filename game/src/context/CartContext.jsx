import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../api/Axios';
import { toast } from "react-toastify";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user?.cart) {
      setCart(user.cart);
    } else {
      setCart([]);
    }
  }, [user]);

  
  const addToCart = async (product) => {
    if (!isAuthenticated) {
      toast("Please login first!");
      return;
    }

    const exists = cart.find(item => item.id === product.id);

    if (exists) {
      toast("Already in cart"); 
      return;
    }

    const updatedCart = [
      ...cart,
      {
        ...product,
        price: Number(product.price),
        quantity: 1
      }
    ];

    setCart(updatedCart);

    await api.patch(`/users/${user.id}`, {
      cart: updatedCart
    });

    updateUser({ ...user, cart: updatedCart });
  };

  // ✅ INCREASE (Cart Page)
  const increaseQuantity = async (id) => {
    const updatedCart = cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCart(updatedCart);

    await api.patch(`/users/${user.id}`, {
      cart: updatedCart
    });

    updateUser({ ...user, cart: updatedCart });
  };

  // ✅ DECREASE
  const decreaseQuantity = async (id) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    let updatedCart;

    if (item.quantity === 1) {
      updatedCart = cart.filter(i => i.id !== id);
    } else {
      updatedCart = cart.map(i =>
        i.id === id
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
    }

    setCart(updatedCart);

    await api.patch(`/users/${user.id}`, {
      cart: updatedCart
    });

    updateUser({ ...user, cart: updatedCart });
  };

  // REMOVE
  const removeFromCart = async (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);

    await api.patch(`/users/${user.id}`, {
      cart: updatedCart
    });

    updateUser({ ...user, cart: updatedCart });
  };

  // CLEAR
  const clearCart = async () => {
    setCart([]);
    await api.patch(`/users/${user.id}`, { cart: [] });
    updateUser({ ...user, cart: [] });
  };

  // TOTAL
  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};