import {Link, useNavigate} from 'react-router-dom';
import {Search, User, Menu, X, LogOut, LayoutDashboard} from 'lucide-react';
import {useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {CATEGORIES, SITE_NAME} from '@/lib/config';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const {user, profile, signOut} = useAuth();

  const navLinks = [{name: 'Inicio', href: '/'}, ...CATEGORIES.map((c) => ({name: c, href: `/?category=${encodeURIComponent(c)}`}))];

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQuery('');
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline/10">
      <nav className="container-custom py-4 flex justify-between items-center gap-4">
        <Link to="/" className="flex items-center shrink-0">
          <img src="/logo.svg" alt={SITE_NAME} className="h-9 md:h-10 w-auto" />
        </Link>

        <ul className="hidden md:flex items-center gap-8 flex-wrap justify-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.href}
                className="text-sm font-semibold tracking-wide uppercase text-on-surface-variant hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className={`hidden sm:flex items-center gap-2 overflow-hidden transition-all duration-300 ${searchOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'}`}>
            {searchOpen ? (
              <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar…"
                  className="w-40 lg:w-56 border border-outline/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary bg-white"
                />
                <button type="submit" className="btn-primary py-2 px-4 text-sm">
                  Ir
                </button>
                <button type="button" className="p-2 text-on-surface-variant hover:text-primary" onClick={() => setSearchOpen(false)}>
                  <X size={20} />
                </button>
              </form>
            ) : null}
          </div>

          {!searchOpen ? (
            <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors hidden sm:block" onClick={() => setSearchOpen(true)} aria-label="Buscar">
              <Search size={20} />
            </button>
          ) : null}

          {user ? (
            <>
              {profile?.is_admin ? (
                <Link to="/dashboard" className="hidden md:flex p-2 text-on-surface-variant hover:text-primary transition-colors" title="Panel">
                  <LayoutDashboard size={20} />
                </Link>
              ) : null}
              <Link to="/profile" className="p-2 text-on-surface-variant hover:text-primary transition-colors hidden md:block" title="Perfil">
                <User size={20} />
              </Link>
              <button type="button" className="hidden md:flex p-2 text-on-surface-variant hover:text-primary transition-colors" onClick={() => void signOut()} title="Salir">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="hidden md:inline-flex text-sm font-semibold text-primary px-3 py-2">
              Entrar
            </Link>
          )}

          <button className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-outline/10 p-5 flex flex-col gap-4 shadow-xl z-40">
          <form onSubmit={onSearchSubmit} className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en el sitio…"
              className="flex-1 border border-outline/20 rounded-lg px-3 py-2 text-sm"
            />
            <button type="submit" className="btn-primary px-4 py-2 text-sm shrink-0">
              Buscar
            </button>
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-lg font-serif italic text-on-background py-2 border-b border-outline/5"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-primary font-semibold" onClick={() => setIsMenuOpen(false)}>
                <User size={20} /> Mi perfil
              </Link>
              {profile?.is_admin ? (
                <Link to="/dashboard" className="flex items-center gap-2 text-primary font-semibold" onClick={() => setIsMenuOpen(false)}>
                  <LayoutDashboard size={20} /> Panel
                </Link>
              ) : null}
              <button type="button" className="text-left text-on-surface-variant font-semibold" onClick={() => void signOut().then(() => setIsMenuOpen(false))}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="text-primary font-semibold" onClick={() => setIsMenuOpen(false)}>
              Entrar
            </Link>
          )}
        </div>
      ) : null}
    </header>
  );
};
