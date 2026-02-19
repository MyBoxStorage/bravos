import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authService, type AuthUser, type AuthResponse, type LoginInput, type SignupInput } from '../services/auth';

export type SignupOutcome =
  | { kind: 'logged_in' }
  | { kind: 'verification_required'; userId: string };

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<SignupOutcome>;
  verifyEmail: (userId: string, code: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      const savedToken = authService.getToken();
      if (savedToken) {
        try {
          const userData = await authService.getMe(savedToken);
          if (cancelled) return;
          setUser(userData);
          setToken(savedToken);
        } catch {
          if (cancelled) return;
          authService.removeToken();
          setUser(null);
          setToken(null);
        }
      }
      if (!cancelled) setIsLoading(false);
    };

    loadUser();

    return () => { cancelled = true; };
  }, []);

  const login = async (data: LoginInput) => {
    const response = await authService.login(data);
    authService.saveToken(response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const signup = async (data: SignupInput): Promise<SignupOutcome> => {
    const response = await authService.signup(data);
    if ('requiresVerification' in response && response.requiresVerification) {
      return { kind: 'verification_required', userId: response.userId };
    }
    const auth = response as AuthResponse;
    authService.saveToken(auth.token);
    setToken(auth.token);
    setUser(auth.user);
    return { kind: 'logged_in' };
  };

  const verifyEmail = async (userId: string, code: string) => {
    const response = await authService.verifyEmail(userId, code);
    authService.saveToken(response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const logout = useCallback(() => {
    authService.removeToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = authService.getToken();
    if (!currentToken) return;
    try {
      const userData = await authService.getMe(currentToken);
      setUser(userData);
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, signup, verifyEmail, logout, refreshUser }}
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
