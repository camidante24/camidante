import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/config';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({ title, description, image, url }: SEOProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description ?? SITE_DESCRIPTION} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description ?? SITE_DESCRIPTION} />
      {image ? <meta property="og:image" content={image} /> : null}
      {url ? <meta property="og:url" content={url} /> : null}
    </Helmet>
  );
}
