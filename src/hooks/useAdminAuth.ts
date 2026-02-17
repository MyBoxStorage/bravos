import { useState, useEffect } from 'react';

const STORAGE_KEY = 'admin_token';

interface UseAdminAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (password: string) => boolean;
  logout: () => void;
  token: string;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setToken(saved);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    if (!password.trim()) {
      setError('Digite o token de acesso.');
      return false;
    }
    localStorage.setItem(STORAGE_KEY, password.trim());
    setToken(password.trim());
    setIsAuthenticated(true);
    setError(null);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken('');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, error, login, logout, token };
}
