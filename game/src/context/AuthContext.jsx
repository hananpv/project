import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api/Axios';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 LOAD USER FROM LOCAL STORAGE + BACKEND
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('gameStoreUser');
        if (!savedUser) return;

        const parsedUser = JSON.parse(savedUser);

        // 🔥 GET FRESH USER FROM DB
        const res = await api.get(`/users/${parsedUser.id}`);
        setUser(res.data);

        // 🔄 Update localStorage
        localStorage.setItem('gameStoreUser', JSON.stringify(res.data));
      } catch (error) {
        console.error('Auth load failed:', error);
        localStorage.removeItem('gameStoreUser');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 🔐 LOGIN (expects full user from backend)
  const login = async (userData) => {
    // userData MUST include cart & wishlist
    setUser(userData);
    localStorage.setItem('gameStoreUser', JSON.stringify(userData));
    localStorage.setItem('userId', userData.id);
  };

  // 📝 REGISTER
  const register = async (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      role: 'user',
      cart: [],
      wishlist: [],
      payments: [],
      createdAt: new Date().toISOString()
    };

    // 🔥 SAVE USER TO DB
    await api.post('/users', newUser);

    setUser(newUser);
    localStorage.setItem('gameStoreUser', JSON.stringify(newUser));
    localStorage.setItem('userId', newUser.id);

    return newUser;
  };

  // 🔄 UPDATE USER (USED BY CART/WISHLIST)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('gameStoreUser', JSON.stringify(updatedUser));
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem('gameStoreUser');
    localStorage.removeItem('userId');
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated,
        isAdmin,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
