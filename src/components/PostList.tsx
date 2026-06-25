import {Edit2, Trash2} from 'lucide-react';
import {Link} from 'react-router-dom';
import {ArrowRight} from 'lucide-react';
import type {Post} from '@/types/post';
import {CategoryBadge} from '@/components/CategoryBadge';

interface PostListProps {
  posts: Post[];
  drafts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

export function PostList({posts, drafts, onEdit, onDelete}: PostListProps) {
  return (
    <div className="xl:col-span-7 space-y-8">
      <div className="flex justify-between items-end border-b border-outline/10 pb-4">
        <h3 className="text-3xl font-bold font-serif">Entradas</h3>
        <Link to="/" className="text-sm font-bold text-primary flex items-center gap-1">
          Ver sitio <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group p-6 bg-white/50 rounded-xl border border-outline/5 hover:border-outline/20 hover:bg-white transition-all flex justify-between items-start gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <CategoryBadge category={post.category} />
                <span className="text-[10px] font-medium text-tertiary">{post.published ? 'Publicada' : 'Borrador'}</span>
              </div>
              <h4 className="text-2xl font-semibold mb-1 truncate">{post.title}</h4>
              <p className="text-sm text-on-surface-variant font-light line-clamp-2">{post.excerpt}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="button" className="p-2 hover:text-primary transition-colors bg-background rounded-full" onClick={() => onEdit(post)} aria-label="Editar">
                <Edit2 size={16} />
              </button>
              <button type="button" className="p-2 hover:text-red-500 transition-colors bg-background rounded-full" onClick={() => void onDelete(post.id)} aria-label="Eliminar">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {drafts.length > 0 ? (
        <div className="bg-secondary-container/5 rounded-xl p-8 border border-outline/10 shadow-soft">
          <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2">
            <Edit2 size={20} className="text-tertiary" /> Borradores
          </h3>
          <ul className="space-y-3">
            {drafts.map((d) => (
              <li key={d.id}>
                <button type="button" className="text-left font-semibold text-primary hover:underline" onClick={() => onEdit(d)}>
                  {d.title || 'Sin título'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
