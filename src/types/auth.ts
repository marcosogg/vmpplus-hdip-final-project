import type { User, Session } from '@supabase/supabase-js';

export type AuthUser = User;

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error: string | null
  }>;
  signUp: (email: string, password: string) => Promise<{
    success: boolean;
    error: string | null
  }>;
  signOut: () => Promise<void>;
} 