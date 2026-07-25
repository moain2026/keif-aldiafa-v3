# معايير Google الرسمية للفهرسة والأرشفة (2026)
## تقرير بحثي عملي لموقع keifaldiafa.com

> **السياق:** موقع Next.js لخدمات ضيافة سعودية — 47 صفحة، 9 فقط مفهرسة، و22 صفحة عالقة بين "Discovered – currently not indexed" و"Crawled – currently not indexed".
>
> **تاريخ البحث:** 24 يوليو 2026 — كل الاقتباسات تم التحقق منها بالبحث الحي في مستندات Google الرسمية (developers.google.com/search و support.google.com/webmasters).

---

## الخلاصة التنفيذية (اقرأ هذا أولاً)

1. **مشكلتنا ليست تقنية بحتة — إنها مشكلة "استحقاق فهرسة".** Google يصرّح رسمياً أنه **لا يفهرس كل صفحة يزحف إليها**، والفهرسة قرار جودة وليست حقاً مكتسباً. عندما تكون 22 صفحة من 47 غير مفهرسة (≈47%)، فالإشارة الأقوى — بحسب تصريحات John Mueller المتكررة — هي **شكوك في جودة الموقع ككل**، وغالباً بسبب صفحات (خدمة×مدينة) شديدة التشابه.
2. **"Discovered – not indexed"** = Google عرف بالرابط لكنه **قرر تأجيل الزحف** (أولوية منخفضة). **"Crawled – not indexed"** = Google زحف وقرأ المحتوى ثم **قرر أنه لا يستحق الفهرسة الآن**. الثانية أخطر لأنها حكم مباشر على المحتوى.
3. **صفحات خدمة×مدينة المتشابهة تلامس حدّين خطيرين في سياسات السبام الرسمية:** *Doorway abuse* (صفحات متعددة تستهدف مدناً وتصبّ في نفس المحتوى) و*Scaled content abuse* (توليد صفحات كثيرة بقيمة ضئيلة). الحل ليس الحذف بالضرورة، بل **تمييز حقيقي وجوهري** لكل صفحة أو دمجها.
4. **خطة العمل المختصرة:** (أ) دمج/تمييز صفحات المدن المتشابهة، (ب) محتوى فريد جوهري لكل صفحة باقية (أسعار محلية، صور حقيقية، تغطية أحياء، أسئلة شائعة محلية)، (ج) ربط داخلي هرمي قوي من الرئيسية، (د) sitemap دقيق بـ lastmod صادق، (هـ) طلب فهرسة يدوي للصفحات المحسَّنة عبر URL Inspection، (و) مراقبة أسبوعية.

---

## 1. "Discovered – currently not indexed": المعنى الرسمي والحلول

### 1.1 التعريف الرسمي الحرفي

من مستند **Page indexing report** الرسمي (support.google.com/webmasters/answer/7440203):

> "**Discovered – currently not indexed:** The page was found by Google, but not crawled yet. Typically, Google wanted to crawl the URL but this was expected to overload the site; therefore Google rescheduled the crawl. This is why the last crawl date is empty on the report."

الترجمة: **وجد Google الصفحة لكنه لم يزحف إليها بعد.** التفسير الرسمي الوحيد المذكور هو خشية إثقال الخادم وإعادة جدولة الزحف — ولهذا خانة "آخر زحف" فارغة.

### 1.2 الأسباب الحقيقية الكاملة (الرسمية + تصريحات Googlers)

التوثيق الرسمي يذكر سبباً واحداً، لكن John Mueller (في Office Hours وردود موثقة نقلها Search Engine Journal عن سؤال رسمي وُجّه له) حدّد **سببين رئيسيين**:

| السبب | التفسير | هل ينطبق علينا؟ |
|---|---|---|
| **1. سعة الخادم (Server capacity)** | الخادم بطيء أو يعيد 5xx/429، فيخفّض Google حد الزحف (crawl capacity limit) | **مستبعد** — موقعنا 47 صفحة فقط على Next.js؛ هذا سبب المواقع الضخمة (ملايين الصفحات) |
| **2. جودة الموقع الكلية (Overall website quality)** | انخفاض "طلب الزحف" (crawl demand): Google لا يرى قيمة كافية تبرر صرف موارد على URL جديد يشبه ما رآه | **السبب الأرجح لدينا** ✅ |

