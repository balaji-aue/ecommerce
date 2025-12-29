import React, { createContext, useEffect, useState } from 'react';
import { setAuthToken, me } from './services/api';

export const AuthContext = createContext({ user: null, token: null, setUser: () => {}, logout: () => {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      me().then(res => setUser(res.data)).catch(() => { setUser(null); setAuthToken(null); localStorage.removeItem('token'); });
    }
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};