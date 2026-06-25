import {Link, useSearchParams} from 'react-router-dom';
import {useEffect, useMemo, useState} from 'react';
import {listPosts} from '@/lib/posts';
import type {Post} from '@/types/post';
import {CategoryBadge} from '@/components/CategoryBadge';
import {SEO} from '@/components/SEO';
import {Skeleton} from '@/components/Skeleton';
import {SITE_DESCRIPTION} from '@/lib/config';

export default function Home() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') ?? undefined;
  const q = searchParams.get('q') ?? undefined;
  const filters = useMemo(() => ({category: category || undefined, q: q || undefined}), [category, q]);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listPosts({ ...filters, page }).then((result) => {
      if (!cancelled) {
        setPosts((prev) => (page === 1 ? result.posts : [...prev, ...result.posts]));
        setHasMore(result.hasMore);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [filters, page]);

  const featuredPosts = useMemo(() => posts.filter((p) => p.featured), [posts]);
  const regularPosts = useMemo(() => posts.filter((p) => !p.featured), [posts]);

  const featuredGridPosts = useMemo(() => {
    if (featuredPosts.length > 0) {
      const f = featuredPosts.slice(0, 4);
      const remaining = 4 - f.length;
      if (remaining > 0) return [...f, ...regularPosts.slice(0, remaining)];
      return f;
    }
    return posts.slice(0, 4);
  }, [featuredPosts, regularPosts, posts]);

  if (loading && page === 1) {
    return (
      <div className="container-custom pt-24 md:pt-32 pb-32">
        <div className="space-y-8 max-w-3xl">
          <Skeleton className="h-16 w-2/3" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="container-custom pt-24 md:pt-32 pb-32 text-center">
        <SEO />
        <h1 className="text-3xl font-serif font-bold text-on-background mb-4">Sin entradas</h1>
        <p className="text-on-surface-variant mb-8">Prueba otro criterio de búsqueda o vuelve al inicio.</p>
        <Link to="/" className="btn-primary inline-block">
          Ver todo
        </Link>
      </div>
    );
  }

  const showFeaturedLayout = posts.length >= 4;

  return (
    <div className="flex flex-col gap-24">
      <SEO />
      <section className="container-custom pt-24 md:pt-32 max-w-3xl">
        <h1 className="animate-fade-in-up text-5xl md:text-7xl font-bold text-on-background mb-8 leading-[1.1]">
          A quiet space for <br /> <span className="italic font-normal">creative thought.</span>
        </h1>
        <p className="animate-fade-in-up text-xl md:text-2xl text-on-surface-variant leading-relaxed mb-12 font-sans font-light" style={{animationDelay: '0.2s'}}>
          {SITE_DESCRIPTION}
        </p>
        <div className="w-16 h-px bg-outline/40" />
      </section>

      <section className="container-custom pb-32">
        {showFeaturedLayout ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <PostLargeCard post={featuredGridPosts[0]} />
            <PostSmallCard post={featuredGridPosts[1]} />
            <PostMediumCard post={featuredGridPosts[2]} />
            <PostTextFeature post={featuredGridPosts[3]} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {featuredPosts.length > 0 && regularPosts.length > 0 ? (
          <div className="mt-24">
            <h2 className="text-3xl font-serif font-bold mb-12 border-b border-outline/10 pb-4">Más artículos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {regularPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : null}

        {hasMore ? (
          <div className="mt-16 text-center">
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className="btn-primary disabled:opacity-60"
            >
              {loading ? 'Cargando…' : 'Cargar más artículos'}
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function PostLargeCard({post}: {post: Post}) {
  return (
    <Link to={`/read/${post.id}`} className="col-span-1 md:col-span-8 group">
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-outline/10 bg-white shadow-soft">
        <img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="mt-8 flex flex-col items-start gap-4">
        <CategoryBadge category={post.category} />
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight group-hover:text-primary transition-colors">{post.title}</h2>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">{post.excerpt}</p>
      </div>
    </Link>
  );
}

function PostSmallCard({post}: {post: Post}) {
  return (
    <Link to={`/read/${post.id}`} className="col-span-1 md:col-span-4 md:mt-48 group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-outline/10 bg-white shadow-soft">
        <img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="mt-6 flex flex-col items-start gap-3">
        <CategoryBadge category={post.category} />
        <h3 className="text-2xl font-semibold leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
        <p className="text-base text-on-surface-variant leading-relaxed">{post.excerpt}</p>
      </div>
    </Link>
  );
}

function PostMediumCard({post}: {post: Post}) {
  return (
    <Link to={`/read/${post.id}`} className="col-span-1 md:col-span-5 md:col-start-2 mt-12 group">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-outline/10 bg-white shadow-soft">
        <img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="mt-6 flex flex-col items-start gap-3">
        <CategoryBadge category={post.category} />
        <h3 className="text-3xl font-semibold group-hover:text-primary transition-colors">{post.title}</h3>
        <p className="text-lg text-on-surface-variant leading-relaxed">{post.excerpt}</p>
      </div>
    </Link>
  );
}

function PostTextFeature({post}: {post: Post}) {
  return (
    <div className="col-span-1 md:col-span-5 md:mt-48">
      <div className="border-t border-outline/20 pt-12 flex flex-col items-start gap-6">
        <CategoryBadge category={post.category} />
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight">{post.title}</h2>
        <p className="text-lg text-on-surface-variant leading-relaxed">{post.excerpt}</p>
        <Link
          to={`/read/${post.id}`}
          className="text-primary font-semibold border-b border-primary/40 pb-0.5 hover:border-primary transition-all"
        >
          Leer entrada completa
        </Link>
      </div>
    </div>
  );
}

function PostCard({post}: {post: Post}) {
  return (
    <Link to={`/read/${post.id}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-lg border border-outline/10 bg-white shadow-soft">
        <img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="mt-6 flex flex-col items-start gap-3">
        <CategoryBadge category={post.category} />
        <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">{post.title}</h3>
        <p className="text-base text-on-surface-variant leading-relaxed">{post.excerpt}</p>
      </div>
    </Link>
  );
}
