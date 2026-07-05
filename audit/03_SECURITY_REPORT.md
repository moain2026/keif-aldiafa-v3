# 🔒 تقرير المراجعة الأمنية — كيف الضيافة (keif-v2)

> **التاريخ:** 2026-07-06 | **النطاق:** https://keifaldiafa.com — Next.js 14.2.35 (App Router, SSG) على Vercel
> **المنهجية:** فحص الكود الفعلي + Response headers الفعلية (AUDIT_DATA.md) + `npm audit`
> **ملاحظة:** هذا تقرير تحليلي فقط — لم يُعدَّل أي كود.

---

## 📊 الملخص التنفيذي

| # | البند | الشدة | الحالة |
|---|------|-------|--------|
| 1 | `'unsafe-eval'` في CSP script-src | **عالية** | 🔴 يجب الإزالة |
| 2 | `'unsafe-inline'` في CSP script-src | **متوسطة** | 🟡 قيد معماري (SSG) — يمكن تخفيفه |
| 3 | ثغرات `next` (7 استشارات، منها DoS عالية) | **عالية** | 🔴 تتطلب ترقية لـ Next 15+ |
| 4 | ثغرات dev-dependencies (glob, js-yaml) | **منخفضة** | 🟢 لا تصل للإنتاج |
| 5 | `<Link target="_blank">` بدون `rel` في الصفحة الرئيسية | **منخفضة** | 🟡 حالة واحدة |
| 6 | `window.open(..., "_blank")` بدون noopener في نموذج التواصل | **منخفضة** | 🟡 سطر واحد |
| 7 | COOP/CORP غير موجودة | **منخفضة** | 🟡 إضافة سهلة |
| 8 | `X-XSS-Protection: 1; mode=block` (deprecated وضارّ) | **منخفضة** | 🟡 إزالة/تصفير |
| 9 | Referrer-Policy أضعف من الموصى به | **منخفضة** | 🟡 تشديد |
| 10 | نموذج التواصل | — | ✅ آمن بالتصميم (لا backend) |
| 11 | تسريب معلومات (sourcemaps/poweredBy/أسرار) | — | ✅ نظيف |
| 12 | HSTS | — | ✅ صحيح (ينقص فقط تسجيل preload) |

**الخلاصة:** الوضع العام **جيد** لموقع تعريفي static. لا توجد ثغرة حرجة قابلة للاستغلال المباشر (لا يوجد backend ولا مصادقة ولا بيانات مستخدمين مخزّنة). أهم عملين: **إزالة `unsafe-eval` من CSP** و**التخطيط لترقية Next.js 15**.

---

## 1️⃣ Security Headers و CSP

### 1.a — `'unsafe-eval'` في script-src

- **المخاطرة:** يسمح بتنفيذ `eval()` / `new Function()` — يُلغي طبقة دفاع أساسية ضد XSS ويرفع خطورة أي حقن سكربت مستقبلي (مثلاً عبر تبعية مخترقة أو سكربت طرف ثالث). فحص الكود لم يُظهر أي استخدام فعلي لـ eval؛ Next.js يحتاجه **في التطوير فقط** (dev HMR)، وليس في الإنتاج.
- **الشدة:** 🔴 **عالية** (تشديد فوري ممكن بدون كسر شيء)
- **الحل** في `next.config.js` — اجعله شرطياً:

