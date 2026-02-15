import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { authService, type AuthUser, type LoginInput, type SignupInput } from '../services/auth';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const savedToken = authService.getToken();
      if (savedToken) {
        try {
          const userData = await authService.getMe(savedToken);
          setUser(userData);
          setToken(savedToken);
        } catch {
          authService.removeToken();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (data: LoginInput) => {
    const response = await authService.login(data);
    authService.saveToken(response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const signup = async (data: SignupInput) => {
    const response = await authService.signup(data);
    authService.saveToken(response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    authService.removeToken();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const userData = await authService.getMe(token);
      setUser(userData);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
