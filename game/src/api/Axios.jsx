
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gameStoreToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const normalizeGame = (game = {}) => ({
  ...game,
  id: game.id || game._id,
});

export const getImageUrl = (image) => {
  if (!image) return '/placeholder.png';
  if (image.startsWith('http') || image.startsWith('data:image')) return image;
  if (image.startsWith('/')) return `${api.defaults.baseURL.replace(/\/api$/, '')}${image}`;
  return image;
};

