import {useParams, Link} from 'react-router-dom';
import {Calendar, Clock, ArrowLeft, ArrowRight} from 'lucide-react';
import {useEffect, useState, type ComponentProps} from 'react';
import ReactMarkdown from 'react-markdown';
import {getPostById} from '@/lib/posts';
import type {Post} from '@/types/post';
import {useAuth} from '@/context/AuthContext';
import {toggleBookmark, isBookmarked} from '@/lib/bookmarks';
import {BookmarkButton} from '@/components/BookmarkButton';
import {CategoryBadge} from '@/components/CategoryBadge';
import {DateLabel} from '@/components/DateLabel';
import {SEO} from '@/components/SEO';
import {Skeleton} from '@/components/Skeleton';
import {AUTHOR, SITE_NAME} from '@/lib/config';

export default function Article() {
  const {id} = useParams();
  const {user} = useAuth();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setPost(null);
      return;
    }
    setPost(undefined);
    getPostById(id).then((p) => {
      if (!cancelled) setPost(p);
    });
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (!user || !post?.id) {
      setSaved(false);
      return;
    }
    isBookmarked(post.id, user.id).then(setSaved);
  }, [user, post?.id]);

  if (post === undefined) {
    return (
      <div className="container-custom py-24">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-2/3 mx-auto" />
          <Skeleton className="h-64" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-custom py-24 text-center">
        <SEO title="Entrada no encontrada" />
        <h1 className="text-4xl font-bold mb-4">Entrada no encontrada</h1>
        <p className="text-on-surface-variant mb-8">No hay ninguna publicación con este enlace.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Volver al inicio
        </Link>
      </div>
    );
  }

  const dateLabel = post.published_at ? new Date(post.published_at).toLocaleDateString('es', {day: 'numeric', month: 'long', year: 'numeric'}) : '';

  const markdownComponents = {
    blockquote: (props: ComponentProps<'blockquote'>) => (
      <blockquote className="my-20 pl-8 border-l-4 border-primary relative not-italic">{props.children}</blockquote>
    ),
  };

  async function onToggleSave() {
    if (!user || !post) return;
    setBookmarkError(null);
    const result = await toggleBookmark(post.id, user.id);
    setSaved(result.saved);
    if (result.ok === false) setBookmarkError(result.error);
  }

  return (
    <article className="animate-fade-in container-custom py-16 md:py-24">
      <SEO title={post.title} description={post.excerpt} image={post.cover_image} url={`/read/${post.id}`} />
      <div className="max-w-3xl mx-auto mb-8">
        <Link to="/" className="text-sm font-semibold text-on-surface-variant hover:text-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Inicio
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <header className="mb-16 text-center">
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            <CategoryBadge category={post.category} />
            {post.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="px-4 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant text-xs font-semibold tracking-widest uppercase border border-outline-variant/30"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">{post.title}</h1>
          <div className="flex items-center justify-center gap-6 text-on-surface-variant font-sans font-light flex-wrap">
            {dateLabel ? (
              <div className="flex items-center gap-2">
                <Calendar size={16} /> <DateLabel date={post.published_at} />
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Clock size={16} /> Lectura de {post.reading_minutes} min
            </div>
          </div>
          {user ? (
            <div className="mt-8">
              <BookmarkButton saved={saved} onToggle={onToggleSave} />
              {bookmarkError ? <p className="mt-3 text-sm text-red-700">{bookmarkError}</p> : null}
            </div>
          ) : null}
        </header>

        <div className="relative aspect-[16/9] md:aspect-video rounded-lg overflow-hidden mb-20 shadow-xl">
          <img
            src={post.cover_image}
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="article-markdown space-y-10">
          <ReactMarkdown components={markdownComponents}>{post.body}</ReactMarkdown>
        </div>

        <div className="mt-20 pt-8 border-t border-outline/10 flex flex-wrap gap-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container-high cursor-default transition-colors text-sm font-semibold border border-outline/20"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-20 p-8 bg-surface-container-low rounded-xl border border-outline/10 flex flex-col md:flex-row items-center gap-8 shadow-soft">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 bg-white flex items-center justify-center">
            <span className="text-primary font-serif font-bold italic text-3xl">{SITE_NAME.charAt(0)}</span>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">{AUTHOR.name}</h3>
            <p className="text-lg text-on-surface-variant font-light mb-4">
              {AUTHOR.bio}
            </p>
            <Link to="/" className="text-primary font-bold inline-flex items-center gap-2 hover:translate-x-1 transition-transform">
              Ver más entradas <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
