import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api, normalizeGame } from '../api/Axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);

  const normalizeCartItem = (item) => {
    const game = normalizeGame(item.gameId || item);

    return {
      ...game,
      cartItemId: item._id || item.cartItemId,
      quantity: item.quantity || 1,
      price: Number(game.price || 0),
    };
  };

  const refreshCart = async () => {
    const { data } = await api.get('/cart');
    setCart(data.map(normalizeCartItem));
  };

  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) {
        setCart([]);
        return;
      }

      try {
        await refreshCart();
      } catch (error) {
        console.error('Failed to load cart:', error);
        setCart([]);
      }
    };

    loadCart();
  }, [isAuthenticated, user?.id]);

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      toast('Please login first!');
      return;
    }

    const gameId = product.id || product._id;
    if (cart.some(item => item.id === gameId)) {
      toast('Already in cart');
      return;
    }

    try {
      const { data } = await api.post('/cart', { gameId, quantity: 1 });
      setCart(prev => [...prev, normalizeCartItem(data)]);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const increaseQuantity = async (id) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    const quantity = item.quantity + 1;
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));

    try {
      await api.put(`/cart/${item.cartItemId}`, { quantity });
    } catch (error) {
      console.error('Failed to increase quantity:', error);
      await refreshCart();
    }
  };

  const decreaseQuantity = async (id) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (item.quantity === 1) {
      await removeFromCart(id);
      return;
    }

    const quantity = item.quantity - 1;
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));

    try {
      await api.put(`/cart/${item.cartItemId}`, { quantity });
    } catch (error) {
      console.error('Failed to decrease quantity:', error);
      await refreshCart();
    }
  };

  const removeFromCart = async (id) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    setCart(prev => prev.filter(i => i.id !== id));

    try {
      await api.delete(`/cart/${item.cartItemId}`);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      await refreshCart();
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

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
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
