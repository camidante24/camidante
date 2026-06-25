export const SITE_NAME = 'CamiDante';
export const SITE_TAGLINE = 'A quiet space for creative thought.';
export const SITE_DESCRIPTION =
  'Explorando la intersección entre el arte, la palabra y la reflexión pausada. Un diario digital diseñado para la artesanía del pensamiento lento.';

export const ENABLE_LOCAL_FALLBACK =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOCAL_FALLBACK === 'true';

export const CATEGORIES = ['Escritos', 'Pensamientos', 'Arte', 'Archivo'] as const;

export const SOCIAL_LINKS = {
  instagram: '#',
  twitter: '#',
  github: '#',
  mail: '#',
} as const;

export const AUTHOR = {
  name: 'CamiDante',
  bio: 'Escritora y curadora de espacios en blanco. Explorando la intersección entre el arte, la filosofía y la vida cotidiana lenta.',
  avatar: null as string | null,
};
