
import axios from 'axios';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: 'http://localhost:5000',
});