اقتباس Mueller الحرفي (عبر SEJ، عن سؤال حول Discovered not indexed):

> "For large sites, sometimes crawling more is limited by how your website can handle more crawling. **In most cases though, it's more about overall website quality.**"

وأيضاً عن تأثير قسم ضعيف على الموقع كله:

> "…if we see that there are significant parts that are lower quality then we might think overall this website is not so fantastic as we thought."

كما يؤكد مستند **Crawl Budget** الرسمي (developers.google.com/crawling/docs/crawl-budget) أن هذه الحالة مرتبطة مباشرة بميزانية الزحف، وأن **crawl demand** لموقعٍ ما يتأثر بـ:
- **Perceived inventory** (المخزون المُدرَك): إذا كانت كثير من URLs مكررة أو منخفضة القيمة، يهدر Google وقت الزحف ويقلّ حماسه للباقي.
- **Popularity** (الشعبية): الروابط الخارجية والداخلية للصفحة.
- **Staleness** (الحداثة): هل يتوقع Google تغيّراً يستحق إعادة الزحف؟

### 1.3 متى يقرر Google زحف/فهرسة صفحة مكتشفة؟

من واقع الوثائق الرسمية مجتمعة (crawl-budget + how-search-works + Page indexing report):
1. عندما يرتفع **crawl demand**: روابط داخلية أقوى إليها، روابط خارجية، إدراجها في sitemap محدَّث بـ lastmod صادق.
2. عندما تتحسن **إشارة جودة الموقع الكلية**: كلما زادت نسبة الصفحات المفهرسة الناجحة، زادت ثقة النظام في زحف الجديد.
3. عند **طلب فهرسة يدوي** عبر URL Inspection (يدفع الصفحة لطابور زحف ذي أولوية، بلا ضمان فهرسة).
4. مرور الوقت — من الأسئلة الشائعة الرسمية (crawling-index-faq): "the most common reason that a site is not indexed is because it's just too new; be patient".

### 1.4 خطوات الحل لموقعنا — خطوة بخطوة

1. **لا تكرر إرسال نفس URL:** الوثيقة الرسمية (ask-google-to-recrawl): "requesting a recrawl multiple times for the same URL won't get it crawled any faster."
2. **قوِّ الربط الداخلي** للصفحات المكتشفة غير المفهرسة: رابط مباشر من الصفحة الرئيسية أو من صفحة مفهرسة قوية (انظر القسم 5).
3. **تأكد أن الصفحة في sitemap.xml** مع `<lastmod>` صادق يعكس آخر تعديل حقيقي.
4. **حسّن المحتوى قبل طلب الفهرسة** — طلب فهرسة لصفحة ضعيفة سينقلها غالباً إلى "Crawled – not indexed" فقط.
5. **قلّص المخزون منخفض القيمة:** كل صفحة مكررة/هزيلة تبقى قائمة تخفض crawl demand للموقع كله.

---

## 2. "Crawled – currently not indexed": الفرق والأسباب والحلول

### 2.1 التعريف الرسمي الحرفي

من نفس المستند الرسمي (support.google.com/webmasters/answer/7440203):

> "**Crawled – currently not indexed:** The page was crawled by Google but not indexed. It may or may not be indexed in the future; **no need to resubmit this URL for crawling.**"

### 2.2 الفرق الجوهري عن "Discovered"

| | Discovered – not indexed | Crawled – not indexed |
|---|---|---|
| هل زحف Google؟ | ❌ لا (last crawl date فارغ) | ✅ نعم، وقرأ المحتوى كاملاً |
| طبيعة المشكلة | أولوية زحف منخفضة (crawl demand/budget) | **حكم جودة على المحتوى نفسه** |
| الحل الأساسي | ربط داخلي + sitemap + رفع قيمة الموقع | **إعادة كتابة/تمييز المحتوى جوهرياً** |
| هل يفيد "طلب الفهرسة" وحده؟ | قد يعجّل الزحف | Google يقول صراحة: لا داعي لإعادة الإرسال |

النقطة الحاسمة: في حالة "Crawled"، Google **رأى محتواك بالفعل وقرر أنه لا يستحق مكاناً في الفهرس الآن**. إعادة الإرسال دون تغيير المحتوى عبث؛ بل إن Mueller أشار (تصريحات 2025-2026 المنقولة عن Office Hours) إلى أن الاعتماد المتكرر على الإرسال اليدوي بدل الفهرسة الطبيعية **علامة ضعف بحد ذاته**.

