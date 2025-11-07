import api from './api';
import Cookies from 'js-cookie';

export const authService = {
  // Login
  login: async (username, password) => {
    try {
      console.log('🔐 Attempting login...', { username });
      
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      
      console.log('✅ Login response:', response.data);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store token and user in cookies (expires in 1 day)
        Cookies.set('token', token, { expires: 1, secure: false, sameSite: 'strict' });
        Cookies.set('user', JSON.stringify(user), { expires: 1, secure: false, sameSite: 'strict' });
        
        console.log('✅ Token and user stored in cookies');
        
        return {
          success: true,
          user,
          token,
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Login failed',
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred during login',
      };
    }
  },

  // Logout
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        // Update user in cookie
        Cookies.set('user', JSON.stringify(response.data.data), { expires: 1, secure: false, sameSite: 'strict' });
        
        return {
          success: true,
          user: response.data.data,
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Failed to fetch user',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred',
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = Cookies.get('token');
    const user = Cookies.get('user');
    return !!(token && user);
  },

  // Get stored user
  getStoredUser: () => {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  },

  // Get stored token
  getToken: () => {
    return Cookies.get('token');
  },
};

export default authService;