```js
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' ${isDev ? "'unsafe-eval' " : ""}'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com`,
  // ... باقي التوجيهات
].join("; ");
```

اختبر بعد النشر: الموقع static ولا يستخدم eval — لن ينكسر شيء.

### 1.b — `'unsafe-inline'` في script-src (nonce أم hash؟)

- **المخاطرة:** يسمح بتنفيذ أي `<script>` inline محقون → XSS. لكن Next.js يحقن سكربتات inline (bootstrap/RSC payload) ويحتاجها.
- **الشدة:** 🟡 **متوسطة** — لأن سطح الحقن هنا ضيق أصلاً (لا يوجد إدخال مستخدم يُعرض في الصفحات؛ كل المحتوى ثابت).
- **قيد معماري مهم — لا تستخدم nonce هنا:** الـ nonce يتطلب **rendering ديناميكي لكل طلب** (توليد nonce جديد عبر middleware + `headers()`). موقعكم **كله SSG** — تفعيل nonce سيحوّل كل الصفحات إلى dynamic ويقتل ميزة الـ static/cache (وهي أهم نقطة قوة أداء لديكم). إضافةً لذلك، يوجد GHSA-ffhc-5mcf-pf4q: **XSS في App Router عند استخدام CSP nonces** بإصدارات Next < 15.5.16 — أي أن nonce على إصداركم الحالي يزيد الخطر بدل تقليله.
- **الخيارات بالترتيب العملي:**
  1. **(موصى به الآن)** أبقِ `'unsafe-inline'` في script-src وأزل `'unsafe-eval'` فقط، وعوّض بتوجيهات مقيِّدة إضافية (انظر 1.e). هذا التوازن الصحيح لموقع SSG.
  2. **(بعد ترقية Next 15.5.16+)** إن أردت التشديد الأقصى لاحقاً: nonce عبر middleware مع `'strict-dynamic'` — مع قبول خسارة SSG، أو
  3. **Hash-based CSP:** ممكن نظرياً (`'sha256-...'` لكل سكربت inline) لكن hashes سكربتات Next تتغير مع كل build — صيانة مؤلمة وغير عملية بدون أتمتة. لا أنصح به.

### 1.c — تنظيف CSP من مصادر غير مستخدمة

فحص الكود أظهر:
- **لا يوجد أي استخدام فعلي لـ Google Analytics/GTM** في الكود (`grep gtag/googletagmanager` في src = صفر) — لكن CSP يسمح به.
- **الخطوط عبر `next/font/google`** (Tajawal, Cairo) — تُخدم **ذاتياً من نفس الدومين** في Next، أي `fonts.googleapis.com` و `fonts.gstatic.com` **غير مطلوبين** في CSP.
- `connect-src https://wa.me` غير ضروري — روابط wa.me تنقّل (navigation) وليست fetch/XHR.
- `img-src` يسمح بـ unsplash/placeholder/githubusercontent — إن كانت كل الصور محلية (388 WebP محلية) فهذه المصادر توسيع غير ضروري لسطح الهجوم.

- **الشدة:** 🟡 متوسطة (مبدأ least privilege)
- **الحل — CSP مقترح كامل:**

```js
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",          // مطلوب لـ style attributes الكثيرة في الكود
  "img-src 'self' data: blob:",                 // أضف مصادر خارجية فقط إن استُخدمت فعلاً
  "font-src 'self' data:",                      // next/font يخدم الخطوط ذاتياً
  "connect-src 'self'",                          // أضف google-analytics فقط عند تفعيل GA فعلياً
  "media-src 'self'",                            // فيديو hero-bg.mp4 المحلي
  "object-src 'none'",                           // جديد — يمنع plugins/Flash-style embeds
  "frame-src 'none'",                            // جديد — لا iframes خارجية بالموقع
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",                   // جديد
].join("; ");
```

> ⚠️ قبل حذف مصادر img-src الخارجية تأكد أن `OptimizedImage.tsx` (يذكر unsplash) لا يحمّل صوراً خارجية في الإنتاج. إن كان يحمّل، أبقِ المصدر المستخدم فقط.

### 1.d — COOP / COEP / CORP الناقصة

- **المخاطرة:** بدون `Cross-Origin-Opener-Policy` يمكن لنوافذ خارجية الاحتفاظ بمرجع `window.opener` لصفحتكم (هجمات XS-Leaks / tab-nabbing عكسي). التأثير على موقع تعريفي **منخفض** لكن الإضافة مجانية.
- **الشدة:** 🟡 **منخفضة**
- **الحل** — أضف إلى `securityHeaders`:

