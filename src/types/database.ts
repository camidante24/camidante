export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          slug: string | null;
          title: string;
          excerpt: string;
          body: string;
          category: string;
          cover_image: string;
          reading_minutes: number;
          published: boolean;
          published_at: string | null;
          tags: string[];
          featured: boolean;
          size: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug?: string | null;
          title: string;
          excerpt: string;
          body: string;
          category: string;
          cover_image: string;
          reading_minutes?: number;
          published?: boolean;
          published_at?: string | null;
          tags?: string[];
          featured?: boolean;
          size?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          is_admin: boolean;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      bookmarks: {
        Row: {
          user_id: string;
          post_id: string;
          created_at: string | null;
        };
        Insert: {
          user_id: string;
          post_id: string;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['bookmarks']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type DbPost = Database['public']['Tables']['posts']['Row'];
export type DbPostInsert = Database['public']['Tables']['posts']['Insert'];
export type DbProfile = Database['public']['Tables']['profiles']['Row'];
