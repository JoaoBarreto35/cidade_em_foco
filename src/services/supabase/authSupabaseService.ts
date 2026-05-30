import type { Session } from '@supabase/supabase-js';

import { supabase } from '../supabaseClient';

type AuthResult = {
  session?: Session | null;
  error?: string;
};

export async function signInAdmin(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { session: data.session };
}

export async function signOutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentAdminSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();

  return data.session;
}
