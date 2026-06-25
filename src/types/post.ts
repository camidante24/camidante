export type PostLayoutSize = 'large' | 'medium' | 'small';

export interface Post {
  id: string;
  slug: string | null;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  published_at: string | null;
  cover_image: string;
  reading_minutes: number;
  published: boolean;
  tags: string[];
  featured: boolean;
  size: PostLayoutSize | null;
}

export interface PostListFilters {
  category?: string;
  q?: string;
  page?: number;
}
