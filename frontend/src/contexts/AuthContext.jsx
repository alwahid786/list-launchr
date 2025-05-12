import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user data using token
  const fetchUserData = async (token) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, config);
      setCurrentUser(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch user error:', err);
      localStorage.removeItem('token');
      setCurrentUser(null);
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);
      
      // Save token to local storage
      localStorage.setItem('token', res.data.token);
      setCurrentUser(res.data.user);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password
      });
      
      // Save token to local storage
      localStorage.setItem('token', res.data.token);
      setCurrentUser(res.data.user);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  // Google OAuth login
  const googleLogin = async (tokenId) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        tokenId
      });
      
      // Save token to local storage
      localStorage.setItem('token', res.data.token);
      setCurrentUser(res.data.user);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
      setLoading(false);
      throw err;
    }
  };

  // Update user details
  const updateUserDetails = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/updatedetails`,
        userData,
        config
      );
      
      setCurrentUser(res.data.data);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setLoading(false);
      throw err;
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/updatepassword`,
        passwordData,
        config
      );
      
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
      setLoading(false);
      throw err;
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        email
      });
      
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Forgot password request failed');
      setLoading(false);
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (resetToken, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${resetToken}`,
        { password }
      );
      
      // Save token to local storage
      localStorage.setItem('token', res.data.token);
      setCurrentUser(res.data.user);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      setLoading(false);
      throw err;
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`);
      
      // Update current user if logged in
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          emailVerified: true
        });
      }
      
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Email verification failed');
      setLoading(false);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/logout`, config);
      }
      
      localStorage.removeItem('token');
      setCurrentUser(null);
      setLoading(false);
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear user data even if server logout fails
      localStorage.removeItem('token');
      setCurrentUser(null);
      setLoading(false);
    }
  };

  // Check if user is pro
  const isPro = () => {
    return currentUser?.accountType === 'pro';
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        googleLogin,
        updateUserDetails,
        updatePassword,
        forgotPassword,
        resetPassword,
        verifyEmail,
        logout,
        isPro
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};