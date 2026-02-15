import { apiConfig } from '../config/api';

const API_URL = apiConfig.baseURL;

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  totalGenerations?: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export const authService = {
  async signup(data: SignupInput): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error((error as { error?: string }).error || 'Erro ao criar conta');
    }

    return res.json();
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error((error as { error?: string }).error || 'Email ou senha inválidos');
    }

    return res.json();
  },

  async getMe(token: string): Promise<AuthUser> {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error('Token inválido');
    }

    const data = await res.json();
    return data.user;
  },

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  removeToken(): void {
    localStorage.removeItem('auth_token');
  },
};
