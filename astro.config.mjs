import { defineConfig } from 'astro/config';

const siteUrl = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
if (process.env.VERCEL_ENV === 'production' && !siteUrl) {
  throw new Error('Set SITE_URL to the public HTTPS address before deploying to production.');
}
if (siteUrl && (new URL(siteUrl).protocol !== 'https:' || new URL(siteUrl).pathname !== '/')) {
  throw new Error('SITE_URL must be an HTTPS origin with no path.');
}

export default defineConfig({
  site: siteUrl,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
