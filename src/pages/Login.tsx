import {useEffect, useState} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
import {SEO} from '@/components/SEO';
import {SITE_NAME} from '@/lib/config';

export default function Login() {
  const {signIn, signUp, user} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as {from?: string} | null)?.from ?? '/';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (user) navigate(from, {replace: true});
  }, [user, from, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);
    try {
      if (mode === 'login') {
        const {error: err} = await signIn(email, password);
        if (err) setError(err);
        else navigate(from, {replace: true});
      } else {
        const {error: err} = await signUp(email, password, fullName);
        if (err) setError(err);
        else setInfo('Si tu proyecto requiere confirmación por correo, revisa la bandeja de entrada.');
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container-custom py-24 md:py-32 max-w-md mx-auto">
      <SEO title={mode === 'login' ? 'Entrar' : 'Crear cuenta'} />
      <div className="animate-fade-in-up bg-white rounded-xl border border-outline/10 shadow-soft p-8 md:p-10">
        <h1 className="text-3xl font-serif font-bold text-center mb-2">{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</h1>
        <p className="text-center text-sm text-on-surface-variant mb-8">{SITE_NAME}</p>

        <div className="flex rounded-lg border border-outline/15 p-1 mb-8">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'login' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
            onClick={() => setMode('login')}
          >
            Acceso
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'register' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
            onClick={() => setMode('register')}
          >
            Registro
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {mode === 'register' ? (
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-tertiary">Nombre</label>
              <input
                className="w-full border border-outline/20 rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-primary"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
          ) : null}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-tertiary">Correo</label>
            <input
              type="email"
              required
              className="w-full border border-outline/20 rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-tertiary">Contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full border border-outline/20 rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {info ? <p className="text-sm text-secondary bg-secondary-container/10 border border-outline/10 rounded-lg px-3 py-2">{info}</p> : null}

          {error ? <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p> : null}

          <button type="submit" disabled={pending} className="w-full btn-primary disabled:opacity-60">
            {pending ? 'Enviando…' : mode === 'login' ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-8">
          <Link to="/" className="text-primary font-semibold hover:underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
