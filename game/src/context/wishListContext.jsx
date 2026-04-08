import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../api/Axios';
import { toast } from 'react-toastify';

const WishlistContext = createContext(null);
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);


  useEffect(() => {
    if (user?.wishlist) {
      setWishlist(user.wishlist);
    } else {
      setWishlist([]);
    }
  }, [user]);

 
  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      toast('Please login to add to wishlist');
      return;
    }

    if (wishlist.some(item => item.id === product.id)) return;

    const updatedWishlist = [...wishlist, product];
    setWishlist(updatedWishlist);

    await api.patch(`/users/${user.id}`, {
      wishlist: updatedWishlist
    });
  };


  const removeFromWishlist = async (id) => {
    const updatedWishlist = wishlist.filter(item => item.id !== id);
    setWishlist(updatedWishlist);

    await api.patch(`/users/${user.id}`, {
      wishlist: updatedWishlist
    });
  };

  const isInWishlist = (id) =>
    wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
