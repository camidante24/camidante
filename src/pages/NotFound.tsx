import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';

export default function NotFound() {
  return (
    <div className="container-custom py-24 text-center">
      <SEO title="Página no encontrada" />
      <h1 className="text-6xl font-bold font-serif mb-4">404</h1>
      <p className="text-xl text-on-surface-variant mb-8">Página no encontrada</p>
      <Link to="/" className="btn-primary inline-block">Volver al inicio</Link>
    </div>
  );
}
