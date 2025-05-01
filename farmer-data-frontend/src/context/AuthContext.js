import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      if (user) {
        setLoading(false); // Skip validation if user is already set
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/auth/validate', { withCredentials: true });
        const validatedUser = res.data.user;
        setUser(validatedUser);
        localStorage.setItem('user', JSON.stringify(validatedUser)); // Persist user
      } catch (err) {
        console.error('Auth validation error:', err.response?.data?.message || err.message);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    validateUser();
  }, []); // Empty dependency array to run only on mount

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      const newUser = res.data.user;
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout error:', err.response?.data?.message || err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};