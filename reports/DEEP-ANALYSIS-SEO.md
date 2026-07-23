# تقرير التحليل التقني العميق — SEO / Schema / Metadata / الفهرسة
**المشروع:** كيف الضيافة (keifaldiafa.com) — Next.js App Router، عربي RTL، منشور على Vercel
**نطاق التقرير:** SEO التقني + البيانات المهيكلة + Metadata + الفهرسة (قراءة فقط — لم يُعدَّل أي ملف)
**تاريخ التحليل:** 2026-07-23

---

## ملخص تنفيذي

البنية التقنية للسيو في المشروع **متقدمة جداً** مقارنة بمواقع الخدمات المحلية السعودية: SSG كامل لصفحات (خدمة×مدينة)، JSON-LD مركزي، sitemap + image-sitemap + sitemap index، middleware لتوحيد الدومين وتنظيف روابط WordPress القديمة. **لا توجد كوارث فهرسة.**

المشكلة الحقيقية ليست تقنية بل **تسويقية داخل الـ SERP**: العناوين والأوصاف الحالية لصفحات المال (qahwajiin / sababin-qahwa / diyafa-munasabat) **وصفية ومحشوة بالمرادفات وبلا أي خطّاف نقر (hook)** — وهذا يفسّر مباشرة:
- `qahwajiin-*`: **742 ظهور × CTR 0.4%** ≈ 3 نقرات فقط.
- «صبابين قهوة»: **ترتيب 3.8 × CTR 1.1%** — ترتيب ممتاز يهدر؛ CTR الطبيعي للمركز 4 هو **4–7%**، أي أن الموقع يخسر **~75% من نقراته المستحقة**.

المشكلة الثانية بالخطورة: **24 صفحة خدمة×مدينة تتشارك 3 قوالب نصية فقط** — التمايز بين المدن يقتصر على اسم المدينة + جملة واحدة + قائمة أحياء، وهو نمط "doorway pages" الذي تستهدفه Google صراحة.

| الأولوية | العدد | أهمها |
|---|---|---|
| 🔴 حرج | 3 | عناوين/أوصاف ضعيفة CTR، خطر doorway/duplicate، تنافس داخلي (cannibalization) |
| 🟡 متوسط | 7 | عنوان legal مكرر، ازدواج BreadcrumbList، تفكك كيانات Schema، lastmod، تغطية image-sitemap |
| 🟢 بسيط | 6 | keywords ضخمة، founder وهمي، x-default، أبعاد صور ثابتة، وغيرها |

---

# 🔴 القسم 1: المشاكل الحرجة

## 1.1 [حرج — الأهم] عناوين وأوصاف صفحات المال تقتل الـ CTR

**الملف:** `src/lib/localContent.tsx` — الأسطر **70–80** (metaTitle / metaDescription)
**الملف المرتبط:** `src/app/[serviceCity]/page.tsx` — الأسطر 28–50 (generateMetadata)

### الوضع الحالي (السطر 70–80):

```tsx
const metaTitle = isMunasabat
  ? `ضيافة مناسبات ${c.ar} | تجهيز أعراس ومؤتمرات وفعاليات`
  : isQahwajiin
  ? `قهوجيين ومباشرين ${c.ar} | قهوجي وطاقم رجالي بزيّ رسمي`
  : `صبابين قهوة ${c.ar} | صبابين سعوديين وصبابات بزيّ تراثي`;

const metaDescription = isMunasabat
  ? `خدمة ضيافة مناسبات في ${c.ar}: تجهيز أعراس ومؤتمرات وفعاليات بطاقم فاخر ومعدات كاملة. عرض سعر مجاني — واتساب ${WA_DISPLAY}.`
  : isQahwajiin
  ? `قهوجيين ومباشرين وقهوجي في ${c.ar} بزيّ رسمي لخدمة كبار الضيوف في الفعاليات والمؤتمرات وبروتوكول VIP. عرض سعر مجاني — واتساب ${WA_DISPLAY}.`
  : `صبابين قهوة سعوديين في ${c.ar} — صبّابون وصبابات بزيّ تراثي لتقديم القهوة العربية في الأعراس والمناسبات. عرض سعر مجاني عبر واتساب ${WA_DISPLAY}.`;
```

