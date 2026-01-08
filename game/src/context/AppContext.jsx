import React from 'react';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';

export const AppProvider = ({ children }) => {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </CartProvider>
  );
};