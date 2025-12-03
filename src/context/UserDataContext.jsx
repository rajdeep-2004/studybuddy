import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const UserDataContext = createContext();

export function useUserData() {
  return useContext(UserDataContext);
}

export function UserDataProvider({ children }) {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && currentUser.token) {
        try {
          const res = await api.get('/auth/me');
          setUserData({ ...res.data, uid: res.data._id }); // Map _id to uid for compatibility
        } catch (err) {
          console.error("Error fetching user data:", err);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [currentUser]);

  const value = {
    userData,
    loading,
    setUserData, // Allow manual updates if needed
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}