### تشخيص الضعف (لماذا CTR = 0.4%؟)

1. **الطول بعد قالب البراند:** القالب في `src/app/layout.tsx:32` (`template: "%s | كيف الضيافة"`) يضيف «| كيف الضيافة» تلقائياً، فيصبح العنوان النهائي:
   `قهوجيين ومباشرين الرياض | قهوجي وطاقم رجالي بزيّ رسمي | كيف الضيافة` — **67 حرفاً و3 مقاطع pipe**. الحرف العربي أعرض بكسلياً من اللاتيني، وGoogle يقصّ عند ~600px (≈ 50–55 حرفاً عربياً). **النتيجة: يُبتر العنوان في منتصف المقطع الثاني ويختفي البراند والـ USP معاً.**
2. **حشو مرادفات ظاهر للمستخدم:** «قهوجيين ومباشرين… | قهوجي وطاقم…» و«قهوجيين ومباشرين **وقهوجي** في…» بالوصف — تكرار الكلمة 3 مرات يقرؤه الباحث كسبام ويقرؤه Google كإشارة حشو. المرادفات مكانها المحتوى (وهي موجودة فيه فعلاً)، لا الـ title/description.
3. **صفر خطّافات نقر:** لا يوجد أي من محفزات الـ CTR المثبتة في السوق السعودي المحلي:
   - **إثبات اجتماعي رقمي** (+500 مناسبة — موجود في صفحة portfolio ولا يُستغل هنا!)
   - **فورية** (حجز اليوم / متوفرون الآن / رد خلال دقائق)
   - **سنة/حداثة** أو **إشارة سعرية** (أسعار منافسة / عرض سعر خلال 5 دقائق)
   - **رموز موثوقية** (✓ في الوصف — تظهر في SERP وترفع CTR بشكل مقاس)
4. **الوصف يبدأ بتكرار العنوان حرفياً** — أول 60 حرفاً من الوصف (الجزء الوحيد المضمون ظهوره على الجوال) مهدورة في إعادة الكلمة المفتاحية بدل عرض القيمة.
5. **نية البحث:** من يبحث «قهوجيين الرياض» يريد: سعر + سرعة حجز + شكل الطاقم. العنوان الحالي يجيب على «مَن أنتم» لا على «لماذا أنقر عليكم».

### ✅ الإصلاح المقترح (كود جاهز — `src/lib/localContent.tsx` بدل الأسطر 70–80):

```tsx
// عناوين مضبوطة ≤ 50 حرفاً قبل البراند (تنجو من البتر) + خطّاف نقر واحد قوي.
// ملاحظة: القالب يضيف «| كيف الضيافة» تلقائياً — لا نكرره.
const metaTitle = isMunasabat
  ? `ضيافة مناسبات ${c.ar} — أعراس ومؤتمرات VIP بطاقم فاخر`
  : isQahwajiin
  ? `قهوجيين ${c.ar} — حجز سريع وطاقم بزيّ رسمي VIP`
  : `صبابين قهوة ${c.ar} — طاقم سعودي وحجز بنفس اليوم`;

// الوصف: قيمة أولاً (60 حرفاً الأولى هي الأهم) + إثبات اجتماعي + CTA + رموز ✓
const metaDescription = isMunasabat
  ? `✓ +500 مناسبة ناجحة ✓ تجهيز كامل بمعدات فاخرة ✓ تغطية كل أحياء ${c.ar}. ضيافة أعراس ومؤتمرات وفعاليات ببروتوكول VIP. اطلب عرض سعرك المجاني الآن — واتساب ${WA_DISPLAY}`
  : isQahwajiin
  ? `✓ حجز خلال دقائق ✓ زيّ رسمي موحّد ✓ خبرة +500 مناسبة في ${c.ar}. قهوجيين ومباشرين لخدمة كبار الضيوف بالمؤتمرات والمجالس. عرض سعر فوري مجاني — واتساب ${WA_DISPLAY}`
  : `✓ طاقم سعودي بزيّ تراثي ✓ قهوة ودلال وتمر ضمن الباقة ✓ صبابات للمناسبات النسائية. نغطي كل أحياء ${c.ar} — اطلب عرض سعرك المجاني الآن: ${WA_DISPLAY}`;
```

