import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  isSubmitting: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  isSubmitting: false,
  error: null,
  setUser: (user) => set({ user }),
  signUp: async (email, password, name) => {
    try {
      set({ isSubmitting: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) throw error;
      set({ user: data.user });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error signing up' });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },
  signIn: async (email, password) => {
    try {
      set({ isSubmitting: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      set({ user: data.user });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error signing in' });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error signing out' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  resetPassword: async (email) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error resetting password' });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));