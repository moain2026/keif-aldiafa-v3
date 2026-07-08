import { MetadataRoute } from "next";
import { CITIES } from "@/lib/cities";
import { LOCAL_PAGES, localSlug } from "@/lib/localPages";

const SITE_URL = "https://keifaldiafa.com";

// تاريخ ثابت لآخر تعديل فعلي (يُحدّث يدوياً عند إطلاق محتوى جديد، لا عند كل زحف)
// مرجع: Google، إذا ثبت أن lastmod مزيف تتجاهله وتخسر مصداقية إعادة الزحف.
const SITE_LAST_MODIFIED = "2026-07-08";

export default function sitemap(): MetadataRoute.Sitemap {
  const cityRoutes = CITIES.map((c) => ({
    path: `/locations/${c.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  // صفحات الخدمة × المدينة (تطابق البحث: صبابين قهوة جدة...)
  const serviceCityRoutes = LOCAL_PAGES.map((p) => ({
    path: `/${localSlug(p.service, p.city)}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/offerings", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/portfolio", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/locations", priority: 0.8, changeFrequency: "monthly" as const },
    ...cityRoutes,
    ...serviceCityRoutes,
  ];

  return routes.map((route) => ({
    // ترميز percent-encoding للأحرف العربية في <loc> لمطابقة مواصفة sitemaps.org
    // (encodeURI يحفظ المحارف المحجوزة مثل / و : ويرمّز فقط الحروف غير ASCII)
    url: encodeURI(`${SITE_URL}${route.path}`),
    lastModified: SITE_LAST_MODIFIED,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