**مبررات الصياغة:**
- عنوان صبابين: «حجز بنفس اليوم» يستهدف نية البحث العاجلة (أغلب حجوزات القهوجية طارئة قبل المناسبة بأيام).
- «طاقم سعودي» تمييز تنافسي حقيقي (منافسون كثر يستخدمون عمالة غير سعودية — راجع STRATEGY-NUMBER-ONE.md).
- علامات ✓ تظهر فعلياً في SERP جوجل وترفع الـ CTR المقاس 10–20% في القطاعات الخدمية.
- رقم الواتساب في نهاية الوصف = نقرة «شبه تحويل» حتى بلا زيارة.

**اختبار إلزامي بعد التطبيق:** راقب في GSC (فلترة Page يحتوي `qahwajiin`) لمدة 21 يوماً — الهدف رفع CTR من 0.4% إلى ≥2% كمرحلة أولى.

### أيضاً — صفحات /locations/[city]

**الملف:** `src/app/locations/[city]/page.tsx` — السطر **34–39**:

```tsx
title: `خدمات الضيافة في ${city.name} | قهوجيين وصبابين قهوة`,
description: city.intro,
```

`city.intro` (من `src/lib/cities.ts`) نص تعريفي وليس وصف SERP — لا CTA ولا رقم ولا خطّاف. اقتراح:

```tsx
title: `ضيافة فاخرة في ${city.name} — قهوجيين وصبابين وتجهيز مناسبات`,
description: `✓ +500 مناسبة ✓ طاقم سعودي محترف ✓ تغطية كل أحياء ${city.name}. قهوجيين، صبابين قهوة، صبابات، وتجهيز ضيافة متكامل. عرض سعر مجاني — واتساب 0508252134`,
```

---

## 1.2 [حرج] خطر Doorway / Duplicate Content: 24 صفحة من 3 قوالب

**الملفات:** `src/lib/localContent.tsx` (كامل الملف)، `src/lib/localPages.ts` — السطر **135–137** (LOCAL_PAGES)

### كيف تُولَّد الصفحات؟

```
LOCAL_PAGES = 3 خدمات (sababin-qahwa, qahwajiin, diyafa-munasabat) × 8 مدن = 24 صفحة
```

تُبنى SSG عبر `generateStaticParams` (`src/app/[serviceCity]/page.tsx:18-20`) مع `dynamicParams = false` (سطر 23) — **ممتاز تقنياً**: أي slug غير معروف → 404 حقيقي، لا صفحات وهمية.

### المشكلة: التمايز بين المدن شبه صفري

بفحص `getLocalContent()` سطراً سطراً، ما **يتغير فعلياً** بين `sababin-qahwa-jeddah` و`sababin-qahwa-riyadh`:

| العنصر | التمايز الفعلي |
|---|---|
| h1 / metaTitle / metaDescription | اسم المدينة فقط |
| intro (سطر 82–86) | اسم المدينة + **جملة واحدة** (`c.intro` من localPages.ts) |
| sections (88–160) | **متطابقة 100%** عدا استبدال `${c.ar}` |
| packages (162–180) | **متطابقة 100%** حرفياً (لا تذكر المدينة أصلاً) |
| whyUs (182–189) | متطابقة عدا سطر واحد باسم المدينة |
| faqs (191–208) | **متطابقة 100%** عدا `${c.ar}` |
| districts | قائمة أحياء مختلفة (8 أسماء) ✓ |
| الصور | دوران deterministic مختلف ✓ |

أي أن ~85% من نص كل صفحة **مستنسخ حرفياً عبر 8 مدن**. هذا بالضبط تعريف Google لـ doorway pages:
> "Pages generated to funnel visitors... multiple pages targeting specific city names where content is duplicated"

