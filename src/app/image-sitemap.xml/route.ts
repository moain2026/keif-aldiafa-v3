/**
 * Image sitemap — Route Handler emitting a valid Google image sitemap.
 *
 * Follows Google's CURRENT spec (developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps):
 *   - Namespace: xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
 *   - Per <url>: one <loc> (the landing page) + up to 1,000 <image:image>,
 *     each with ONLY <image:loc> (absolute image URL).
 *   - image:title / image:caption were DEPRECATED by Google in 2022 and are
 *     intentionally NOT emitted here. Descriptive text lives in the page's alt
 *     text and JSON-LD structured data instead.
 */

import { getImagesByPage, SITE_URL } from "@/lib/imageCatalog";
import type { CatalogImage } from "@/lib/imageCatalog";

export const dynamic = "force-static";
export const revalidate = 86400; // regenerate at most once/day

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET(): Response {
  const byPage = getImagesByPage();

  const urlBlocks: string[] = [];
  for (const [pageUrl, images] of byPage) {
    // Google allows up to 1,000 image:image per url; we're well under.
    const imageTags = images
      .map(
        (img: CatalogImage) =>
          `    <image:image>\n      <image:loc>${escapeXml(img.url)}</image:loc>\n    </image:image>`
      )
      .join("\n");

    urlBlocks.push(
      `  <url>\n    <loc>${escapeXml(SITE_URL + pageUrl)}</loc>\n${imageTags}\n  </url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urlBlocks.join(
    "\n"
  )}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
