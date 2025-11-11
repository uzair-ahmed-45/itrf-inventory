import axios from 'axios';
import Cookies from 'js-cookie';

// Get API URL from runtime config or environment variable
const getApiUrl = () => {
  // Priority: Runtime config (for production) > Environment variable (for development) > Default
  if (window.APP_CONFIG && window.APP_CONFIG.API_URL) {
    return window.APP_CONFIG.API_URL;
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect on 401 if it's not the login endpoint
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      
      if (!isLoginRequest) {
        // Token expired or invalid - only for authenticated routes
        Cookies.remove('token');
        Cookies.remove('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

