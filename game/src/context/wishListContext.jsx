import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api, normalizeGame } from '../api/Axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const normalizeWishlistItem = (item) => normalizeGame(item.gameId || item);

  const refreshWishlist = async () => {
    const { data } = await api.get('/wishlist');
    setWishlist(data.map(normalizeWishlistItem));
  };

  useEffect(() => {
    const loadWishlist = async () => {
      if (!isAuthenticated) {
        setWishlist([]);
        return;
      }

      try {
        await refreshWishlist();
      } catch (error) {
        console.error('Failed to load wishlist:', error);
        setWishlist([]);
      }
    };

    loadWishlist();
  }, [isAuthenticated, user?.id]);

  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      toast('Please login to add to wishlist');
      return;
    }

    const gameId = product.id || product._id;
    if (wishlist.some(item => item.id === gameId)) return;

    try {
      const { data } = await api.post('/wishlist', { gameId });
      setWishlist(prev => [...prev, normalizeWishlistItem(data)]);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id));

    try {
      await api.delete(`/wishlist/${id}`);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      await refreshWishlist();
    }
  };

  const isInWishlist = (id) =>
    wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