### 2.3 الأسباب المعروفة (مرتبة حسب احتمالها لموقعنا)

1. **محتوى مكرر/شبه مكرر داخلياً** — صفحات خدمة×مدينة تختلف فقط باسم المدينة → Google يزحف، يقارن، يجد التطابق، ويمتنع. (قد تتحول لاحقاً لحالة "Duplicate" إذا حسم Google التطابق.)
2. **محتوى هزيل (thin) أو بلا قيمة مضافة** — لا يجيب على شيء لا تجيبه صفحة أخرى في الموقع أو على الويب.
3. **جودة الموقع الكلية منخفضة** — نسبة كبيرة من الصفحات الضعيفة تسحب الجميع للأسفل (اقتباس Mueller أعلاه).
4. **مشاكل rendering في JavaScript** — إن كان المحتوى الرئيسي لا يظهر إلا بعد تنفيذ JS من جهة العميل. في Next.js: يجب التأكد أن الصفحات تُقدَّم SSR/SSG وأن المحتوى موجود في HTML الأولي. (تحقق عبر URL Inspection → View crawled page → HTML.)
5. **Soft 404** — صفحة تعيد 200 لكن محتواها "فارغ" فعلياً.
6. **إشارات canonical متضاربة** — انظر القسم 7.

### 2.4 الحلول خطوة بخطوة

1. **افحص كل URL بأداة URL Inspection:** انظر Google-selected canonical، وافحص الـ HTML المزحوف — هل المحتوى العربي كامل فيه؟
2. **اختبر التفرد:** خذ فقرة من صفحة (خدمة×مدينة) وابحث عنها `site:keifaldiafa.com "الفقرة"` — إن ظهرت في أكثر من صفحة فهذا دليل تكرار داخلي يجب كسره.
3. **أعد بناء المحتوى** وفق معايير Helpful Content (القسم 4) — قيمة محلية حقيقية لا استبدال اسم المدينة.
4. **بعد التحسين الجوهري فقط**، اطلب الفهرسة يدوياً (القسم 6). التحسين أولاً، الطلب ثانياً.
5. **الصفحات غير القابلة للإنقاذ:** ادمجها (redirect 301 لصفحة أشمل) أو احذفها بـ 410. الوثيقة الرسمية للـ crawl budget: "Return a 404 or 410 status code for permanently removed pages" و"Consolidate duplicate content".

---

## 3. المحتوى المكرر وصفحات Doorway: التعريف الرسمي والمخاطر

### 3.1 تعريف Doorway abuse الرسمي (سياسات السبام)

من **Spam policies for Google web search** الرسمية (developers.google.com/search/docs/essentials/spam-policies) — حرفياً:

> "**Doorway abuse** is when sites or pages are created to rank for specific, similar search queries. They lead users to intermediate pages that are not as useful as the final destination. Examples include:
> - Having multiple websites with slight variations to the URL and home page to maximize their reach for any specific query
> - **Having multiple domain names or pages targeted at specific regions or cities that funnel users to one page**
> - Generating pages to funnel visitors into the actual usable or relevant portion of a site
> - Creating substantially similar pages that are closer to search results than a clearly defined, browseable hierarchy"

⚠️ **البند الثاني ينطبق حرفياً على نمط (خدمة×مدينة) إذا كانت الصفحات متشابهة وتصبّ كلها في نفس نموذج التواصل/الواتساب.** هذا هو الخطر الأول الذي يجب أن نبني ضده.

### 3.2 تعريف Scaled content abuse (الخطر الثاني)

من نفس المستند الرسمي:

> "**Scaled content abuse** is when many pages are generated for the primary purpose of manipulating search rankings and not helping users… Examples include:
> - Using generative AI tools or other similar tools to generate many pages without adding value for users
> - Creating many pages where the content makes little or no sense to a reader but contains search keywords"

توليد 30+ صفحة مدينة بقالب واحد ونص شبه ثابت = مرشح مثالي لهذا التصنيف، خصوصاً إذا كُتب بالذكاء الاصطناعي دون قيمة محلية.

### 3.3 كيف يكتشفها Google؟ وما العقوبات؟

