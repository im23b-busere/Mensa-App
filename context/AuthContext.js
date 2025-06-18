'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Beim Laden der App prüfen, ob bereits ein Token existiert
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split('.')[1]));
        // Prüfen, ob der Token noch gültig ist (nicht abgelaufen)
        const currentTime = Date.now() / 1000;
        if (userData.exp && userData.exp > currentTime) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          // Token ist abgelaufen, entfernen
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Fehler beim Dekodieren des gespeicherten Tokens:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    try {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
    } catch (error) {
      console.error('Fehler beim Dekodieren des Tokens:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
  }
  return context;
} 