**العواقب المحتملة:** Google يفهرس الكل حالياً، لكن مع تحديثات Helpful Content يُتوقع: (أ) اختيار canonical واحد ذاتياً وإسقاط الباقي من الفهرس («Duplicate, Google chose different canonical»)، (ب) خفض جودة الموقع كله. **الأعراض الحالية (742 ظهور بلا نقرات، ترتيب متذبذب) متوافقة مع بداية هذا التصنيف.**

### ✅ الإصلاح المقترح (على مراحل):

**المرحلة 1 (سريعة):** إثراء `c.intro` في `src/lib/localPages.ts` من جملة واحدة إلى فقرة 60–100 كلمة لكل مدينة تذكر: قاعات/فنادق المدينة المعروفة، طابع مناسباتها، مواسمها. مثال لجدة:

```tsx
intro: `في جدة نخدم قاعات الأفراح على طريق المدينة وفنادق الواجهة البحرية
(هيلتون، روزوود، بارك حياة) وقصور الأفراح في أبحر والبساتين. طابع مناسبات
عروس البحر يمزج الفخامة العصرية بالضيافة الحجازية الأصيلة — من استقبال
المعازيم بالمرش وماء الورد إلى صواني المعمول والدُبيازة في الأعياد. فريقنا
المقيم في جدة يصل خلال ساعة لأي حي من أبحر شمالاً حتى الحمدانية جنوباً.`,
```

**المرحلة 2:** جعل `faqs` و`packages` تستقبل حقولاً خاصة بالمدينة (سؤال عن قاعة/موسم محلي واحد على الأقل لكل مدينة).

**المرحلة 3 (قياس):** في GSC، إن ظهرت صفحات serviceCity تحت «Duplicate without user-selected canonical» → قلّص المصفوفة إلى المدن التي لها طلب بحث حقيقي (جدة، الرياض، مكة، الدمام) وحوّل الباقي 301 لصفحة `/locations/{city}`، بدل إبقاء 24 صفحة نصفها ميت.

---

## 1.3 [حرج] تنافس داخلي (Keyword Cannibalization) بين ثلاث طبقات صفحات

**الملفات:** `src/app/locations/[city]/page.tsx:34`، `src/lib/localContent.tsx:70-74`، `src/app/services/page.tsx:16`

على استعلام «قهوجيين جدة» تتنافس داخلياً **3 صفحات**:

| الصفحة | العنوان |
|---|---|
| `/qahwajiin-jeddah` | قهوجيين ومباشرين جدة \| قهوجي وطاقم رجالي بزيّ رسمي |
| `/locations/جدة` | خدمات الضيافة في جدة **\| قهوجيين وصبابين قهوة** |
| `/services` | **قهوجيين وصبابين قهوة** — خدمات ضيافة فاخرة |

وكذلك `/sababin-qahwa-jeddah` vs `/locations/جدة` على «صبابين قهوة جدة» (الكلمة موجودة نصاً في keywords الملف `cities.ts:96`). Google سيوزع الإشارة بين الصفحات فلا تترسخ أي منها — **وهذا مفسر إضافي قوي لترتيب 3.8 المتذبذب بدل التثبيت في top-3.**

### ✅ الإصلاح:

1. **تخصيص النية لكل طبقة:**
   - `/locations/{city}` = صفحة تجميعية (hub) للمدينة → عنوانها «ضيافة فاخرة في جدة — كل خدماتنا» **بدون** كلمتي قهوجيين/صبابين في الـ title.
   - `/{service}-{city}` = صفحة المال الوحيدة المستهدفة للكلمة التجارية.
   - `/services` = صفحة وطنية عامة، يُخفف عنوانها من «قهوجيين وصبابين» إلى «خدمات الضيافة الفاخرة — قهوجية وتقديمات ومعدات».
2. في `src/lib/cities.ts` احذف من `keywords` كل تركيبة «صبابين قهوة {city}» و«قهوجيين {city}» (السطور 96، 46، …) — هذه ملك صفحات serviceCity حصراً.
3. الربط الداخلي موجود بالفعل من `/locations/{city}` نحو الخدمات الثلاث (سطر 232–256 في `locations/[city]/page.tsx`) ✓ ومن الفوتر ✓ — جيد، أبقه.

