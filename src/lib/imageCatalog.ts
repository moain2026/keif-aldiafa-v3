/**
 * imageCatalog.ts — Centralized image catalog for SEO / archiving / indexing.
 *
 * Source of truth: the actual files under public/images/** (scanned on the
 * server at build/request time). This guarantees EVERY image is discoverable
 * for the image sitemap and structured data, regardless of how it is wired in
 * component code.
 *
 * Grounded in Google's OFFICIAL current guidance (Google Search Central):
 *   - Image SEO best practices:
 *     https://developers.google.com/search/docs/appearance/google-images
 *   - Image sitemaps (note: image:title / image:caption were DEPRECATED in
 *     2022 — only image:loc is used in the sitemap; descriptive text lives in
 *     alt text + structured data instead):
 *     https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 *
 * Alt/caption text is intentionally NATURAL and human-readable (Arabic), NOT a
 * raw keyword dump, to avoid Google's keyword-stuffing penalty.
 */

import fs from "node:fs";
import path from "node:path";

export const SITE_URL = "https://keifaldiafa.com";

export interface CatalogImage {
  /** Site-root-relative path, e.g. /images/events/foo.webp */
  src: string;
  /** Absolute URL used in the image sitemap + structured data */
  url: string;
  /** Human-readable Arabic alt/caption (natural phrase, no keyword stuffing) */
  alt: string;
  /** Short title */
  title: string;
  /** Top-level category folder (events, weddings, dates, ...) */
  category: string;
  /** The landing page this image is most relevant to */
  pageUrl: string;
}

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const INDEXABLE_EXT = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif"]);
// SVGs (logos/watermarks/icons) are decorative — excluded from image search indexing.

/**
 * Map a top-level image category folder to the most relevant landing page.
 * This tells Google which page "hosts" each image (the <loc> in the sitemap).
 */
function categoryToPage(category: string): string {
  switch (category) {
    case "hero":
    case "partners":
    case "badges":
      return "/";
    case "hot-drinks":
    case "cold-drinks":
    case "dates":
    case "sweets":
    case "pastry":
    case "snacks":
    case "sandwiches":
    case "fruits":
    case "nuts":
    case "serving-equipment":
    case "equipment":
      return "/offerings";
    case "events":
    case "weddings":
    case "distributions":
      return "/portfolio";
    case "services":
      return "/services";
    default:
      return "/services";
  }
}

/** Arabic labels for the primary categories (used to enrich natural alt text). */
const CATEGORY_AR: Record<string, string> = {
  hero: "كيف الضيافة",
  events: "فعالية",
  weddings: "حفل زفاف",
  distributions: "توزيعات ضيافة",
  dates: "تمور فاخرة",
  sweets: "حلويات",
  pastry: "معجنات",
  snacks: "مقبلات",
  sandwiches: "ساندويتشات",
  fruits: "فواكه",
  nuts: "مكسرات",
  "hot-drinks": "مشروبات ساخنة",
  "cold-drinks": "مشروبات باردة",
  "serving-equipment": "أدوات تقديم",
  equipment: "معدات ضيافة",
  partners: "شركاء النجاح",
  services: "خدمات الضيافة",
};

/**
 * Convert a kebab-case filename into a short, NATURAL readable phrase.
 * We keep it concise (Google penalizes keyword-stuffed alt text): take the
 * meaningful words, drop trailing numeric indices, and prepend a brand/category
 * hint so the phrase reads like a caption rather than a keyword list.
 */
export function filenameToText(filePath: string, category: string): string {
  const base = filePath.split("/").pop() || filePath;
  const stem = base.replace(/\.[a-z0-9]+$/i, "");

  const words = stem
    .split(/[-_]+/)
    .filter(Boolean)
    // drop pure numeric indices like "1", "2" that carry no meaning
    .filter((w) => !/^\d+$/.test(w));

  // Keep it human-length: cap at ~7 words to avoid stuffing.
  const trimmed = words.slice(0, 7).join(" ");
  const readable = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

  const arLabel = CATEGORY_AR[category] || "كيف الضيافة";
  // Natural bilingual caption: Arabic context + descriptive English keywords
  // (Google reads both; the English words come from the descriptive filenames).
  if (!readable.trim()) return `${arLabel} — كيف الضيافة`;
  return `${arLabel} — ${readable}`;
}

let _cache: CatalogImage[] | null = null;

function walk(dir: string, out: string[]): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (INDEXABLE_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
}

/** Return every indexable image on the site, with SEO metadata. */
export function getAllImages(): CatalogImage[] {
  if (_cache) return _cache;

  const files: string[] = [];
  walk(IMAGES_DIR, files);

  const images: CatalogImage[] = files
    .map((abs) => {
      const rel = "/" + path.relative(path.join(process.cwd(), "public"), abs).split(path.sep).join("/");
      // rel looks like /images/<category>/.../file.webp
      const parts = rel.split("/").filter(Boolean); // ["images", category, ...]
      const category = parts[1] || "misc";
      const alt = filenameToText(rel, category);
      return {
        src: rel,
        url: `${SITE_URL}${rel}`,
        alt,
        title: alt,
        category,
        pageUrl: categoryToPage(category),
      };
    })
    .sort((a, b) => a.src.localeCompare(b.src));

  _cache = images;
  return images;
}

/**
 * Group all images by the landing page they belong to (for the sitemap).
 * Returns an array of [pageUrl, images] tuples (avoids Map iteration target issues).
 */
export function getImagesByPage(): Array<[string, CatalogImage[]]> {
  const map: Record<string, CatalogImage[]> = {};
  for (const img of getAllImages()) {
    (map[img.pageUrl] ||= []).push(img);
  }
  return Object.keys(map).map((pageUrl) => [pageUrl, map[pageUrl]]);
}

/** Images relevant to a specific landing page (for per-page structured data). */
export function getImagesForPage(pageUrl: string): CatalogImage[] {
  return getAllImages().filter((i) => i.pageUrl === pageUrl);
}
