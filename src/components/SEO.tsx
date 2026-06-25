import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_DESCRIPTION, OG_IMAGE_DEFAULT } from '@/lib/config';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({ title, description, image, url }: SEOProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const ogImage = image ?? OG_IMAGE_DEFAULT;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/favicon.svg" />
      <meta name="description" content={description ?? SITE_DESCRIPTION} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description ?? SITE_DESCRIPTION} />
      <meta property="og:image" content={ogImage} />
      {url ? <meta property="og:url" content={url} /> : null}
    </Helmet>
  );
}