```js
{ key: "Cross-Origin-Opener-Policy", value: "same-origin" },
{ key: "Cross-Origin-Resource-Policy", value: "same-origin" },
// لا تضف COEP (require-corp) — لا حاجة له (لا SharedArrayBuffer)
// وقد يكسر تحميل موارد خارجية مستقبلاً. اتركه.
```

> ملاحظة: `COOP: same-origin` قد يقطع `window.opener` لروابط wa.me التي تفتحونها أنتم — هذا **مرغوب** أمنياً ولا يؤثر على فتح واتساب نفسه.

### 1.e — Headers قديمة/ضعيفة

| Header | الحالي | المشكلة | الشدة | الحل |
|--------|--------|---------|-------|------|
| `X-XSS-Protection` | `1; mode=block` | **deprecated** — المتصفحات الحديثة أزالت XSS Auditor، وفي المتصفحات القديمة كان `1` نفسه مصدر ثغرات (XS-Leaks). OWASP توصي بـ `0` أو الحذف | 🟡 منخفضة | `{ key: "X-XSS-Protection", value: "0" }` أو احذفه |
| `Referrer-Policy` | `origin-when-cross-origin` | يُسرّب الـ origin حتى عند التنزيل من HTTPS→HTTP | 🟡 منخفضة | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(self)` | الموقع لا يستخدم geolocation إطلاقاً — لماذا السماح؟ | 🟡 منخفضة | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` (و`interest-cohort` صار بلا معنى — FLoC أُلغي؛ لا ضرر من بقائه) |
| `X-Frame-Options` | `SAMEORIGIN` | سليم — لكنه مكرر مع `frame-ancestors 'self'` (الأحدث). أبقِ الاثنين للتوافق | ✅ | — |

---

## 2️⃣ ثغرات التبعيات (npm audit)

**النتيجة:** 7 ثغرات — **5 عالية، 2 متوسطة، 0 حرجة**. المثبّت: `next@14.2.35` (آخر إصدار 14.x — لا يوجد patch أحدث في خط 14).

### 2.a — حزمة `next` نفسها (تبعية إنتاج) 🔴

| الاستشارة | النوع | الشدة | مُصلحة في | تنطبق عليكم؟ |
|-----------|------|-------|-----------|---------------|
| GHSA-h25m-26qc-wcjf | DoS عبر deserialization (RSC) | عالية 7.5 | 15.0.8 | جزئياً — App Router موجود، لكن Vercel تخفف DoS على مستوى المنصة |
| GHSA-q4gf-8mx6-v5v3 | DoS في Server Components | عالية 7.5 | 15.5.15 | جزئياً (كل صفحاتكم SSG → سطح أقل) |
| GHSA-8h8q-6873-q5fj | DoS في Server Components | عالية 7.5 | 15.5.16 | جزئياً |
| GHSA-ffhc-5mcf-pf4q | XSS مع CSP nonces في App Router | متوسطة 4.7 | 15.5.16 | **لا حالياً** (لا تستخدمون nonce) — لكنه يمنع خيار nonce قبل الترقية |
| GHSA-gx5p-jg67-6x7h | XSS في beforeInteractive scripts | متوسطة 6.1 | 15.x | لا (لا تستخدمون beforeInteractive بمدخلات غير موثوقة) |
| GHSA-9g9p-9gw9-jx7f | DoS عبر Image Optimizer remotePatterns | متوسطة 5.9 | 15.5.10 | **نعم جزئياً** — لديكم remotePatterns لـ unsplash/placeholder/github. على Vercel تحسين الصور مُدار لكن التقييد حكيم |
| GHSA-ggv3-7p47-pfv8 | HTTP request smuggling في rewrites | متوسطة | 15.5.13 | منخفض (لا rewrites لديكم، فقط redirects/middleware) |
| GHSA-3g8h-86w9-wvmq + GHSA-vfv6-92ff-j949 | Cache poisoning (redirects/RSC) | منخفضة 3.7 | 15.5.16 | منخفض — لكن **لديكم middleware redirects** فانتبه |

