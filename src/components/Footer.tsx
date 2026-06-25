import {Instagram, Twitter, Mail, Github} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
import {SITE_NAME, SITE_DESCRIPTION, SOCIAL_LINKS} from '@/lib/config';

export const Footer = () => {
  const {profile} = useAuth();

  return (
    <footer className="bg-background border-t border-outline/10 py-16 mt-24">
      <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
          <span className="font-serif text-3xl font-bold text-on-background">{SITE_NAME}</span>
          <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
            © 2026 {SITE_NAME}. {SITE_DESCRIPTION}
          </p>
          <div className="flex gap-4 mt-2">
            <a href={SOCIAL_LINKS.instagram} className="p-2 bg-surface-container-low rounded-full hover:text-primary hover:bg-white transition-all shadow-sm border border-outline/5" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href={SOCIAL_LINKS.twitter} className="p-2 bg-surface-container-low rounded-full hover:text-primary hover:bg-white transition-all shadow-sm border border-outline/5" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href={SOCIAL_LINKS.github} className="p-2 bg-surface-container-low rounded-full hover:text-primary hover:bg-white transition-all shadow-sm border border-outline/5" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href={SOCIAL_LINKS.mail} className="p-2 bg-surface-container-low rounded-full hover:text-primary hover:bg-white transition-all shadow-sm border border-outline/5" aria-label="Correo">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold tracking-widest uppercase text-on-surface-variant items-center">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Contact
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Archive
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Subscribirse
          </a>
          {profile?.is_admin ? (
            <Link to="/dashboard" className="hover:text-primary transition-colors">
              Panel
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  );
};