- **الاكتشاف:** خوارزمياً أثناء الفهرسة (مقارنة بصمات المحتوى وأنماط القوالب عبر أنظمة مثل SpamBrain)، وبشرياً عبر فرق مكافحة السبام.
- **العقوبات:** التدرّج الرسمي: (1) عدم الفهرسة أصلاً — **وهذا ما يحدث لنا الآن على الأرجح، فهو "العقوبة الصامتة"**، (2) خفض ترتيب خوارزمي، (3) **Manual action** تظهر في Search Console وقد تشمل إزالة صفحات أو الموقع كله من النتائج.
- المحتوى المكرر **غير المتلاعِب** ليس عقوبة بحد ذاته — Google يختار canonical ويتجاهل الباقي (Page indexing report: "This is not an error, but is working as intended, because Google does not serve duplicate pages"). العقوبة تبدأ عندما يكون التكرار **متعمداً للتلاعب** (doorway/scaled).

### 3.4 كيف نتجنبها في صفحات (خدمة×مدينة)؟ — القواعد العملية

المعيار الرسمي الحاسم من سياسة Doorway: هل الصفحة **وجهة نهائية مفيدة بذاتها** أم مجرد ممر؟ لكي تنجو صفحة المدينة يجب أن تحتوي **قيمة لا توجد في أي صفحة أخرى**:

1. **معلومات محلية حقيقية:** الأحياء المخدومة فعلاً في تلك المدينة، مدة الوصول، رسوم/أسعار خاصة بالمدينة إن اختلفت، شروط التوصيل.
2. **إثبات خدمة فعلي:** صور من فعاليات نُفذت في المدينة، أسماء قاعات/فنادق تعاملنا معها هناك، تقييمات عملاء من المدينة نفسها.
3. **أسئلة شائعة محلية** تختلف إجاباتها فعلاً بين المدن (وليس نفس الأسئلة بتبديل الاسم).
4. **قاعدة الدمج:** إن لم تستطع كتابة **300–500 كلمة فريدة جوهرياً** عن الخدمة في تلك المدينة، **لا تنشئ الصفحة** — اجعل المدينة قسماً داخل صفحة الخدمة الأم أو صفحة "مناطق التغطية".
5. **هرمية تصفح واضحة:** الصفحات يجب أن تكون جزءاً من "clearly defined, browseable hierarchy" (نص السياسة) — أي يصل إليها الزائر طبيعياً: الرئيسية → الخدمة → المدينة، لا صفحات معزولة يصل إليها البحث فقط.
6. **اختبار ذهبي:** لو حذفت اسم المدينة من الصفحة، هل تستطيع معرفة أي مدينة تخص؟ إن كانت الإجابة "لا" فهي doorway page.

**توصية بنيوية لموقعنا:** بدلاً من 47 صفحة (منها 22 ميتة)، الأفضل غالباً: 8–10 صفحات خدمة قوية جداً + 4–6 صفحات مدن رئيسية غنية (الرياض، جدة، الدمام/الخبر، مكة، المدينة) + دمج المدن الصغيرة كأقسام. **25 صفحة مفهرسة بالكامل أقوى بكثير من 47 نصفها مرفوض** — وهذا يرفع "overall site quality" الذي يتحدث عنه Mueller.

---

## 4. معايير الجودة: Helpful Content و E-E-A-T — ما الذي يجعل الصفحة "تستحق الفهرسة"؟

**المصدر الرسمي:** developers.google.com/search/docs/fundamentals/creating-helpful-content (نظام Helpful Content اندمج في أنظمة الترتيب الأساسية منذ مارس 2024 ويعمل كإشارة site-wide).

### 4.1 لا يوجد "حد أدنى رسمي للكلمات" — لكن يوجد حد أدنى للقيمة

Google ينفي صراحة وجود عدد كلمات مفضل:

> "Are you writing to a particular word count because you've heard or read that Google has a preferred word count? **(No, we don't.)**"

المعيار ليس الطول بل **الأصالة والاكتمال**. أسئلة التقييم الذاتي الرسمية الأكثر صلة بحالتنا:

- "Does the content provide **original** information, reporting, research, or analysis?"
- "Does the content provide **substantial value when compared to other pages in search results**?" — وضمنياً: مقارنة بصفحاتك الأخرى.
- "Is the content **mass-produced** … so that individual pages don't get as much attention or care?" ← هذا سؤال Google الرسمي الذي يصف صفحات المدن المولّدة قالبياً.
- "Are you producing lots of content on many different topics in hopes that some of it might perform well?" (علامة تحذير رسمية)