**التقييم:** لا شيء منها قابل للاستغلال الحرج على وضعكم الحالي (static + Vercel)، لكن التراكم يعني أن **خط Next 14 انتهى أمنياً** — كل الإصلاحات تصدر في 15.x فقط.

**الحل (خطة الترقية):**
```bash
# الخطوة الموصى بها: Next 15 (ليس 16 مباشرة — قفزة أصغر وأأمن)
npm install next@15 eslint-config-next@15
npx @next/codemod@latest upgrade   # يُشغّل codemods الترحيل تلقائياً
npm run build && npm run start     # اختبر كل الصفحات + الـ redirects
```
أبرز تغييرات الترحيل 14→15 لموقعكم: `params`/`searchParams` صارت async في الصفحات (لديكم SSG بسيط — التأثير ضئيل)، وسلوك caching الافتراضي تغيّر (لصالحكم غالباً). **الشدة: 🔴 عالية (كأولوية صيانة، ليس كاستغلال فوري).**

**إجراء تخفيفي فوري (قبل الترقية):** احذف `remotePatterns` غير المستخدمة من `next.config.js` (unsplash/placeholder/githubusercontent إن كانت الصور كلها محلية) — يغلق GHSA-9g9p-9gw9-jx7f عملياً:
```js
images: {
  // remotePatterns: [],  ← احذف المصادر الخارجية إن لم تُستخدم
  localPatterns: [{ pathname: "/images/**" }],
  ...
}
```

### 2.b — تبعيات التطوير (لا تصل للإنتاج) 🟢

| الحزمة | الثغرة | الشدة | التقييم |
|--------|--------|-------|---------|
| `glob` 10.2–10.4 (عبر eslint-config-next) | GHSA-5j98-mcp5-4vw2 — حقن أوامر عبر `glob -c` CLI | عالية 7.5 | **غير قابلة للاستغلال** — تتطلب تشغيل glob CLI بمدخلات مهاجم على جهاز المطور. devDependency فقط |
| `js-yaml` 4.0–4.1.1 | GHSA-h67p-54hq-rp68 — DoS تعقيد تربيعي في merge keys | متوسطة 5.3 | devDependency، لا YAML من مستخدمين |

**الحل:** `npm audit fix` يصلح js-yaml. حزمة glob تُحل تلقائياً مع ترقية `eslint-config-next@15`. **الشدة: 🟢 منخفضة.**

---

## 3️⃣ نموذج التواصل (ContactClient.tsx)

**كيف يعمل:** client-side بالكامل — يجمع الحقول ويبني نص رسالة ثم `window.open("https://wa.me/...?text=" + encodeURIComponent(msg))`. **لا يوجد أي backend، لا API route، لا تخزين، لا إرسال بريد.**

**التقييم الأمني: ✅ آمن بالتصميم** — وهذه نقطة قوة وليست ضعفاً:
- ❌ Rate limit غير مطلوب — لا يوجد endpoint يُستنزف. "المرسل" هو واتساب المستخدم نفسه من جهازه.
- ❌ Honeypot/CAPTCHA غير مطلوب — البوت الذي يعبّئ النموذج يفتح واتساب على جهازه هو؛ لا ضرر عليكم.
- ✅ الحقن في رابط wa.me مُعالج صح عبر `encodeURIComponent` — لا URL injection.
- ✅ لا يُعرض إدخال المستخدم في DOM بعد الإرسال (React يهرّب تلقائياً على أي حال) — لا XSS.

**ملاحظات تحسينية (منخفضة الشدة):**

1. **`window.open(..., "_blank")` بدون `noopener`** — الصفحة المفتوحة (wa.me — موثوقة، لكن كمبدأ) تحصل على `window.opener`:
```tsx
// السطر ~30 في handleSubmit — بدّل:
window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank");
// إلى:
window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
```

