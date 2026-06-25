import {User, Mail, Bookmark, ShieldCheck} from 'lucide-react';
import {Link, Navigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {listBookmarkedPosts} from '@/lib/bookmarks';
import type {Post} from '@/types/post';
import {CategoryBadge} from '@/components/CategoryBadge';
import {DateLabelShort} from '@/components/DateLabel';
import {SEO} from '@/components/SEO';

export default function Profile() {
  const {user, profile, loading, updateProfile, signOut} = useAuth();
  const [name, setName] = useState('');
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setName(profile?.full_name ?? user?.user_metadata?.full_name ?? '');
  }, [profile?.full_name, user]);

  useEffect(() => {
    if (!user) return;
    listBookmarkedPosts(user.id).then(setSavedPosts);
  }, [user]);

  if (!loading && !user) {
    return <Navigate to="/login" replace state={{from: '/profile'}} />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setPending(true);
    const {error} = await updateProfile({full_name: name.trim() || null});
    setPending(false);
    if (error) setMsg(error);
    else setMsg('Perfil actualizado.');
  }

  const email = user?.email ?? '';

  return (
    <div className="container-custom py-16 md:py-24">
      <SEO title={profile?.full_name || 'Perfil'} />
      <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
        <div className="animate-fade-in-up">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-outline/10 bg-surface-container-low flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-20 h-20 text-on-surface-variant" strokeWidth={1} />
            )}
          </div>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold mb-2 tracking-tight text-on-background">{profile?.full_name || name || 'Lector'}</h1>
          <p className="text-lg text-on-surface-variant font-light flex items-center justify-center md:justify-start gap-2 mb-4">
            <Mail size={18} /> {email || '—'}
          </p>
          <p className="text-tertiary max-w-md italic mb-6">Lector y coleccionista de ensayos lentos.</p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <button type="button" className="text-sm font-semibold text-on-surface-variant hover:text-primary" onClick={() => void signOut()}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <section className="lg:col-span-4">
          <div className="flex items-center gap-3 mb-10 pb-4 border-b border-outline/10">
            <ShieldCheck className="text-primary" />
            <h2 className="text-3xl font-bold">Mis datos</h2>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-tertiary">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-outline/20 rounded-lg px-4 py-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all shadow-soft"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-tertiary">Correo</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full bg-outline/5 border border-outline/10 rounded-lg px-4 py-4 text-on-surface-variant cursor-not-allowed"
              />
            </div>
            {msg ? <p className="text-sm text-on-surface-variant">{msg}</p> : null}
            <button type="submit" disabled={pending} className="w-full md:w-auto btn-primary disabled:opacity-60">
              {pending ? 'Guardando…' : 'Actualizar perfil'}
            </button>
          </form>
        </section>

        <section className="lg:col-span-8">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-outline/10">
            <div className="flex items-center gap-3">
              <Bookmark className="text-primary" fill="currentColor" />
              <h2 className="text-3xl font-bold">Colección guardada</h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-outline/5 rounded-full">{savedPosts.length} artículos</span>
          </div>

          {savedPosts.length === 0 ? (
            <p className="text-on-surface-variant">Aún no has guardado entradas. Abre un artículo y pulsa &quot;Guardar en mi colección&quot;.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {savedPosts.map((article) => (
                <article
                  key={article.id}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-outline/5 shadow-soft transition-all hover:-translate-y-2 duration-200"
                >
                  <Link to={`/read/${article.id}`} className="aspect-video overflow-hidden block">
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-4">
                      <CategoryBadge category={article.category} />
                    </div>
                    <Link to={`/read/${article.id}`}>
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors mb-4">{article.title}</h3>
                    </Link>
                    <p className="text-base text-on-surface-variant font-light line-clamp-2 mb-6">{article.excerpt}</p>
                    <div className="mt-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-tertiary">
                      <span><DateLabelShort date={article.published_at} /></span>
                      <Bookmark size={14} fill="currentColor" className="text-primary" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