### 4.2 E-E-A-T لموقع خدمات ضيافة

من المستند الرسمي: E-E-A-T (الخبرة العملية Experience، التخصص Expertise، الموثوقية Authoritativeness، الثقة Trust) **ليست عامل ترتيب مباشراً** لكن الأنظمة تبحث عن مزيج إشارات يدل عليها، **والثقة (Trust) أهمها**. إطار "Who, How, Why" الرسمي:

- **Who:** من يقدم الخدمة؟ → صفحة "من نحن" حقيقية: اسم المنشأة، سجل تجاري، فريق العمل، سنوات الخبرة.
- **Experience (الخبرة المعاشة):** "expertise that comes from having actually used a product or service, **or visiting a place**" → صور فعالياتنا الحقيقية، دراسات حالة ("جهّزنا ضيافة حفل زفاف 500 شخص في قاعة X بالرياض")، أرقام فعلية.
- **Trust:** رقم هاتف وعنوان ظاهرين، تقييمات قابلة للتحقق (Google Business Profile)، سياسة استرجاع/تعاقد واضحة، شهادات (بلدية/سلامة غذائية إن وجدت).

### 4.3 متى تعتبر الصفحة "تستحق الفهرسة"؟ (تجميع المعايير الرسمية)

الصفحة تستحق الفهرسة عندما: (1) تجيب على حاجة حقيقية لجمهور موجود، (2) بمحتوى **أصيل غير مكرر** داخلياً أو خارجياً، (3) تظهر خبرة أولى (first-hand)، (4) يغادر الزائر وقد اكتفى ("will someone leave feeling they've learned enough to achieve their goal?")، (5) وهي جزء من موقع نظيف الجودة إجمالاً — لأن الحكم site-wide.

**التطبيق:** أي صفحة من الـ22 لا تحقق هذه الشروط: حسّنها جوهرياً أو ادمجها. لا حل ثالث.

---

## 5. Crawl Budget والربط الداخلي في المواقع الصغيرة

### 5.1 الحقيقة الرسمية: موقعنا لا يعاني نقص "ميزانية زحف"

المستند الرسمي (developers.google.com/crawling/docs/crawl-budget) صريح تماماً:

> "If your site doesn't have a large number of pages that change rapidly… **you don't need to read this guide.** For Google Search specifically, keeping your sitemap up to date and checking the Page Indexing report regularly is adequate."

الدليل موجّه لمواقع بمليون+ صفحة أو 10,000+ سريعة التغير. موقع 47 صفحة **يمكن لـ Google زحفه كاملاً في دقائق** — إذاً امتناع Google ليس عجزاً بل **عزوفاً (انخفاض crawl demand)**، وهو دالة على الجودة والشعبية كما سبق. لكن مبدأ واحداً من الدليل ينطبق علينا مباشرة: **"Perceived inventory… This is the factor that you can positively control the most"** — نظّف مخزونك من الصفحات المكررة يرتفع الطلب على الباقي.

### 5.2 الربط الداخلي: القوة الأولى المتاحة لنا

من مستند "How Search Works" الرسمي: Google يكتشف ويقيّم أهمية الصفحات عبر الروابط، ومن مستند links-crawlable: الروابط يجب أن تكون `<a href="...">` حقيقية بنص رابط وصفي — **تنبيه Next.js:** مكوّن `<Link>` يُخرج `<a href>` سليماً، لكن أي تنقّل مبني على onClick/router.push بدون href لن يراه Googlebot:

> "Google can only crawl your link if it's an `<a>` HTML element with an `href` attribute."

### 5.3 البنية المثلى لموقعنا (هرم ≤ 3 نقرات)

```
الرئيسية
├── /services (فهرس الخدمات)
│   ├── /services/قهوجي-وصبابين  ← يربط لكل مدنه
│   ├── /services/ضيافة-حفلات
│   └── ...
├── /locations (مناطق التغطية)
│   ├── /locations/الرياض  ← تجمع كل خدمات الرياض
│   └── ...
└── /blog → مقالات تربط سياقياً للخدمات والمدن
```