---

# 🟡 القسم 2: مشاكل متوسطة

## 2.1 عنوان صفحة legal يكرر البراند مرتين + لا OG/Twitter

**الملف:** `src/app/legal/page.tsx` — السطر **5**:

```tsx
title: "الحقوق القانونية | كيف الضيافة",
```

هذا العنوان **يمر عبر قالب** layout.tsx:32 (`%s | كيف الضيافة`) فيصبح فعلياً في الـ HTML:

```
الحقوق القانونية | كيف الضيافة | كيف الضيافة
```

كما تفتقد الصفحة openGraph/twitter (باقي الصفحات تحصل عليها من `generatePageMetadata`).

### ✅ الإصلاح:

```tsx
export const metadata: Metadata = generatePageMetadata({
  title: "الحقوق القانونية والملكية الفكرية",
  description: "معلومات الحقوق القانونية والملكية الفكرية لصور ومحتوى موقع كيف الضيافة — شركة سعودية لخدمات الضيافة الفاخرة.",
  path: "/legal",
});
```

## 2.2 ازدواج ترميز BreadcrumbList: JSON-LD + Microdata معاً

**الملفات:** `src/components/Breadcrumbs.tsx` — الأسطر **44–45، 54–55، 62** (microdata: `itemScope itemType="https://schema.org/BreadcrumbList"`) + كل صفحات about/contact/services/portfolio/offerings تحقن `generateBreadcrumbSchema` JSON-LD أيضاً.

النتيجة: **كتلتا BreadcrumbList لكل صفحة**. Google يوصي صراحة بعدم خلط صيغتين للكيان نفسه (خطر تعارض القراءة في Rich Results). إضافةً لذلك: microdata العنصر الأخير بلا `itemProp="item"` (مسموح لكن مع JSON-LD الموازي قد يُقرأ نصفين متعارضين).

### ✅ الإصلاح (في Breadcrumbs.tsx):
احذف سمات microdata واترك JSON-LD مصدراً وحيداً:

```tsx
<ol className="flex items-center gap-2 text-sm flex-wrap">
  {breadcrumbs.map((crumb, index) => (
    <li key={crumb.href} className="flex items-center gap-2">
      {/* بدون itemScope / itemType / itemProp / meta position */}
```

ملاحظة: fallback التوليد الآلي في `generateBreadcrumbs()` (سطر 100–114) يعرض **slug خام** («qahwajiin-jeddah») لأي مسار غير موجود في `pathLabels` — أضف تحذيراً أو وسّع الخريطة (حالياً غير مستخدم لصفحات serviceCity لأنها تمرر items، لكنه فخ مستقبلي).

## 2.3 تفكك كيانات Schema: ثلاثة كيانات "ناشر" غير مترابطة

**الملف:** `src/lib/schema.ts`

- `generateOrganizationSchema()` (سطر **8–31**): **بلا `@id`** إطلاقاً.
- `generateLocalBusinessSchema()` (سطر 33): `@id: {SITE_URL}/#business` ✓.
- `generateWebSiteSchema()` (سطر **259–276**): `publisher` هو **Organization مضمّنة جديدة بلا @id** — كيان ثالث منفصل.

الثلاثة تُحقن معاً في `layout.tsx:157-176` فيرى Google **ثلاثة كيانات باسم «كيف الضيافة» غير موصولة**، ما يشتت knowledge graph consolidation.

### ✅ الإصلاح:

```tsx
// 1) في generateOrganizationSchema أضف:
"@id": `${SITE_URL}/#org`,

// 2) في generateLocalBusinessSchema أضف:
parentOrganization: { "@id": `${SITE_URL}/#org` },
// أو الأبسط: احذف Organization schema كلياً وأبقِ CateringService وحده
// (CateringService يرث Organization في التسلسل الهرمي — كيان واحد أنظف).

