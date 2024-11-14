import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/config';
import { supabaseApi } from '../lib/supabase/api';
import type { User } from '@supabase/supabase-js';

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    return supabaseApi.auth.signUp(email, password, username);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    return supabaseApi.auth.signIn(email, password);
  }, []);

  const signOut = useCallback(async () => {
    return supabaseApi.auth.signOut();
  }, []);

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    api: supabaseApi,
  };
}