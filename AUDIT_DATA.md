# بيانات القياس الفعلية — كيف الضيافة (keif-v2)
> جُمعت 2026-07-06 من نسخة إنتاج محلية (`npm run build && npm run start -p 3100`)

## معلومات المشروع
- **Framework:** Next.js 14.2 (App Router, TypeScript, Tailwind)
- **الموقع الحي:** https://keifaldiafa.com (Vercel)
- **النشاط:** خدمات ضيافة فاخرة (قهوجية/صبابين/صبابات) — تغطية كل السعودية
- **اللغة:** عربي RTL
- **الصفحات:** / (home), /services, /offerings, /portfolio, /about, /contact
- **كلها Static (SSG)** — ممتاز للسرعة/الأرشفة
- **الصور:** 388 صورة WebP مُحسّنة (24-56KB each), إجمالي 35MB
- **فيديو hero:** hero-bg.mp4 (0.3MB)

## نتائج Lighthouse (Desktop, production build محلي)
| الصفحة | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | SI |
|--------|------|------|-----|-----|-----|-----|-----|-----|-----|
| / | 69 | 100 | 96 | 69 | 5.6s | 0 | 360ms | 1.0s | 4.2s |
| /services | 50 | 95 | 100 | 69 | 5.1s | **1.405** | 180ms | 1.0s | 5.3s |
| /offerings | 82 | 95 | 100 | 69 | 4.4s | 0.008 | 130ms | 0.9s | 3.8s |

## المشاكل المكتشفة (بيانات حقيقية)
1. **LCP سيء جداً** (4.4-5.6s) — الهدف <2.5s. غالباً صورة/فيديو hero.
2. **CLS كارثي في /services = 1.405** — الهدف <0.1. الصفحة تقفز بشدة أثناء التحميل (على الأرجح صور بدون أبعاد أو خطوط).
3. **SEO score 69 متكرر** — السبب الجذري: `is-crawlable=0`. من next.config: `X-Robots-Tag: noindex` عندما `VERCEL_ENV !== 'production'`. **هذا محلي فقط**؛ يجب التأكد أن Vercel production يضبط VERCEL_ENV=production (وإلا الموقع الحي محجوب عن جوجل!).
4. TBT مقبول (130-360ms).
5. A11y ممتاز (95-100), Best Practices ممتاز (96-100).

## Response Headers (فعلية)
- HSTS ✅ (max-age 2y, includeSubDomains, preload)
- X-Frame-Options: SAMEORIGIN ✅
- X-Content-Type-Options: nosniff ✅
- CSP موجود ✅ لكن `script-src` فيه `'unsafe-eval' 'unsafe-inline'` ⚠️
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy موجود ✅
- Cache-Control: s-maxage=31536000, stale-while-revalidate ✅
- x-nextjs-cache: HIT ✅

## SEO موجود حالياً (قوي)
- Metadata كامل (title template, description, keywords ~20, OG, Twitter card, canonical, ar-SA)
- Google verification موجود
- 7 مولّدات schema: Organization, LocalBusiness (ProfessionalService+FoodService), WebSite, Breadcrumb, WebPage, Service, FAQ
- LocalBusiness = Service Area Business يغطي 9 مدن سعودية
- sitemap.ts + robots.ts موجودان
- middleware: www→non-www 301 + WordPress legacy redirects

## ملاحظات
- keywords: صبابين قهوة, صبابات زواجات, قهوجية, ضيافة VIP, الرياض/جدة, إلخ
- الهاتف: +966508252134, واتساب, انستقرام @keifaldiafa
- priceRange: $$$$ (فاخر)
