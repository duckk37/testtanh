import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.get('/users/me')
      .then(res => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem('access_token');
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 expects 'username' field
    formData.append('password', password);

    try {
      const res = await api.post('/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const data = res.data;
      localStorage.setItem('access_token', data.access_token);
      
      // Fetch user info
      const userRes = await api.get('/users/me');
      setUser(userRes.data);
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Login failed');
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await api.post('/register', { username, email, password });
      const data = res.data;
      localStorage.setItem('access_token', data.access_token);
      
      // Fetch user info
      const userRes = await api.get('/users/me');
      setUser(userRes.data);
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isTeacher = () => user?.role === 'admin' || user?.role === 'teacher';
  const isAssistant = () => user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'assistant';

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, isAdmin, isTeacher, isAssistant }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
