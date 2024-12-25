import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import type { User } from '@supabase/supabase-js';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();
  
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user as User | null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as User | null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return children;
}