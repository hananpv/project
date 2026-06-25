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

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('gameStoreToken');
        if (!token) return;

        const res = await api.get('/auth/me');
        setUser(res.data);
        localStorage.setItem('gameStoreUser', JSON.stringify(res.data));
      } catch (error) {
        console.error('Auth load failed:', error);
        localStorage.removeItem('gameStoreToken');
        localStorage.removeItem('gameStoreUser');
        localStorage.removeItem('userId');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });

    localStorage.setItem('gameStoreToken', data.token);
    localStorage.setItem('gameStoreUser', JSON.stringify(data.user));
    localStorage.setItem('userId', data.user.id);
    setUser(data.user);

    return data.user;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);

    localStorage.setItem('gameStoreToken', data.token);
    localStorage.setItem('gameStoreUser', JSON.stringify(data.user));
    localStorage.setItem('userId', data.user.id);
    setUser(data.user);

    return data.user;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('gameStoreUser', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gameStoreToken');
    localStorage.removeItem('gameStoreUser');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
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