// 3) في generateWebSiteSchema:
publisher: { "@id": `${SITE_URL}/#business` },
```

## 2.4 تعارض @type في provider الخاص بـ Service schema

**الملف:** `src/lib/schema.ts` — السطر **222–226**:

```tsx
provider: {
  "@type": "LocalBusiness",
  name: SITE_NAME,
  "@id": `${SITE_URL}/#business`,
},
```

الكيان `#business` معرَّف في LocalBusiness schema بنوع `CateringService`، وهنا يُعاد تعريفه `LocalBusiness` — إعادة تصريح type لمرجع @id موجود قد تنتج دمجاً غير متوقع في قراءة Google.

### ✅ الإصلاح: المرجع بالـ @id فقط:

```tsx
provider: { "@id": `${SITE_URL}/#business` },
```

## 2.5 sitemap_index يعلن lastmod زائفاً + robots يقدّم 3 سايت مابات متداخلة

**الملف:** `src/app/sitemap_index.xml/route.ts` — السطر **14**:

```tsx
const now = new Date().toISOString();
```

مع `force-static` تتجمد القيمة عند لحظة **البناء** — أي أن كل نشرة Vercel (حتى تعديل CSS) تعلن لـ Google أن «كلا السايت مابين تغيّرا الآن»، وهو تضليل lastmod الذي بدأت Google تتجاهله من المواقع التي تمارسه (يُضعف الثقة بـ lastmod الدقيق في sitemap.ts الذي بُني بعناية).

**والملف:** `src/app/robots.ts` — الأسطر **12–16**: يعلن sitemap.xml + image-sitemap.xml **+** sitemap_index.xml الذي يشير إلى الأولَين → GSC سيعرض عناوين مزدوجة الاكتشاف.

### ✅ الإصلاح:

```tsx
// sitemap_index route.ts — تاريخ ثابت صادق مثل نمط sitemap.ts:
const LASTMOD = "2026-07-08";
// ... <lastmod>${LASTMOD}</lastmod>

