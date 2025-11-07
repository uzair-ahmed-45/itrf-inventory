import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      const isAuth = authService.isAuthenticated();
      const storedUser = authService.getStoredUser();

      setIsAuthenticated(isAuth);
      setUser(storedUser);
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.login(username, password);

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true, user: result.user };
      } else {
        setError(result.message);
        setIsLoading(false);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during login';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const result = await authService.getCurrentUser();
      
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true, user: result.user };
      } else {
        return { success: false, message: result.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
  };
};

export default useAuth;

