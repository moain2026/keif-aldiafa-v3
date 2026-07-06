/**
 * Sitemap index — references the page sitemap and the image sitemap so Google
 * discovers both from a single entry point. Submit this URL in Search Console.
 *
 * Spec: https://www.sitemaps.org/protocol.html#index
 */

import { SITE_URL } from "@/lib/imageCatalog";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET(): Response {
  const now = new Date().toISOString();
  const sitemaps = [
    `${SITE_URL}/sitemap.xml`,
    `${SITE_URL}/image-sitemap.xml`,
  ];

  const body = sitemaps
    .map(
      (loc) =>
        `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