// robots.ts — أعلن الـ index فقط:
sitemap: ["https://keifaldiafa.com/sitemap_index.xml"],
```

## 2.6 image-sitemap لا يغطي صفحات serviceCity ولا locations

**الملف:** `src/lib/imageCatalog.ts` — الدالة `categoryToPage()` (السطر **50–76**) تُسند كل صورة إلى `/`, `/offerings`, `/portfolio`, `/services` فقط. صور صفحات المال الـ24 وصفحات المدن الـ8 (وهي تستخدم نفس الكتالوج عبر `pickImages`/`cityImages`) **غير ممثلة في image-sitemap تحت عناوينها**، فتخسر إشارة صورة↔صفحة محلية في Google Images (استعلامات مثل «قهوجي جدة» بحث الصور نشط فيها فعلياً).

### ✅ الإصلاح المقترح: توليد مداخل إضافية في `getImagesByPage()` تربط الصور المختارة فعلياً لكل صفحة serviceCity (يمكن استدعاء `pickImages(service, seed, 9)` نفسها لضمان التطابق).

## 2.7 خريطة lastmod اليدوية في sitemap.ts — عرضة للنسيان

**الملف:** `src/app/sitemap.ts` — الأسطر **10–22** (`DATES`). المنهج صادق وذكي (تعليق يشرح قيد git shallow على Vercel ✓)، لكنه **يعتمد على ذاكرة المطور**: git log يظهر تعديل FAQ الرئيسية بتاريخ لاحق (commit 4dcc11a) دون تحديث `DATES.home`. الخطورة متوسطة-بسيطة، لكن lastmod الكاذب-بالتقادم يفقد قيمته.

### ✅ الإصلاح: سكربت prebuild يولّد `dates.json` من git log محلياً ويُلتزم به في المستودع (يتجاوز قيد shallow clone)، أو على الأقل بند checklist في `LESSONS-AND-FIXES.md`.

---

# 🟢 القسم 3: مشاكل بسيطة

## 3.1 قائمة keywords ضخمة ومكررة في كل صفحة

**الملف:** `src/components/SEO.tsx` — الأسطر **51–68** (`defaultKeywords`: 15 كلمة تُضاف لكل صفحة) + `src/app/[serviceCity]/page.tsx:40-49` يضيف ~12 أخرى. وسم keywords **تتجاهله Google كلياً منذ 2009**؛ ضرره الوحيد أنه يكشف استراتيجيتك للمنافسين ويضخم الـ HTML. كذلك حشو «صبابين قهوة جدة/الرياض» default في صفحات لا علاقة لها (مثل /about).
**الإصلاح:** قلّص defaultKeywords إلى 3–4 أو احذف الوسم كلياً.

## 3.2 founder بكيان Person وهمي

**الملف:** `src/lib/schema.ts` — السطر **66**:
```tsx
founder: { "@type": "Person", name: "فريق كيف الضيافة" },
```
«فريق كيف الضيافة» ليس Person — كيان زائف يضعف E-E-A-T بدل تعزيزه.
**الإصلاح:** اسم مؤسس حقيقي إن توفر، وإلا احذف الحقل (foundingDate وحدها كافية).

## 3.3 hreflang بلا x-default

**الملفات:** `src/components/SEO.tsx:75-77`، `src/app/layout.tsx:68-70`:
```tsx
languages: { "ar-SA": url },
```
`lang="ar" dir="rtl"` في `<html>` ✓ سليم. لموقع أحادي اللغة hreflang اختياري أصلاً، لكن إن وُجد فالأفضل اكتماله:
```tsx
languages: { "ar-SA": url, ar: url, "x-default": url },
```

## 3.4 canonical فخ كامن في root layout

**الملف:** `src/app/layout.tsx` — السطر **66–71**: `alternates.canonical: SITE_URL` على مستوى الـ layout يعني أن **أي صفحة مستقبلية تنسى تعريف alternates سترث canonical يشير للرئيسية** → تُسقط نفسها من الفهرس بصمت. حالياً كل الصفحات تعرّفه ✓، لكن وثّق القاعدة أو انقل canonical من layout إلى page.tsx الرئيسية فقط.

## 3.5 أبعاد صور مثبتة 1200×900 في ImageGallery schema

**الملف:** `src/lib/schema.ts` — السطر **190–191**: `width: 1200, height: 900` لكل الصور بغضّ النظر عن أبعادها الفعلية — بيانات مهيكلة غير دقيقة. **الإصلاح:** خزّن الأبعاد الحقيقية في imageCatalog (عبر image-size وقت البناء) أو احذف الحقلين.

## 3.6 middleware: استثناء .xml يُبقي نسخ www للسايت ماب

**الملف:** `src/middleware.ts` — السطر **51** (matcher يستثني `xml|txt`): طلب `www.keifaldiafa.com/sitemap.xml` لن يُحوَّل 301 عبر الـ middleware. غالباً Vercel domain redirect يعالجها على مستوى أعلى — **تحقق** بـ `curl -I https://www.keifaldiafa.com/sitemap.xml`؛ إن أعادت 200 فأزل `xml` من الاستثناء أو اضبط Redirect في إعدادات Vercel domains.

---

# القسم 4: تقييم تفصيلي صفحة–صفحة (Metadata)

| الصفحة | title فريد | description فريد | canonical | OG/Twitter | Schema | ملاحظات |
|---|---|---|---|---|---|---|
| `/` (page.tsx) | ✓ (absolute — صحيح) | ✓ | ✓ | ✓ | Breadcrumb+FAQ (+Org/LB/WebSite من layout) | ممتازة. preload hero ✓ |
| `/services` | ✓ | ✓ | ✓ | ✓ | Breadcrumb+Service+WebPage+ImageGallery | تنافس داخلي مع صفحات qahwajiin (§1.3) |
| `/offerings` | ✓ | ✓ | ✓ | ✓ | 4 كتل ✓ | سليمة |
| `/portfolio` | ✓ («+500 مناسبة» — أفضل صيغة بالموقع) | ✓ | ✓ | ✓ | 3 كتل ✓ | انقل صيغة +500 لصفحات المال |
| `/about` | ✓ | ✓ | ✓ | ✓ | Breadcrumb+WebPage | سليمة |
| `/contact` | ✓ (فيها CTA ✓) | ✓ | ✓ | ✓ | Breadcrumb+WebPage | يُفضل إضافة ContactPage type بدل WebPage |
| `/legal` | ⚠️ براند مكرر (§2.1) | ✓ | ✓ | ✗ لا OG | لا schema | §2.1 |
| `/locations` | ✓ | ✓ | ✓ | ✓ | Breadcrumb+WebPage | سليمة |
| `/locations/[city]` ×8 | ✓ | ✓ (city.intro) | ✓ | ✓ | 5 كتل شاملة Gallery ✓ | وصف بلا CTA (§1.1) + cannibalization (§1.3) |
| `/[serviceCity]` ×24 | ⚠️ طويل/محشو | ⚠️ ضعيف CTR | ✓ | ✓ | Breadcrumb+Service+FAQ+WebPage ✓ | **§1.1 + §1.2 — الأولوية القصوى** |
| 404 | ✓ noindex,follow ✓ | ✓ | — | — | — | صحيحة |

