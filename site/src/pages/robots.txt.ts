import type { APIRoute } from 'astro';

// robots.txt generado con la URL pública actual (SITE_URL en src/config.ts)
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site).href}
`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