قواعد عملية مستندة للوثائق الرسمية:
1. **كل صفحة تستحق الفهرسة تُربط من صفحتين مفهرستين على الأقل** (لا صفحات يتيمة orphan).
2. **الربط المتقاطع سياقي:** صفحة "قهوجي الرياض" تربط لـ"ضيافة حفلات الرياض" (نفس المدينة) ولـ"قهوجي جدة" (نفس الخدمة) — داخل نص مفيد لا قوائم روابط عارية (قوائم footer الضخمة لكل مدينة×خدمة نمط doorway مكشوف).
3. **Anchor text وصفي:** "خدمة قهوجي وصبابين في الرياض" لا "اضغط هنا" — توصية حرفية من links-crawlable.
4. **الصفحات الأهم أقرب للرئيسية:** الرئيسية أقوى صفحاتك؛ ما تربطه مباشرة يرث أولوية زحف أعلى.
5. **اربط دائماً للـ canonical URL** وليس لنسخ بديلة — توصية حرفية من consolidate-duplicate-urls: "When linking within your site, link to the canonical URL rather than a duplicate URL."

---

## 6. طلب الفهرسة: URL Inspection والأدوات البرمجية والحدود

**المصدر الرسمي:** developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl + developers.google.com/webmaster-tools/limits

### 6.1 الطرق الرسمية

| الطريقة | الاستخدام | الحدود الرسمية |
|---|---|---|
| **URL Inspection tool (يدوي في GSC)** | "just a few URLs" — طلب Request Indexing بعد التحسين | حصة يومية غير معلنة (عملياً ~10-12 طلب/يوم/خاصية)؛ "requesting a recrawl multiple times for the same URL won't get it crawled any faster" |
| **إرسال Sitemap** | "many URLs at once" — الطريقة الرسمية للأعداد الكبيرة | يعاد قراءته دورياً؛ حدّث lastmod ليُقرأ التغيير |
| **URL Inspection API** (برمجي) | **قراءة حالة الفهرسة فقط** (فحص جماعي) — **لا يطلب فهرسة** | **2,000 استعلام/يوم لكل موقع، 600/دقيقة** (developers.google.com/webmaster-tools/limits) |
| **Indexing API** | ❌ **ليست لنا**: رسمياً حصراً لصفحات JobPosting وBroadcastEvent (بث مباشر) | حصة افتراضية 200/يوم وتتطلب موافقة؛ استخدامها لغير ذلك مخالفة قد تُعاقب |

### 6.2 ما يجب فهمه بدقة

1. **طلب الفهرسة ≠ ضمان فهرسة.** الوثيقة الرسمية: "Crawling can take anywhere from a few days to a few weeks." الطلب يضع URL في طابور زحف لا أكثر؛ قرار الفهرسة يبقى قرار جودة.
2. **URL Inspection API مفيد لنا للمراقبة لا للطلب:** يمكن كتابة سكربت يفحص الـ47 URL دفعة واحدة يومياً/أسبوعياً ويعيد `coverageState` و`googleCanonical` لكل صفحة — ممتاز لقياس أثر التحسينات (2,000/يوم أكثر من كافٍ).
3. **لا يوجد أي API رسمي لطلب فهرسة صفحات عادية.** خدمات "الفهرسة السريعة" الخارجية إما تسيء استخدام Indexing API (مخاطرة) أو بلا قيمة.

### 6.3 البروتوكول العملي لموقعنا

1. حسّن الصفحة جوهرياً → حدّث `lastmod` في sitemap → أعد إرسال sitemap في GSC.
2. اطلب الفهرسة يدوياً عبر URL Inspection **للصفحات المحسّنة فقط**، بدفعات ~10/يوم مرتبة بالأهمية.
3. راقب أسبوعياً عبر URL Inspection API (سكربت) + تقرير Page indexing.
4. لا تعِد الطلب لنفس URL قبل 2–4 أسابيع من طلب سابق دون تغيير جوهري جديد.

---

## 7. canonical و sitemap lastmod و hreflang: أدوارها الدقيقة في الفهرسة

### 7.1 rel="canonical"

**المصدر:** developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

