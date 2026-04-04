'use client';

import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserID = localStorage.getItem('userID');
    const storedEmail = localStorage.getItem('email');

    setToken(storedToken);
    setUserID(storedUserID);
    setEmail(storedEmail);
    setIsLoading(false);
  }, []);

  const setAuthData = (token: string, userID: string, email: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userID', userID);
    localStorage.setItem('email', email);
    setToken(token);
    setUserID(userID);
    setEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('email');
    setToken(null);
    setUserID(null);
    setEmail(null);
  };

  return {
    token,
    userID,
    email,
    isLoading,
    isAuthenticated: !!token,
    setAuthData,
    logout,
  };
};
