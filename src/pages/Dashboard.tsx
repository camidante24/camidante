import {Edit3, Eye, Heart} from 'lucide-react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {createPostAdmin, deletePostAdmin, listAllPostsAdmin, postToInsert, updatePostAdmin} from '@/lib/posts';
import type {Post} from '@/types/post';
import {getSupabase} from '@/lib/supabase';
import {Sidebar} from '@/components/Sidebar';
import {StatCard} from '@/components/StatCard';
import {PostForm, type PostFormState} from '@/components/PostForm';
import {PostList} from '@/components/PostList';
import {SEO} from '@/components/SEO';

const emptyForm: PostFormState = {
  title: '',
  excerpt: '',
  body: '',
  category: 'Escritos',
  cover_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200',
  reading_minutes: 5,
  published: false,
  tags: '',
  slug: '',
  featured: false,
  size: 'medium' as Post['size'],
};

function validateURL(value: string): string | null {
  if (!value.trim()) return 'La imagen de portada es obligatoria';
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'La URL debe usar http o https';
    return null;
  } catch {
    return 'URL inválida';
  }
}

function validateSlug(value: string): string | null {
  if (!value) return null;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return 'Slug: solo letras, números y guiones';
  }
  return null;
}

export default function Dashboard() {
  const {signOut, profile} = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PostFormState>(emptyForm);
  const [notice, setNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await listAllPostsAdmin();
    setPosts(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const published = useMemo(() => posts.filter((p) => p.published), [posts]);
  const drafts = useMemo(() => posts.filter((p) => !p.published), [posts]);

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setNotice(null);
    setErrors({});
  }

  function startEdit(p: Post) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      excerpt: p.excerpt,
      body: p.body,
      category: p.category,
      cover_image: p.cover_image,
      reading_minutes: p.reading_minutes,
      published: p.published,
      tags: p.tags.join(', '),
      slug: p.slug ?? '',
      featured: p.featured,
      size: p.size ?? 'medium',
    });
    setNotice(null);
    setErrors({});
  }

  function onFormChange(patch: Partial<PostFormState>) {
    setForm((f) => ({...f, ...patch}));
    setErrors({});
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    const urlErr = validateURL(form.cover_image);
    if (urlErr) e.cover_image = urlErr;
    const slugErr = validateSlug(form.slug);
    if (slugErr) e.slug = slugErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setNotice(null);
    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const insert = postToInsert({
      title: form.title,
      excerpt: form.excerpt,
      body: form.body,
      category: form.category,
      cover_image: form.cover_image.trim(),
      reading_minutes: form.reading_minutes,
      published: form.published,
      published_at: form.published
        ? (editingId
            ? (posts.find((p) => p.id === editingId)?.published_at ?? new Date().toISOString())
            : new Date().toISOString())
        : null,
      tags,
      slug: form.slug.trim() || null,
      featured: form.featured,
      size: form.size,
    });

    if (editingId) {
      const r = await updatePostAdmin(editingId, insert);
      if (r.ok === false) setNotice(r.error);
      else setNotice('Entrada actualizada.');
    } else {
      const r = await createPostAdmin(insert);
      if (r.ok === false) setNotice(r.error);
      else {
        setNotice('Entrada creada.');
        setEditingId(r.id);
      }
    }
    await refresh();
  }

  async function onDelete(id: string) {
    if (!confirm('¿Eliminar esta entrada?')) return;
    const r = await deletePostAdmin(id);
    if (r.ok === false) setNotice(r.error);
    else {
      setNotice('Eliminada.');
      if (editingId === id) startNew();
    }
    await refresh();
  }

  const stats = useMemo(
    () => [
      {label: 'Publicadas', value: String(published.length), trend: `${drafts.length} borradores`, icon: <Edit3 size={24} />},
      {label: 'Vistas (est.)', value: String(published.length * 58 + drafts.length * 12), trend: 'aprox.', icon: <Eye size={24} />},
      {label: 'Engagement (est.)', value: '—', trend: 'Próximamente', icon: <Heart size={24} />},
    ],
    [published.length, drafts.length],
  );

  return (
    <div className="flex min-h-screen bg-background">
      <SEO title="Dashboard" />
      <Sidebar onNewPost={startNew} signOut={signOut} />

      <main className="flex-1 lg:ml-64 p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Dashboard</h1>
            <p className="text-on-surface-variant text-lg font-light">
              Hola{profile?.full_name ? `, ${profile.full_name}` : ''}. {getSupabase() ? 'Datos en Supabase.' : 'Sin Supabase: modo local de demostración.'}
            </p>
          </header>

          {notice ? <p className="mb-6 text-sm text-primary font-semibold">{notice}</p> : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend} icon={stat.icon} loading={loading} />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            <div className="xl:col-span-5 space-y-8">
              <PostForm editingId={editingId} form={form} onChange={onFormChange} onSave={onSave} onCancel={startNew} errors={errors} />
            </div>

            <PostList posts={posts} drafts={drafts} onEdit={startEdit} onDelete={onDelete} />
          </div>
        </div>
      </main>
    </div>
  );
}
