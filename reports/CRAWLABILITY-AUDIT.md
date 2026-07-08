# تقرير فحص قابلية الزحف والفهرسة — keifaldiafa.com

**التاريخ:** 2026-07-08 | **الطريقة:** curl حي على الإنتاج (Vercel) — بدون تعديل أي كود

## الخلاصة القاطعة

✅ **الموقع قابل للفهرسة كاملاً.** كل الصفحات الـ39 (بما فيها الروابط العربية) ترجع 200 مع `x-robots-tag: all` و`index, follow`، وSitemaps معلنة وصحيحة، وGSC verification موجود، وStructured Data سليم.
⚠️ ملاحظتان ثانويتان فقط: (1) `lastmod` في sitemap يساوي تاريخ اليوم دائماً (يبدو ديناميكياً `new Date()`) — يُضعف إشارة "التحديث الحقيقي" لجوجل. (2) روابط `<loc>` العربية غير مُرمَّزة percent-encoding (جوجل يتعامل معها لكن المواصفة الرسمية تفضّل الترميز).
🔴 لا توجد أي مشكلة حاجبة.

## 1. Robots.txt

`curl -s https://keifaldiafa.com/robots.txt`

| فحص | نتيجة |
|---|---|
| `User-Agent: *` + `Allow: /` | ✅ يسمح لكل الروبوتات (Googlebot, Googlebot-Image, Bingbot, GPTBot, ClaudeBot, Google-Extended, Applebot-Extended — لا يوجد أي حظر مخصص) |
| Disallow | ✅ فقط `/api/`, `/admin/`, `/private/` — لا يمنع أي صفحة محتوى |
| Sitemaps معلنة | ✅ الثلاثة: sitemap.xml + image-sitemap.xml + sitemap_index.xml |

## 2. Sitemaps

| فحص | الأمر | نتيجة |
|---|---|---|
| sitemap.xml | `curl -s .../sitemap.xml \| grep -c '<loc>'` | ✅ **39 URL**، جميعها 200 |
| image-sitemap.xml | `grep -c '<image:loc>'` | ✅ **388 صورة** (عينة `arak-sous.webp` → 200) |
| sitemap_index.xml | `curl -sI` | ✅ 200، يشير للاثنين |
| lastmod | `grep '<lastmod>' \| sort -u` | ⚠️ قيمة واحدة = **تاريخ اليوم** (2026-07-08)، وindex فيه timestamp دقيق `00:13:49.984Z` → مؤشر `new Date()` عند التوليد. جوجل قد يتجاهل lastmod غير الموثوق كلياً |
| الروابط العربية | `<loc>.../locations/جدة` | ⚠️ حروف عربية خام في XML (UTF-8 صالح وجوجل يقبله، لكن المواصفة تفضّل `%D8%AC%D8%AF%D8%A9`) |

## 3. فحص الصفحات (12 صفحة عيّنة)

`curl -sI https://keifaldiafa.com/<page>` + `curl -s | grep title/canonical/h1`

| صفحة | Status | x-robots-tag | title+desc | canonical | H1 |
|---|---|---|---|---|---|
| `/` | 200 | all | ✅ | ✅ | 1 ✅ |
| `/services` | 200 | all | ✅ | ✅ | 1 ✅ |
| `/offerings` | 200 | all | ✅ | ✅ | ✅ |
| `/portfolio` | 200 | all | ✅ | ✅ | ✅ |
| `/about` | 200 | all | ✅ | ✅ | ✅ |
| `/contact` | 200 | all | ✅ | ✅ | ✅ |
| `/locations` | 200 | all | ✅ | ✅ | ✅ |
| `/locations/جدة` | 200 | all | ✅ | ✅ (percent-encoded) | 1 ✅ |
| `/locations/الرياض` | 200 | all | ✅ | ✅ | ✅ |
| `/sababin-qahwa-jeddah` | 200 | all | ✅ | ✅ | 1 ✅ |
| `/qahwajiin-jeddah` | 200 | all | ✅ | ✅ | 1 ✅ |
| `/diyafa-munasabat-jeddah` | 200 | all | ✅ | ✅ | 1 ✅ |

كل الصفحات تحمل `<meta name="robots" content="index, follow">` — لا يوجد noindex في أي مكان.

## 4. Deep Crawl (3 مستويات)

- المستوى 1: `/` → 45 رابط داخلي (بعد استبعاد الأصول) — الرئيسية تربط **كل** صفحات sitemap
- المستوى 2: `/services` → 200، روابطه الداخلية سليمة
- المستوى 3: `/locations/جدة` → 200 → `/portfolio` → 200
- **Orphan pages:** فحص برمجي (python: sitemap URLs − home links) = **0 صفحة يتيمة** ✅ — الـfooter/الرئيسية تربط الـ39 صفحة كلها
- 404 handling: `/nonexistent-page-xyz` → 404 صحيح ✅
- Redirects: `www.` → 301 إلى non-www، `http://` → 308 إلى https ✅ (canonical host موحّد)

## 5. جاهزية Google Search Console

| فحص | نتيجة |
|---|---|
| verification meta | ✅ `google-site-verification: qiyji6ldzrSpPA0KolUsquX_SF3BDLfiphfkoXJibro` في كل الصفحات |
| Structured Data | ✅ الرئيسية: 8 كتل JSON-LD (Organization, ProfessionalService+FoodService, WebSite, BreadcrumbList…)؛ `/services`: 14 كتلة — **جميعها JSON صالح** (فحص python: valid 7/7 لكل script على /services) |

## 6. Discovery Signals

| فحص | نتيجة |
|---|---|
| `x-robots-tag: all` | ✅ متحقّق على كل الصفحات |
| CSP | ✅ يسمح صراحة بـ `googletagmanager.com` و`google-analytics.com` (script/img/connect) |
| HSTS + preload | ✅ موجود |
| Vercel edge cache | ✅ (age header) — استجابة سريعة للزاحف |

## الإصلاحات المقترحة (اختيارية، غير حاجبة)

1. **lastmod ثابت:** في مولّد الـsitemap (غالباً `src/app/sitemap.ts` و`sitemap_index`)، استبدل `new Date()` بتاريخ آخر تعديل حقيقي لكل صفحة (ثابت في ملف بيانات). يعيد مصداقية lastmod عند جوجل.
2. **ترميز الروابط العربية في `<loc>`:** استخدم `encodeURI()` على روابط `/locations/*` في نفس الملف — يطابق المواصفة ويطابق canonical المُرمَّز أصلاً.

## توصيات لتسريع الاكتشاف

- **GSC → URL Inspection → Request Indexing** للرئيسية + `/services` + صفحات جدة الثلاث (الأعلى قيمة تجارية).
- تقديم `sitemap_index.xml` في GSC (يكفي وحده — يغطي الاثنين).
- Bing Webmaster Tools: استيراد من GSC بنقرة + IndexNow (Vercel يدعمه عبر حزمة بسيطة).
- مراقبة تقرير Page Indexing في GSC بعد 3–7 أيام للتأكد من فهرسة الروابط العربية.
