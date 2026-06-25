import {LOCAL_POSTS} from '@/data/localPosts';
import type {Post, PostListFilters} from '@/types/post';
import type {DbPost, DbPostInsert} from '@/types/database';
import {getSupabase} from '@/lib/supabase';
import {ENABLE_LOCAL_FALLBACK} from '@/lib/config';

export function rowToPost(row: DbPost): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    category: row.category,
    published_at: row.published_at,
    cover_image: row.cover_image,
    reading_minutes: row.reading_minutes,
    published: row.published,
    tags: row.tags ?? [],
    featured: row.featured,
    size: (row.size as Post['size']) ?? null,
  };
}

export function postToInsert(p: Partial<Post> & {title: string; excerpt: string; body: string; category: string; cover_image: string}): DbPostInsert {
  return {
    title: p.title,
    excerpt: p.excerpt,
    body: p.body,
    category: p.category,
    cover_image: p.cover_image,
    reading_minutes: p.reading_minutes ?? 5,
    published: p.published ?? false,
    published_at: p.published_at ?? null,
    tags: p.tags ?? [],
    featured: p.featured ?? false,
    size: p.size ?? null,
    slug: p.slug ?? null,
  };
}

function applyClientFilters(posts: Post[], filters?: PostListFilters): Post[] {
  let list = posts.filter((p) => p.published);
  if (filters?.category?.trim()) {
    const c = filters.category.trim().toLowerCase();
    list = list.filter((p) => p.category.toLowerCase() === c);
  }
  if (filters?.q?.trim()) {
    const q = filters.q.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }
  return list.sort((a, b) => {
    const da = a.published_at ? new Date(a.published_at).getTime() : 0;
    const db = b.published_at ? new Date(b.published_at).getTime() : 0;
    return db - da;
  });
}

const PAGE_SIZE = 12;

export interface ListPostsResult {
  posts: Post[];
  total: number;
  hasMore: boolean;
}

/** Public list: published posts only with pagination. Falls back to local seed if Supabase empty or errors. */
export async function listPosts(filters?: PostListFilters): Promise<ListPostsResult> {
  const page = filters?.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const sb = getSupabase();
  if (!sb) {
    const all = applyClientFilters([...LOCAL_POSTS], filters);
    return {
      posts: all.slice(from, from + PAGE_SIZE),
      total: all.length,
      hasMore: from + PAGE_SIZE < all.length,
    };
  }

  let query = sb.from('posts').select('*', { count: 'exact' }).eq('published', true);

  if (filters?.category?.trim()) {
    const c = filters.category.trim();
    query = query.eq('category', c);
  }
  if (filters?.q?.trim()) {
    const q = filters.q.trim();
    query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,body.ilike.%${q}%`);
  }

  const { data, error, count } = await query
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(from, to);

  if (error) {
    console.warn('[posts] listPosts', error.message);
    if (ENABLE_LOCAL_FALLBACK) {
      const all = applyClientFilters([...LOCAL_POSTS], filters);
      return {
        posts: all.slice(from, from + PAGE_SIZE),
        total: all.length,
        hasMore: from + PAGE_SIZE < all.length,
      };
    }
    return { posts: [], total: 0, hasMore: false };
  }

  const mapped = (data ?? []).map(rowToPost);
  return {
    posts: mapped,
    total: count ?? mapped.length,
    hasMore: from + PAGE_SIZE < (count ?? mapped.length),
  };
}

/** Single published post by id or slug (public). */
export async function getPostById(idOrSlug: string): Promise<Post | null> {
  const key = idOrSlug.trim();
  if (!key) return null;

  const sb = getSupabase();
  if (!sb) return tryLocalFallback(key);

  const { data, error } = await sb
    .from('posts')
    .select('*')
    .or(`id.eq.${key},slug.eq.${key}`)
    .eq('published', true)
    .maybeSingle();

  if (data && !error) return rowToPost(data);
  if (error) console.warn('[posts] getPostById', error.message);

  return tryLocalFallback(key);
}

function tryLocalFallback(key: string): Post | null {
  if (!ENABLE_LOCAL_FALLBACK) return null;
  const local = LOCAL_POSTS.find((p) => p.id === key || (p.slug && p.slug === key)) ?? null;
  if (local?.published) return local;
  return null;
}

/** All posts for admin dashboard (requires RLS + admin). */
export async function listAllPostsAdmin(): Promise<Post[]> {
  const sb = getSupabase();
  if (!sb) return ENABLE_LOCAL_FALLBACK ? [...LOCAL_POSTS] : [];
  const {data, error} = await sb.from('posts').select('*').order('updated_at', {ascending: false});
  if (error) {
    console.warn('[posts] listAllPostsAdmin', error.message);
    return ENABLE_LOCAL_FALLBACK ? [...LOCAL_POSTS] : [];
  }
  return (data ?? []).map(rowToPost);
}

export async function createPostAdmin(insert: DbPostInsert): Promise<{ok: true; id: string} | {ok: false; error: string}> {
  const sb = getSupabase();
  if (!sb) return {ok: false, error: 'Supabase no configurado'};
  const {data, error} = await sb.from('posts').insert(insert).select('id').single();
  if (error) return {ok: false, error: error.message};
  if (!data?.id) return {ok: false, error: 'Sin id devuelto'};
  return {ok: true, id: data.id};
}

export async function updatePostAdmin(id: string, patch: Partial<DbPostInsert>): Promise<{ok: true} | {ok: false; error: string}> {
  const sb = getSupabase();
  if (!sb) return {ok: false, error: 'Supabase no configurado'};
  const {error} = await sb.from('posts').update({...patch, updated_at: new Date().toISOString()}).eq('id', id);
  if (error) return {ok: false, error: error.message};
  return {ok: true};
}

export async function deletePostAdmin(id: string): Promise<{ok: true} | {ok: false; error: string}> {
  const sb = getSupabase();
  if (!sb) return {ok: false, error: 'Supabase no configurado'};
  const {error} = await sb.from('posts').delete().eq('id', id);
  if (error) return {ok: false, error: error.message};
  return {ok: true};
}

export function getLocalFallbackPosts(): Post[] {
  return ENABLE_LOCAL_FALLBACK ? [...LOCAL_POSTS] : [];
}