- ترتيب قوة إشارات تحديد الـ canonical رسمياً: **Redirects (أقوى) > rel="canonical" > الإدراج في sitemap (أضعف)** — "these methods can stack and become more effective when combined."
- **canonical اقتراح لا أمر:** Google قد يتجاهله ويختار غيره ("Duplicate, Google chose different canonical than user"). التوثيق الرسمي: لن يقبل Google إعلانك canonical لصفحة **غير مشابهة فعلاً** للصفحة المكررة.
- أهم القواعد الرسمية لموقعنا:
  - ✅ **Self-referential canonical على كل صفحة** ("Do include a rel=canonical link on the canonical page itself").
  - ❌ لا تستخدم robots.txt أو noindex لمعالجة التكرار الداخلي ("We don't recommend using noindex to prevent selection of a canonical within a single site").
  - ❌ لا إشارات متضاربة (canonical في HTML يخالف sitemap).
  - ⚠️ **حاسم لـ Next.js:** "specify the canonical URL in the HTML source code and **make sure that JavaScript doesn't change the canonical link element**" — يجب أن يخرج `<link rel="canonical">` في الـ HTML الأولي (Metadata API / generateMetadata مع `alternates.canonical`)، ونسخة واحدة فقط، بمسار مطلق موحّد (https + non-www أو www حسب المعتمد + بدون trailing slash عشوائي).
- **تحذير استراتيجي:** جعل صفحات المدن canonical إلى صفحة الخدمة الأم = اعتراف بأنها نسخ، فتخرج من الفهرس نهائياً. استخدم هذا فقط للصفحات التي **قررت** ألا تنافس بذاتها؛ أما الصفحات التي تريد فهرستها فيجب أن تكون فريدة self-canonical.

### 7.2 sitemap `<lastmod>`

**المصدر:** developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap — حرفياً:

> "Google ignores `<priority>` and `<changefreq>` values."
> "Google uses the `<lastmod>` value **if it's consistently and verifiably accurate** (for example by comparing to the last modification of the page)."

- **lastmod هو الحقل الوحيد المؤثر** بجانب `<loc>`. و**الصدق شرط**: إن ضبطت lastmod = اليوم لكل الصفحات دائماً (خطأ شائع في sitemaps المولدة ديناميكياً في Next.js!) سيكتشف Google الكذب **ويتجاهل الحقل كلياً** — فتخسر أداة مجانية لتحفيز إعادة الزحف.
- كذلك من Helpful Content (علامة تحذير رسمية): "Are you changing the date of pages to make them seem fresh when the content has not substantially changed?"
- **التطبيق:** في `app/sitemap.ts` اربط lastMod بتاريخ تعديل حقيقي (من CMS أو git commit للصفحة)، وأدرج **الصفحات القابلة للفهرسة فقط** (الوثيقة: أدرج canonical URLs فقط — "choose the URL you prefer and include that in the sitemap instead of all URLs").

### 7.3 hreflang

**المصدر:** developers.google.com/search/docs/specialty/international/localized-versions

- وظيفته: توجيه المستخدم للنسخة اللغوية/الإقليمية الأنسب — **ليس أداة فهرسة** ولا يُستخدم لاكتشاف لغة الصفحة ("Google doesn't use hreflang or the HTML lang attribute to detect the language of a page").
- **قرار لموقعنا:** إن كان الموقع **عربياً فقط** ويستهدف السعودية → **لا نحتاج hreflang إطلاقاً**. إضافته بلا نسخ لغوية فعلية ضجيج بلا فائدة وقد يخلق تضارباً. يكفي `<html lang="ar" dir="rtl">` للمستخدم والوصولية.
- إن أضفنا مستقبلاً نسخة إنجليزية: القواعد الرسمية الصارمة: (1) **تبادلية إلزامية** — كل نسخة تشير لنفسها ولكل النسخ الأخرى، "If two pages don't both point to each other, the tags will be ignored"، (2) روابط مطلقة كاملة، (3) `x-default` للاحتياط، (4) canonical لكل نسخة يبقى **بنفس لغتها** (لا تجعل canonical الإنجليزية يشير للعربية).
- ملاحظة رسمية مهمة: "Localized versions of a page are only considered duplicates **if the main content remains untranslated**" — الترجمة الكاملة ليست تكراراً؛ أما صفحات المدن بنفس اللغة ونفس المحتوى فهي تكرار ولا علاقة لـ hreflang بحلها.

---

## 8. خطة العمل الموحدة لـ keifaldiafa.com (ترتيب تنفيذي)

