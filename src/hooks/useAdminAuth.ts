import { useState, useEffect } from 'react';
import { supabase, type User } from '@/lib/supabase';

interface AdminAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UseAdminAuthReturn extends AdminAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        verifyAdminAccess(session.user);
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await verifyAdminAccess(session.user);
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function verifyAdminAccess(user: User) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email, is_active')
      .eq('email', user.email ?? '')
      .eq('is_active', true)
      .single();

    if (error || !data) {
      await supabase.auth.signOut();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Acesso negado. Este email não tem permissão de admin.',
      });
      return;
    }

    setState({ user, isAuthenticated: true, isLoading: false, error: null });
  }

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setState((s) => ({ ...s, isLoading: true, error: null }));

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.user) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error:
          error?.message === 'Invalid login credentials'
            ? 'Email ou senha incorretos.'
            : 'Erro ao fazer login. Tente novamente.',
      }));
      return false;
    }

    return true;
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  return { ...state, login, logout };
}
