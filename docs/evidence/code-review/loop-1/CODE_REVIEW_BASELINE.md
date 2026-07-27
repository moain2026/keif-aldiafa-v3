# مراجعة الكود — خط الأساس (Loop 1)

> المراجع: مراجع الكود · التاريخ: 2026-07-27 · الفرع: feat/homepage-rebuild (من 67e4024)
> كل رقم أدناه ناتج أمر منفَّذ، مخرجاته محفوظة في نفس المجلد.

## 1) أخطاء TypeScript
- الأمر: `npx tsc --noEmit` → **صفر أخطاء** (exit 0). الدليل: `tsc.txt`.

## 2) Lint
- الأمر: `npm run lint` → نجاح مع **4 تحذيرات** (الدليل: `lint.txt`):
  1. `src/app/layout.tsx:158` — سكربت GA inline بدل `next/script` (`@next/next/next-script-for-ga`)
  2. `src/components/DallahLogo.tsx:14` — `<img>` بدل `<Image />` (يؤثر على LCP)
  3. `src/components/ImageWithFallback.tsx:88` — صورة بلا `alt` (يمنع A11y=100)
  4. `src/components/ImageWithFallback.tsx:92` — صورة بلا `alt` (يمنع A11y=100)
- ملاحظة للمادة 8: التحذيرات 3+4 ستُسقط هدف Accessibility=100 غالباً — إصلاحها ضمن الدورة التنفيذية الأولى.

## 3) الاعتماديات — الثغرات الأمنية
- الأمر: `npm audit` → **25 ثغرة (8 high · 17 moderate · 0 critical)**. الأدلة: `npm-audit.txt` / `npm-audit.json`.
- الأهم فعلياً (حِزم مباشرة تصل للإنتاج):
  - **next 14.2.35**: ~21 استشارة (SSRF في rewrites، DoS في Image Optimizer/Server Components، cache poisoning...). أغلبها يخص ميزات غير مستعملة هنا (Server Actions/WebSockets/i18n routing)، لكن Image Optimizer وrewrites مستعملة. الإصلاح الكامل يتطلب Next 15/16 — **يتعارض مع قيد المادة 10 (Next.js 14)**. ⇒ قرار موصى به: البقاء على آخر 14.2.x وتوثيق المخاطر المتبقية في FINAL_REPORT (يحسمه مدير المنتج في DR).
  - **postcss 8.5.8** (high، أداة بناء فقط — لا تصل للمتصفح): تحديث ضمن 8.x آمن.
  - eslint-config-next / lighthouse / glob / js-yaml / picomatch / brace-expansion: **أدوات تطوير فقط** — لا تصل للإنتاج؛ خطرها الفعلي على الزائر صفر.
- التقييم: **لا ثغرة critical ولا خطر مباشر على زوار الموقع**؛ حزمة الإنتاج الفعلية (react, react-dom, motion, clsx, embla, tailwind-merge) نظيفة.

## 4) الاعتماديات — التقادم
- الأمر: `npm outdated` (الدليل: `npm-outdated.txt`).
- ضمن قيد Next 14: التحديثات الآمنة داخل النطاق الحالي (wanted): motion، postcss، autoprefixer، tailwind-merge، @types/*. eslint 8 EOL — يبقى لأنه مربوط بـ eslint-config-next@14.

## 5) بنية الكود
- `src/app/` — App Router: 47 صفحة تتولد SSG (منها 24+ صفحة serviceCity و8 صفحات locations/[city]) — **قيد المادة 10 (الحفاظ على صفحات المدن) قابل للتحقق آلياً بعدّ المسارات في كل build**.
- `src/components/` — ~25 مكوناً؛ فصل واضح server/client (صفحات page.tsx خادمية + *Client.tsx للتفاعل). 
- `src/lib/` — بيانات ومحتوى (cities, imageCatalog, schema, localContent) — طبقة محتوى مركزية جيدة تسهّل إعادة بناء الرئيسية دون كسر صفحات المدن.
- `src/middleware.ts` — توحيد www→non-www + خريطة روابط WordPress قديمة (301) — سليم ويجب ألا يُمس أثناء إعادة البناء (يحمي أرشفة جوجل).
- `next.config.js` — security headers قوية (CSP/HSTS/XFO) + X-Robots-Tag مشروط بالبيئة + كاش أصول سنة. CSP يسمح `unsafe-eval`/`unsafe-inline` (مطلوب لأدوات التتبع حالياً).
- **لا اختبارات آلية إطلاقاً ولا CI** — أكبر فجوة هندسية قبل التعديلات الواسعة؛ بوابة المراجعة (docs/REVIEW_GATE.md) تسدّها مؤقتاً بفحوص إلزامية لكل دورة.

## 6) مخاطر مسجّلة للفريق
| # | الخطر | الشدة | الإجراء |
|---|-------|-------|---------|
| R1 | GitHub PAT مكشوف في رسالة القناة (2304186) | 🔴 حرجة | إلغاء التوكن من GitHub فوراً — بلغّنا المالك مرتين |
| R2 | لا اختبارات ولا CI | 🟡 | بوابة REVIEW_GATE إلزامية كل دورة + توصية بإضافة فحص آلي للمسارات |
| R3 | ثغرات next 14.2.x المفتوحة (قيد المادة 10 يمنع الترقية لـ15+) | 🟡 | قرار DR: بقاء على 14.2.x الأخير + توثيق المتبقي |
| R4 | تحذيرات alt/GA تمنع A11y=100 وبناءً «بلا تحذيرات» (المادة 8) | 🟡 | إصلاح في أول دورة تنفيذية |