### المرحلة 1 — تدقيق وقرار (أسبوع 1)
1. **جرد الـ22 صفحة العالقة:** لكل واحدة عبر URL Inspection: الحالة الدقيقة، Google-selected canonical، هل HTML المزحوف يحوي المحتوى كاملاً (فحص SSR).
2. **مصفوفة قرار لكل صفحة:** يمكن جعلها فريدة بقيمة محلية حقيقية؟ → **حسّن**. لا يمكن؟ → **ادمج** (301 إلى صفحة الخدمة/المدينة الأشمل) أو قسم داخل صفحة أم.
3. **فحص تقني سريع:** canonical واحد self-referential في HTML الأولي لكل صفحة، لا noindex عرضي، لا حجب robots.txt، توحيد www/non-www وslash.

### المرحلة 2 — إعادة البناء (أسابيع 2–4)
4. **حسّن 3–5 صفحات أسبوعياً** وفق قالب القيمة المحلية (القسم 3.4): أحياء + أسعار + صور حقيقية + تقييمات محلية + FAQ محلي (مع schema `LocalBusiness`/`Service` + `FAQPage` صادقة).
5. **أعد بناء الربط الداخلي الهرمي** (القسم 5.3) وتأكد ألا تبقى صفحة يتيمة.
6. **أصلح sitemap.ts:** صفحات canonical فقط، lastmod صادق، أعد الإرسال في GSC.
7. **عزّز E-E-A-T site-wide:** صفحة من نحن، رقم/عنوان، سجل تجاري، ربط Google Business Profile.

### المرحلة 3 — الطلب والمراقبة (من أسبوع 3، مستمر)
8. **Request Indexing** للصفحات المحسّنة فقط، ~10/يوم بالأولوية.
9. **سكربت مراقبة أسبوعي** عبر URL Inspection API (حصة 2000/يوم) يسجل coverageState لكل الصفحات.
10. **KPI:** الهدف الواقعي: من 9 إلى 20+ صفحة مفهرسة خلال 6–10 أسابيع من التحسين الجوهري. إن بقيت صفحة محسّنة غير مفهرسة 6+ أسابيع → أعد تقييم تفردها بصدق أو ادمجها.

---

## المصادر الرسمية (تم التحقق منها جميعاً بالزحف الحي — يوليو 2026)

1. **Page indexing report** — https://support.google.com/webmasters/answer/7440203 (تعريفات Discovered/Crawled/Duplicate الحرفية)
2. **Crawl Budget Management** — https://developers.google.com/crawling/docs/crawl-budget (crawl capacity/demand، perceived inventory، 404/410، lastmod)
3. **Spam policies** — https://developers.google.com/search/docs/essentials/spam-policies (Doorway abuse، Scaled content abuse — نصوص حرفية)
4. **Creating helpful, reliable, people-first content** — https://developers.google.com/search/docs/fundamentals/creating-helpful-content (أسئلة الجودة، E-E-A-T، Who/How/Why، نفي word count)
5. **Consolidate duplicate URLs (Canonicalization)** — https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
6. **Ask Google to recrawl your URLs** — https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
7. **Search Console API Usage Limits** — https://developers.google.com/webmaster-tools/limits (URL Inspection: 2000 QPD / 600 QPM لكل موقع)
8. **Indexing API Quickstart/Quota** — https://developers.google.com/search/apis/indexing-api/v3/quickstart (حصر JobPosting/BroadcastEvent)
9. **Build and submit a sitemap** — https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap (تجاهل priority/changefreq، شرط صدق lastmod)
10. **Localized versions (hreflang)** — https://developers.google.com/search/docs/specialty/international/localized-versions
11. **Make your links crawlable** — https://developers.google.com/search/docs/crawling-indexing/links-crawlable
12. **How Google Search works** — https://developers.google.com/search/docs/fundamentals/how-search-works
13. **Crawling & indexing FAQ** — https://developers.google.com/search/help/crawling-index-faq
14. تصريحات John Mueller (Office Hours / موثقة عبر Search Engine Journal): https://www.searchenginejournal.com/fixing-discovered-currently-not-indexed/491432/ — السببان: server capacity وoverall website quality.

---
*أُعدّ هذا التقرير بالبحث الحي المباشر في المصادر الرسمية أعلاه بتاريخ 2026-07-24. كل الاقتباسات الإنجليزية منقولة حرفياً من صفحات Google الرسمية كما كانت منشورة وقت البحث.*
