import { createClient } from '@supabase/supabase-js';

import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase ainda não foi configurado. Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local.',
  );
}

const fallbackSupabaseUrl = 'https://example.supabase.co';
const fallbackSupabaseAnonKey = 'missing-anon-key';

export const supabase = createClient<Database>(
  supabaseUrl ?? fallbackSupabaseUrl,
  supabaseAnonKey ?? fallbackSupabaseAnonKey,
);

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
