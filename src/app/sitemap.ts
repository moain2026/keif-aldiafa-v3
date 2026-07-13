import { MetadataRoute } from "next";
import { CITIES } from "@/lib/cities";
import { LOCAL_PAGES, localSlug } from "@/lib/localPages";

const SITE_URL = "https://keifaldiafa.com";

// خريطة تواريخ lastmod ثابتة — تعكس آخر تعديل حقيقي لكل قسم (من سجل git).
// ثابتة ومتنوّعة: لا تتغيّر عند كل زحف = صادقة مع Google. تُحدّث يدوياً عند تعديل قسم.
// ملاحظة: Vercel يستنسخ git بعمق 1 (shallow)، فلا يُعوّل على git log per-file وقت البناء.
const DATES = {
  home: "2026-07-08", // آخر تعديل: الفوتر + روابط المدن + gtag head
  services: "2026-07-06",
  offerings: "2026-07-06",
  portfolio: "2026-07-06",
  about: "2026-07-06",
  contact: "2026-07-06",
  locations: "2026-07-06",
  cityPage: "2026-07-06",
  serviceCity: "2026-07-06",
  legal: "2026-07-08", // صفحة قانونية أُنشئت 2026-07-08
};

export default function sitemap(): MetadataRoute.Sitemap {
  const cityRoutes = CITIES.map((c) => ({
    path: `/locations/${c.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: DATES.cityPage,
  }));

  // صفحات الخدمة × المدينة (تطابق البحث: صبابين قهوة جدة...)
  const serviceCityRoutes = LOCAL_PAGES.map((p) => ({
    path: `/${localSlug(p.service, p.city)}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
    lastModified: DATES.serviceCity,
  }));

  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const, lastModified: DATES.home },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" as const, lastModified: DATES.services },
    { path: "/offerings", priority: 0.9, changeFrequency: "weekly" as const, lastModified: DATES.offerings },
    { path: "/portfolio", priority: 0.8, changeFrequency: "monthly" as const, lastModified: DATES.portfolio },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const, lastModified: DATES.about },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const, lastModified: DATES.contact },
    { path: "/locations", priority: 0.8, changeFrequency: "monthly" as const, lastModified: DATES.locations },
    { path: "/legal", priority: 0.3, changeFrequency: "yearly" as const, lastModified: DATES.legal },
    ...cityRoutes,
    ...serviceCityRoutes,
  ];

  return routes.map((route) => ({
    // ترميز percent-encoding للأحرف العربية في <loc> لمطابقة مواصفة sitemaps.org
    url: encodeURI(`${SITE_URL}${route.path}`),
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