2. **Validation خفيف للجودة (ليس للأمان):** حقل الجوال `type="tel"` بلا نمط — أضف `pattern="05[0-9]{8}"` و `maxLength` للرسالة (روابط wa.me الطويلة جداً قد تُقص):
```tsx
<input type="tel" required pattern="05[0-9]{8}" maxLength={10} ... />
<textarea required maxLength={1000} ... />
```

3. **إن أُضيف مستقبلاً backend للنموذج** (بريد/قاعدة بيانات): حينها فقط ستحتاجون rate limiting (مثل `@upstash/ratelimit` على Vercel)، honeypot field، وvalidation خادمي بـ zod. حالياً غير مطلوب.

---

## 4️⃣ تسريب المعلومات

| الفحص | النتيجة | الحالة |
|-------|---------|--------|
| `poweredByHeader` | `false` في next.config | ✅ لا يُرسل `X-Powered-By` |
| Source maps في الإنتاج | `productionBrowserSourceMaps` غير مضبوط → الافتراضي **false** | ✅ |
| أسرار في الكود | فحص grep لـ api_key/secret/token/password في src = **صفر نتائج**. لا ملفات `.env` في المستودع | ✅ |
| متغيرات `NEXT_PUBLIC_*` | لا يوجد أي استخدام | ✅ |
| بيانات معروضة عمداً | الهاتف +966508252134، البريد keifaldiafa@gmail.com، حسابات السوشال — **علنية بالتصميم** (موقع أعمال) | ✅ مقبول |
| `X-Robots-Tag: noindex` خارج production | سلوك مقصود — لكن **تحقق أن Vercel production يضبط `VERCEL_ENV=production`** وإلا فالموقع الحي محجوب عن جوجل (مشكلة SEO لا أمن — مذكورة في AUDIT_DATA) | ⚠️ تحقّق |

**الشدة: 🟢 لا مشاكل.** الوضع نظيف.

---

## 5️⃣ الروابط الخارجية (`target="_blank"`)

فحصت **كل** استخدامات `target="_blank"` في src:

| الملف | الحالة |
|-------|--------|
| FloatingWhatsApp.tsx | ✅ `rel="noopener noreferrer"` |
| Footer.tsx (4 مواضع) | ✅ |
| Navbar.tsx (3 مواضع) | ✅ |
| ContactClient.tsx | ✅ |
| ServicesClient.tsx (2) | ✅ |
| OfferingsClient.tsx | ✅ |
| **HomePageClient.tsx سطر 188** | ❌ **`<Link href="https://wa.me/..." target="_blank">` بدون `rel`** |

- **المخاطرة:** tab-nabbing (الصفحة المفتوحة تتحكم بـ `window.opener.location`). عملياً المتصفحات الحديثة تطبّق `noopener` ضمنياً مع `target="_blank"`، وwa.me موثوق — لكن التصريح أفضل للمتصفحات الأقدم والاتساق.
- **الشدة:** 🟡 **منخفضة**
- **الحل** في `src/app/HomePageClient.tsx:188`:
```tsx
<Link href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="gold-button ...">
```
> ملاحظة جانبية: استخدام `next/link` لرابط خارجي لا يعطي أي فائدة (لا prefetch لدومينات خارجية) — الأفضل `<a>` عادي، لكنها ليست مشكلة أمنية.

---

## 6️⃣ أفضل ممارسات Vercel

