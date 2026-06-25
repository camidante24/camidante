import { getSupabase } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type Supabase = SupabaseClient<Database>;

export async function queryOrFallback<T>(
  fn: (sb: Supabase) => Promise<{ data: T | null; error: any }>,
  fallback: () => T,
): Promise<T> {
  const sb = getSupabase();
  if (!sb) return fallback();
  const { data, error } = await fn(sb);
  if (error || !data) {
    if (error) console.warn('[db]', error.message);
    return fallback();
  }
  return data;
}

export async function queryArrayOrFallback<T>(
  fn: (sb: Supabase) => Promise<{ data: T[] | null; error: any }>,
  fallback: () => T[],
): Promise<T[]> {
  const sb = getSupabase();
  if (!sb) return fallback();
  const { data, error } = await fn(sb);
  if (error) {
    console.warn('[db]', error.message);
    return fallback();
  }
  return (data ?? []) as T[];
}
