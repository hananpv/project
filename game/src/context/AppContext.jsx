import React from 'react';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './wishListContext';

export const AppProvider = ({ children }) => {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </CartProvider>
  );
};
