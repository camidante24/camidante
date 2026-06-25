import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import type {Session, User} from '@supabase/supabase-js';
import {getSupabase} from '@/lib/supabase';
import type {DbProfile} from '@/types/database';

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: DbProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{error?: string}>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{error?: string}>;
  signOut: () => Promise<void>;
  updateProfile: (patch: {full_name?: string | null; avatar_url?: string | null}) => Promise<{error?: string}>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const sb = getSupabase();
    const uid = user?.id;
    if (!sb || !uid) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    try {
      const {data} = await sb.from('profiles').select('*').eq('id', uid).maybeSingle();
      setProfile(data ?? null);
    } finally {
      setProfileLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setSession(null);
      setUser(null);
      setAuthLoading(false);
      setProfileLoading(false);
      return;
    }

    sb.auth
      .getSession()
      .then(({data}) => {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      })
      .catch(() => {
        setSession(null);
        setUser(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });

    const {
      data: {subscription},
    } = sb.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setProfile(null);
      setProfileLoading(Boolean(sess?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    void refreshProfile();
  }, [authLoading, refreshProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const sb = getSupabase();
    if (!sb) return {error: 'Supabase no está configurado.'};
    const {error} = await sb.auth.signInWithPassword({email, password});
    return {error: error?.message};
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    const sb = getSupabase();
    if (!sb) return {error: 'Supabase no está configurado.'};
    const {error} = await sb.auth.signUp({
      email,
      password,
      options: {data: {full_name: fullName ?? ''}},
    });
    return {error: error?.message};
  }, []);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    setProfile(null);
    setProfileLoading(false);
  }, []);

  const loading = authLoading || profileLoading;

  const updateProfile = useCallback(
    async (patch: {full_name?: string | null; avatar_url?: string | null}) => {
      const sb = getSupabase();
      if (!sb || !user) return {error: 'No hay sesión.'};
      const {error} = await sb
        .from('profiles')
        .update({...patch, updated_at: new Date().toISOString()})
        .eq('id', user.id);
      if (error) return {error: error.message};
      await refreshProfile();
      return {};
    },
    [user, refreshProfile],
  );

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      refreshProfile,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [user, session, profile, loading, refreshProfile, signIn, signUp, signOut, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
