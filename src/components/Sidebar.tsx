import {Link, useNavigate} from 'react-router-dom';
import {LayoutDashboard, Plus, User, LogOut} from 'lucide-react';
import {SITE_NAME} from '@/lib/config';

interface SidebarProps {
  onNewPost: () => void;
  signOut: () => Promise<void>;
}

export function Sidebar({onNewPost, signOut}: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 h-full border-r border-outline/10 bg-surface-container-low p-6 z-10">
      <div className="mb-10 pl-2">
        <Link to="/" className="font-serif text-2xl font-bold block">
          {SITE_NAME}
        </Link>
        <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant opacity-60">Admin</p>
      </div>

      <button type="button" onClick={onNewPost} className="btn-primary flex items-center justify-center gap-2 mb-8">
        <Plus size={20} /> Nueva entrada
      </button>

      <nav className="flex-1 flex flex-col gap-2">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all bg-secondary-container/20 text-secondary"
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all text-on-surface-variant hover:bg-outline/5"
        >
          <User size={20} /> Perfil
        </Link>
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-outline/10 pt-6">
        <button
          type="button"
          className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
          onClick={() => void signOut().then(() => navigate('/'))}
        >
          <LogOut size={18} /> Salir
        </button>
      </div>
    </aside>
  );
}
