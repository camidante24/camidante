import type {Post} from '@/types/post';
import {CATEGORIES} from '@/lib/config';

export interface PostFormState {
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover_image: string;
  reading_minutes: number;
  published: boolean;
  tags: string;
  slug: string;
  featured: boolean;
  size: Post['size'];
}

interface PostFormProps {
  editingId: string | null;
  form: PostFormState;
  onChange: (patch: Partial<PostFormState>) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  errors: Record<string, string>;
}

export function PostForm({editingId, form, onChange, onSave, onCancel, errors}: PostFormProps) {
  return (
    <form onSubmit={onSave} className="bg-white rounded-xl border border-outline/10 shadow-soft p-6 space-y-4">
      <h3 className="text-xl font-bold font-serif mb-2">{editingId ? 'Editar entrada' : 'Nueva entrada'}</h3>

      <input
        className="w-full border border-outline/20 rounded-lg px-3 py-2 text-sm"
        placeholder="Título"
        required
        value={form.title}
        onChange={(e) => onChange({title: e.target.value})}
      />

      <input
        className="w-full border border-outline/20 rounded-lg px-3 py-2 text-sm"
        placeholder="Extracto"
        required
        value={form.excerpt}
        onChange={(e) => onChange({excerpt: e.target.value})}
      />

      <textarea
        className="w-full min-h-[160px] border border-outline/20 rounded-lg px-3 py-2 text-sm font-mono"
        placeholder="Cuerpo (Markdown)"
        required
        value={form.body}
        onChange={(e) => onChange({body: e.target.value})}
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          className="border border-outline/20 rounded-lg px-3 py-2 text-sm"
          value={form.category}
          onChange={(e) => onChange({category: e.target.value})}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          className="border border-outline/20 rounded-lg px-3 py-2 text-sm"
          value={form.reading_minutes}
          onChange={(e) => onChange({reading_minutes: Number(e.target.value) || 1})}
        />
      </div>

      <div>
        <input
          className="w-full border border-outline/20 rounded-lg px-3 py-2 text-sm"
          placeholder="URL imagen portada"
          required
          value={form.cover_image}
          onChange={(e) => onChange({cover_image: e.target.value})}
        />
        {errors.cover_image ? <p className="text-xs text-red-600 mt-1">{errors.cover_image}</p> : null}
      </div>

      <input
        className="w-full border border-outline/20 rounded-lg px-3 py-2 text-sm"
        placeholder="Etiquetas (coma)"
        value={form.tags}
        onChange={(e) => onChange({tags: e.target.value})}
      />

      <div>
        <input
          className="w-full border border-outline/20 rounded-lg px-3 py-2 text-sm"
          placeholder="Slug opcional"
          value={form.slug}
          onChange={(e) => onChange({slug: e.target.value})}
        />
        {errors.slug ? <p className="text-xs text-red-600 mt-1">{errors.slug}</p> : null}
      </div>

      <div className="flex flex-wrap gap-4 items-center text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => onChange({published: e.target.checked})} />
          Publicada
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => onChange({featured: e.target.checked})} />
          Destacada
        </label>
        <select
          className="border border-outline/20 rounded-lg px-2 py-1 text-sm"
          value={form.size ?? 'medium'}
          onChange={(e) => onChange({size: e.target.value as Post['size']})}
        >
          <option value="large">large</option>
          <option value="medium">medium</option>
          <option value="small">small</option>
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" className="btn-primary text-sm py-2">
          Guardar
        </button>
        <button type="button" className="text-sm font-semibold text-on-surface-variant px-4" onClick={onCancel}>
          Limpiar
        </button>
      </div>
    </form>
  );
}
