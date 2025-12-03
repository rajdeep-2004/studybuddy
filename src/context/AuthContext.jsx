import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token and get user data
          // We can use the dashboard endpoint or a dedicated /me endpoint
          // For now, we'll decode the token or just trust it and fetch profile if needed
          // Let's assume the token is valid if it exists, but ideally we should verify
          // We can call a protected route to verify
           const res = await api.get('/auth/dashboard'); // This returns a welcome message, but verifies token
           // We might want to store user info in local storage or decode token
           // For simplicity, let's decode the token client side or just store basic info
           // Actually, let's just set a dummy user object or decode the token if we had a library
           // But better, let's fetch user details if we had an endpoint.
           // For now, we'll just set currentUser to true or an object
           setCurrentUser({ token }); 
        } catch (err) {
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const signup = async (name, email, password, gender) => {
    const res = await api.post('/auth/register', { name, email, password, gender });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      setCurrentUser({ token: res.data.token });
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setCurrentUser({ token: res.data.token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
