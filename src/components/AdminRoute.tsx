import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
import type {ReactNode} from 'react';

export function AdminRoute({children}: {children: ReactNode}) {
  const {user, profile, loading} = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-on-surface-variant font-sans">Cargando…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{from: location.pathname}} />;
  }

  if (!profile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
