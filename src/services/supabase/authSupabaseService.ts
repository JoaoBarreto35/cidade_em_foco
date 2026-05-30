import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '../supabaseClient';

type AdminProfile = {
  id: string;
  name: string;
  role: 'admin';
};

type AuthResult = {
  session?: Session | null;
  user?: User | null;
  profile?: AdminProfile | null;
  error?: string;
};

export async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, role')
    .eq('id', userId)
    .eq('role', 'admin')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as AdminProfile | null;
}

export async function signInAdmin(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'E-mail ou senha inválidos.' };
  }

  if (!data.user) {
    return { error: 'Não foi possível identificar o usuário.' };
  }

  try {
    const profile = await getAdminProfile(data.user.id);

    if (!profile) {
      await supabase.auth.signOut();
      return { error: 'Este usuário não possui perfil de administrador.' };
    }

    return { session: data.session, user: data.user, profile };
  } catch (profileError) {
    await supabase.auth.signOut();

    return {
      error: profileError instanceof Error ? profileError.message : 'Não foi possível validar o perfil admin.',
    };
  }
}

export async function signOutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentAdminSession(): Promise<AuthResult> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return { error: error.message };
  }

  if (!data.session?.user) {
    return { session: null, user: null, profile: null };
  }

  try {
    const profile = await getAdminProfile(data.session.user.id);

    if (!profile) {
      await supabase.auth.signOut();
      return { session: null, user: null, profile: null };
    }

    return {
      session: data.session,
      user: data.session.user,
      profile,
    };
  } catch (profileError) {
    return {
      error: profileError instanceof Error ? profileError.message : 'Não foi possível validar a sessão admin.',
    };
  }
}