**لا توجد صفحة بلا metadata** ✓. جميع FAQ schema مطابقة للمحتوى المرئي ✓ (شرط Google). `dynamicParams=false` يمنع soft-404 ✓.

# القسم 5: تقييم Sitemap/Robots — الخلاصة

- **التغطية كاملة:** 8 ثابتة + 8 مدن + 24 خدمة×مدينة = **40 URL** — كل صفحات الموقع القابلة للفهرسة مشمولة، ولا صفحة noindex داخل الـ sitemap ✓.
- `encodeURI` للسلاجات العربية (`/locations/جدة`) ✓ مطابق للمواصفة.
- priorities منطقية (money pages = 0.8) ✓.
- المشاكل: §2.5 (تداخل الإعلانات الثلاثة + lastmod الزائف في index) و§2.7 (خريطة يدوية).
- robots: disallow لـ api/admin/private ✓، لا حجب لملفات JS/CSS ✓.
- middleware: توحيد www→non-www ✓ 301، خريطة page_id قديمة ✓ — بناء سليم (فقط §3.6).

# القسم 6: خطة التنفيذ المرتبة

| # | الإجراء | الملف | الأثر المتوقع | الجهد |
|---|---|---|---|---|
| 1 | إعادة كتابة metaTitle/metaDescription للخدمات الثلاث (§1.1) | `localContent.tsx:70-80` | CTR من 0.4→2%+ = **مضاعفة الزيارات 4–5×** على نفس الترتيب | ساعة |
| 2 | عناوين وأوصاف /locations (§1.1) | `locations/[city]/page.tsx:34-39` | رفع CTR صفحات المدن | 30 د |
| 3 | فصل نوايا الكلمات بين الطبقات الثلاث (§1.3) | `cities.ts`, `services/page.tsx` | تثبيت «صبابين قهوة» في top-3 | ساعة |
| 4 | إثراء intro لكل مدينة 60–100 كلمة (§1.2 مرحلة 1) | `localPages.ts` | إزالة خطر doorway | 3–4 س |
| 5 | إصلاح legal title + OG (§2.1) | `legal/page.tsx:4-10` | نظافة SERP | 10 د |
| 6 | حذف microdata من Breadcrumbs (§2.2) | `Breadcrumbs.tsx` | توحيد الإشارة | 15 د |
| 7 | ربط كيانات Schema بـ @id (§2.3, §2.4) | `schema.ts` | ترسيخ knowledge graph | 30 د |
| 8 | robots→sitemap_index فقط + lastmod ثابت (§2.5) | `robots.ts`, `sitemap_index/route.ts` | مصداقية lastmod | 15 د |
| 9 | تغطية serviceCity في image-sitemap (§2.6) | `imageCatalog.ts` | ظهور بحث الصور المحلي | 1–2 س |
| 10 | البنود البسيطة §3.1–3.6 | متفرقة | نظافة عامة | ساعة |

---
*التقرير قراءة-فقط: لم يُعدَّل أي ملف مصدري. أرقام الأسطر مطابقة للحالة الحالية للمستودع (HEAD = 4dcc11a).*
