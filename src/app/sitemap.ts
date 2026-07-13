import { MetadataRoute } from "next";
import { execSync } from "node:child_process";
import { CITIES } from "@/lib/cities";
import { LOCAL_PAGES, localSlug } from "@/lib/localPages";

const SITE_URL = "https://keifaldiafa.com";

// تاريخ احتياطي إن تعذّر قراءة git (مثلاً بيئة بناء بلا سجل git)
const FALLBACK_DATE = "2026-07-13";

/**
 * آخر تعديل حقيقي لملف مصدر عبر git (تاريخ آخر commit مسّه).
 * يُنفَّذ وقت البناء على الخادم فقط → لا يتغيّر عند كل زحف (صادق مع Google).
 * مرجع: Google تتجاهل lastmod إن ثبت أنه مزيّف — فنربطه بتعديل حقيقي.
 */
function gitLastModified(filePath: string): string {
  try {
    const out = execSync(`git log -1 --format=%cs -- "${filePath}"`, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out || FALLBACK_DATE;
  } catch {
    return FALLBACK_DATE;
  }
}

// خريطة تاريخ لكل مجموعة صفحات مبنية على آخر تعديل فعلي لملفها المصدر
const DATES = {
  home: gitLastModified("src/app/HomePageClient.tsx"),
  services: gitLastModified("src/app/services/page.tsx"),
  offerings: gitLastModified("src/app/offerings/page.tsx"),
  portfolio: gitLastModified("src/app/portfolio/PortfolioClient.tsx"),
  about: gitLastModified("src/app/about/AboutClient.tsx"),
  contact: gitLastModified("src/app/contact/ContactClient.tsx"),
  locations: gitLastModified("src/app/locations/page.tsx"),
  cityPage: gitLastModified("src/app/locations/[city]/page.tsx"),
  serviceCity: gitLastModified("src/lib/localContent.tsx"),
  legal: gitLastModified("src/app/legal/page.tsx"),
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
    // (encodeURI يحفظ المحارف المحجوزة مثل / و : ويرمّز فقط الحروف غير ASCII)
    url: encodeURI(`${SITE_URL}${route.path}`),
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
