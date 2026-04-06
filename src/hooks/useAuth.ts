import type { Session } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { IS_MOCK } from '../lib/mockData';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

const MOCK_SESSION = { user: { id: 'mock-user', email: 'mock@test.com' } } as Session;

export function useAuthListener() {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    if (IS_MOCK) {
      setSession(MOCK_SESSION);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUp(email: string, password: string) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
