import { getSupabase } from '@/lib/supabase';
import { rowToPost } from '@/lib/posts';
import type { Post } from '@/types/post';

export type BookmarkToggleResult =
  | { ok: true; saved: boolean }
  | { ok: false; saved: boolean; error: string };

export async function isBookmarked(postId: string, userId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data } = await sb
    .from('bookmarks')
    .select('post_id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .maybeSingle();
  return Boolean(data);
}

export async function toggleBookmark(postId: string, _userId: string): Promise<BookmarkToggleResult> {
  const sb = getSupabase();
  if (!sb) return { ok: false, saved: false, error: 'Supabase no está configurado.' };

  const { data, error } = await (sb.rpc as any)('toggle_bookmark', { p_post_id: postId });
  if (error) return { ok: false, saved: false, error: error.message };
  return { ok: true, saved: data as boolean };
}

export async function listBookmarkedPosts(userId: string): Promise<Post[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from('bookmarks')
    .select('post_id, created_at, posts(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data?.length) {
    if (error) console.warn('[bookmarks] list', error.message);
    return [];
  }

  return (data as any[])
    .map((r) => (r.posts ? rowToPost(r.posts) : null))
    .filter(Boolean) as Post[];
}
