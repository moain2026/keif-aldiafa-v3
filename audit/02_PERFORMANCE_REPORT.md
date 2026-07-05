# 02 — تقرير الأداء و Core Web Vitals — كيف الضيافة (keif-v2)
> مبني على قياسات Lighthouse 12 فعلية (production build محلي) — 2026-07-06
> الأولويات: 🔴 P0 حرج | 🟠 P1 عالي | 🟡 P2 متوسط

## القياسات الفعلية
| الصفحة | Perf | LCP | CLS | TBT | FCP | SI |
|--------|------|-----|-----|-----|-----|-----|
| / | 69 | 5.6s | 0 | 360ms | 1.0s | 4.2s |
| /services | 50 | 5.1s | **1.405** | 180ms | 1.0s | 5.3s |
| /offerings | 82 | 4.4s | 0.008 | 130ms | 0.9s | 3.8s |

الأهداف (جوجل "جيد"): LCP < 2.5s · CLS < 0.1 · INP/TBT < 200ms.

---

## 1) 🔴 CLS كارثي في /services = 1.405 (14× الحد المقبول)
**السبب المرجّح (من فحص ServicesClient + بيانات lighthouse):**
- بطاقات الخدمات تحتوي صوراً بلا `width/height` أو `aspect-ratio` محجوز → المتصفح يرسم بلا مساحة ثم يقفز عند وصول الصورة.
- دخول عناصر motion (`initial/animate` مع y/opacity) يزيح المحتوى بعد الرسم الأولي.
- احتمال ازدواج نسختي بطاقة (موبايل/ديسكتوب) تظهر/تختفي بعد hydration.

**الحل (كود):**
```tsx
// كل صورة بطاقة: احجز النسبة قبل التحميل
<div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
  <Image fill sizes="(max-width:768px) 100vw, 33vw" src={...} alt={...} />
</div>
// الحاوية: min-height ثابت للشبكة قبل hydration
// motion: استخدم transform فقط (لا height/margin)، واحجز المساحة:
<motion.div style={{ willChange: "transform" }} initial={{ opacity:0, y:16 }} .../>
```
- استبدل أي `whileInView` يغيّر التخطيط بـ opacity/transform فقط.
- إن كانت هناك نسختان responsive: استخدم عنصراً واحداً بـ CSS بدل mount/unmount.
**الأثر المتوقع:** CLS 1.405 → < 0.05. **أولوية 🔴 P0.**

---

## 2) 🔴 LCP بطيء (4.4–5.6s) عبر كل الصفحات
**الأسباب:**
- صورة/فيديو الـ hero بلا `priority` / `fetchpriority="high"` / `preload`.
- فيديو `hero-bg.mp4` يُحمّل مبكراً وينافس LCP على النطاق.
- الخطوط (Tajawal + Cairo، 16 وزناً) قد تؤخر الرسم.

**الحل (كود):**
```tsx
// hero image: أولوية قصوى
<Image src={HERO_IMAGES.desktop} priority fetchPriority="high"
       sizes="100vw" alt="قهوجيين وصبابين قهوة — كيف الضيافة" fill />
// preload بوستر الـ hero في layout <head>:
<link rel="preload" as="image" href="/images/hero/hero-desktop.webp"
      media="(min-width:768px)" fetchpriority="high" />
// الفيديو: لا يحمّل قبل LCP
<video preload="none" poster="/images/hero/hero-desktop.webp" ... />
// شغّله بعد load: onLoadedData / IntersectionObserver
```
**الخطوط:** قلّل الأوزان المحمّلة (300/400/700/900 تكفي بدل 6-7 أوزان لكل خط). `next/font` أصلاً self-hosted مع `display:swap` ✅ — احذف الأوزان غير المستخدمة فقط.
**الأثر:** LCP → 2.0–2.5s. **أولوية 🔴 P0.**

---

## 3) 🟠 تقليل JS والـ SI العالي (4.2–5.3s)
- مكتبة `motion` (Framer) محمّلة في كل صفحة. اجعل الحركات leaf-components فقط، ودينامِك import للثقيل:
```tsx
const Motion = dynamic(() => import("@/components/MotionWrap"), { ssr: true });
```
- `embla-carousel` (portfolio/offerings): dynamic import مع تحميل عند الحاجة.
- راجع `next.config` — احذف `remotePatterns` غير المستخدمة (unsplash/placeholder) وقلّل السطح.
- فعّل `optimizePackageImports` لـ motion في next.config.
**الأثر:** TBT/SI أفضل، First Load JS أخف. **أولوية 🟠 P1.**

---

## 4) 🟡 تحسينات إضافية
- **الصور:** كلها WebP ✅ (24-56KB). أضف AVIF (formats موجود ✅). تأكد `sizes` صحيح لكل صورة responsive لتفادي تحميل أكبر من اللازم.
- **blur placeholder:** أضف `placeholder="blur"` للصور الكبيرة (hero, portfolio) لتحسين الإحساس بالسرعة وتقليل CLS الإدراكي.
- **caching:** ممتاز أصلاً (immutable على static، s-maxage). لا تغيير.
- **lighthouse-ci:** ثبّت من مهارة nextjs-seo-mastery (testing/lighthouse-ci.md) بعتبات: perf≥90, seo≥95, a11y=100 لمنع الانحدار مستقبلاً.

## خلاصة التنفيذ
| # | الإجراء | أولوية | أثر |
|---|---------|--------|-----|
| 1 | إصلاح CLS /services (aspect-ratio + transform-only motion) | 🔴 | 1.405→<0.05 |
| 2 | LCP: priority+preload للـ hero، preload=none للفيديو | 🔴 | 5.6→~2.3s |
| 3 | تقليل أوزان الخطوط | 🔴 | LCP/FCP |
| 4 | dynamic import لـ motion/embla | 🟠 | TBT/JS |
| 5 | blur placeholders | 🟡 | UX/CLS |
| 6 | lighthouse-ci عتبات | 🟡 | منع الانحدار |