| الممارسة | الحالة | التوصية |
|----------|--------|----------|
| **Vercel WAF** (لوحة التحكم → Firewall) | غير معروف | فعّلوا الحماية المُدارة المجانية (OWASP core rules + bot protection). تخفف معظم ثغرات DoS المذكورة في §2 |
| **Deployment Protection** | غير معروف | فعّلوا "Vercel Authentication" على deployments الـ preview — يمنع فهرسة/تسريب نسخ ما قبل الإنتاج (يكمّل X-Robots-Tag) |
| **Environment Variables** | لا أسرار حالياً | عند إضافة أي مفتاح مستقبلاً: خزّنه في Vercel env vars (Sensitive) — أبداً في الكود |
| **HTTPS/TLS** | مُدار من Vercel تلقائياً | ✅ لا إجراء |
| **DDoS mitigation** | مضمّن في المنصة | ✅ يخفف CVEs الـ DoS في §2 لكن لا يلغي الحاجة للترقية |
| **`vercel.json` headers** | تستخدمون next.config headers | ✅ الطريقتان مكافئتان — استمروا على next.config |
| **Log drains / مراقبة** | غير مفعّل غالباً | اختياري لموقع تعريفي؛ راقبوا Vercel Analytics للشذوذ |
| **تقييد Image Optimization** | remotePatterns واسعة | احذفوا المصادر الخارجية غير المستخدمة (§2.a) — يقلل فاتورة التحسين ويغلق GHSA-9g9p |

---

## 7️⃣ HSTS / Preload

**الحالي:** `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

- ✅ `max-age=63072000` (سنتان) — يفوق الحد الأدنى لـ preload (سنة)
- ✅ `includeSubDomains` — موجود ومطلوب للـ preload
- ✅ `preload` — التوكن موجود
- ⚠️ **التوكن وحده لا يكفي** — القبول في قائمة Chrome يتطلب **تسجيلاً يدوياً**:
  1. تحقق أن `https://keifaldiafa.com` يقدّم الهيدر من الدومين الجذر (وليس فقط www) — middleware لديكم يحوّل www→non-www بـ 301 وهذا متوافق مع الشروط ✅
  2. سجّل في https://hstspreload.org وتأكد من اجتياز الفحص
- ⚠️ **تنبيه قبل التسجيل:** preload شبه دائم (الإزالة تأخذ شهوراً). تأكد أن **كل** النطاقات الفرعية الحالية والمستقبلية (مثلاً لوحة تحكم، بريد webmail على subdomain) ستدعم HTTPS للأبد. إن لم تكن متأكداً، أزل توكن `preload` وأبقِ الباقي — الحماية الفعلية شبه مطابقة.

**الشدة: 🟢 سليم** — قرار preload تجاري أكثر منه تقني.

---

## ✅ خطة العمل المرتّبة بالأولوية

| # | الإجراء | الشدة | الجهد |
|---|---------|-------|-------|
| 1 | إزالة `'unsafe-eval'` من CSP في الإنتاج (§1.a) | عالية | 5 دقائق |
| 2 | حذف remotePatterns غير المستخدمة من images (§2.a) | متوسطة | 5 دقائق |
| 3 | تنظيف CSP: حذف fonts.googleapis/gstatic وGA غير المستخدم، إضافة `object-src 'none'` + `frame-src 'none'` + `upgrade-insecure-requests` (§1.c) | متوسطة | 15 دقيقة |
| 4 | `rel="noopener noreferrer"` في HomePageClient:188 + `noopener` في window.open بنموذج التواصل (§3، §5) | منخفضة | 5 دقائق |
| 5 | COOP+CORP، `X-XSS-Protection: 0`، `Referrer-Policy: strict-origin-when-cross-origin`، تصفير geolocation (§1.d، §1.e) | منخفضة | 10 دقائق |
| 6 | `npm audit fix` (js-yaml) | منخفضة | دقيقة |
| 7 | **ترقية Next.js 15 + eslint-config-next 15** (§2.a) — تغلق كل CVEs المفتوحة | عالية (صيانة) | نصف يوم اختبار |
| 8 | تفعيل Vercel WAF + Deployment Protection (§6) | متوسطة | 10 دقائق (لوحة التحكم) |
| 9 | تسجيل hstspreload.org (اختياري بعد التأكد) (§7) | منخفضة | 10 دقائق |

**لا نوصي** بـ: nonce-based CSP قبل ترقية 15.5.16+ (يكسر SSG + ثغرة معروفة)، COEP (غير مطلوب)، CAPTCHA/rate-limit للنموذج (لا backend).
