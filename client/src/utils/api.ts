import axios from 'axios';
import { interceptAxiosRequests } from './mockApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enable mock API (set VITE_USE_FAKE_BACKEND=true/false in .env to toggle)
interceptAxiosRequests(api);

// Add auth token to requests (skip for public routes)
api.interceptors.request.use(
  (config) => {
    // Skip auth for public routes
    if (
      config.url?.includes('/public/') || 
      config.url?.includes('/menu/') ||
      config.url?.includes('/orders/public')
    ) {
      return config;
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors (skip for public routes)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401 for public routes
    if (error.response?.status === 401 && !error.config?.url?.includes('/public/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

