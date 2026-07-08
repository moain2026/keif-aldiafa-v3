# تصميم LocalBusiness Schema — كيف الضيافة (Service Area Business)

**التاريخ:** 2026-07-08 · **المصادر:** [Google Local Business docs](https://developers.google.com/search/docs/appearance/structured-data/local-business) + Schema.org

---

## 1. خلاصة البحث

| السؤال | النتيجة |
|---|---|
| **SAB بدون عنوان مكشوف** | وثائق جوجل تتطلب `address` لتفعيل النتائج المخصبة، لكن **لا تُلزم بـ`streetAddress`**. أفضل ممارسة موثقة للـSAB: `PostalAddress` بمستوى المدينة/المنطقة/الدولة فقط، بدون شارع — يتطابق مع سياسة Google Business Profile (إخفاء العنوان للـSAB). حذف `streetAddress` يمنع ظهور عنوان خاطئ/منزلي في الخرائط. ✅ مؤكَّد |
| **`serviceArea` vs `areaServed`** | schema.org يصنّف `serviceArea` رسمياً كـ**superseded by `areaServed`** (متجاوَز). `areaServed` هي الخاصية الحديثة والوحيدة الموصى بها. لا حاجة لتكرار البيانات في الاثنتين — نستخدم `areaServed` فقط ونضيف `serviceArea` كمرآة اختيارية للتوافق مع أدوات قديمة (لا ضرر ولا فائدة كبيرة). |
| **`geo` + `hasMap`** | `geo` من الخصائص **الموصى بها** في وثائق جوجل (recommended). للـSAB يُنصح بإحداثيات **قاعدة العمليات** (جدة) — تعطي جوجل إشارة "المقر" دون حصر التغطية، لأن التغطية تُعرَّف بـ`areaServed`. `hasMap` **نتجاهلها**: لا يوجد Google Business Profile برابط خرائط عام، ورابط خريطة لعنوان غير مكشوف يناقض نموذج SAB. |
| **`@type` الأنسب** | `CateringService` — نوع رسمي في schema.org تحت `FoodEstablishment` → `LocalBusiness` → مطابق تماماً لنشاط الضيافة المتنقلة. أما: **`ProfessionalService`** = نوع عام مُهمَل عملياً (schema.org يصفه بأنه legacy عام). **`FoodService`** = ⚠️ **خطأ في الكود الحالي**: هو subclass لـ`Service` وليس `LocalBusiness` أصلاً (يعني "وجبة إفطار/غداء" كخدمة فندقية) — يجب إزالته. |
| **`priceRange`** | `"$$$$"` الحالي يوحي بـ"باهظ جداً" وقد يُنفّر النقرات. الأنسب نطاق ريالي واقعي: `"SAR 500 - SAR 5000"` (جوجل يقبل النطاقات النصية). |

---

## 2. JSON-LD النهائي (جاهز للنسخ)

```json
{
  "@context": "https://schema.org",
  "@type": "CateringService",
  "@id": "https://keifaldiafa.com/#business",
  "name": "كيف الضيافة",
  "alternateName": "Keif Al-Diafa",
  "description": "خدمات ضيافة فاخرة متنقلة في جميع مدن المملكة العربية السعودية — قهوة سعودية، شاي، تقديمات، وفريق ضيافة احترافي يصل إلى موقع مناسبتك. المقر الرئيسي: جدة.",
  "url": "https://keifaldiafa.com",
  "image": "https://keifaldiafa.com/icon-512.png",
  "logo": "https://keifaldiafa.com/icon-512.png",
  "telephone": "+966508252134",
  "email": "keifaldiafa@gmail.com",
  "foundingDate": "2016",
  "founder": { "@type": "Person", "name": "فريق كيف الضيافة" },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "جدة",
    "addressRegion": "منطقة مكة المكرمة",
    "addressCountry": "SA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.4858,
    "longitude": 39.1925
  },
  "areaServed": [
    { "@type": "City", "name": "جدة" },
    { "@type": "City", "name": "الرياض" },
    { "@type": "City", "name": "مكة المكرمة" },
    { "@type": "City", "name": "المدينة المنورة" },
    { "@type": "City", "name": "الدمام" },
    { "@type": "City", "name": "الطائف" },
    { "@type": "City", "name": "أبها" },
    { "@type": "City", "name": "ينبع" },
    { "@type": "Country", "name": "Saudi Arabia" }
  ],
  "serviceArea": [
    { "@type": "City", "name": "جدة" },
    { "@type": "City", "name": "الرياض" },
    { "@type": "City", "name": "مكة المكرمة" },
    { "@type": "City", "name": "المدينة المنورة" },
    { "@type": "City", "name": "الدمام" },
    { "@type": "City", "name": "الطائف" },
    { "@type": "City", "name": "أبها" },
    { "@type": "City", "name": "ينبع" }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "priceRange": "SAR 500 - SAR 5000",
  "servesCuisine": "قهوة سعودية وضيافة عربية",
  "sameAs": [
    "https://www.instagram.com/keifaldiafa",
    "https://wa.me/966508252134"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+966508252134",
    "email": "keifaldiafa@gmail.com",
    "contactType": "customer service",
    "availableLanguage": ["Arabic", "English"],
    "areaServed": "SA"
  }
}
```

---

## 3. قائمة القرارات

1. **`@type: "CateringService"`** (بدل `["ProfessionalService","FoodService"]`): النوع الأدق دلالياً؛ `FoodService` الحالي **ليس LocalBusiness أصلاً** (subclass لـService) وقد يربك الـparsers، و`ProfessionalService` عام ومُهمَل.
2. **إضافة `address` بمستوى المدينة (جدة) بدون `streetAddress`**: `address` خاصية *مطلوبة* عند جوجل للنتائج المخصبة — الكود الحالي (`addressCountry` فقط) ضعيف جداً. مدينة+منطقة+دولة = صيغة SAB الآمنة: تربط النشاط بجدة (المقر الفعلي) دون كشف عنوان.
3. **إضافة `geo` بإحداثيات مركز جدة (21.4858, 39.1925)**: خاصية recommended؛ لا تحصر التغطية (التغطية عبر `areaServed`) لكنها ترسّخ إشارة محلية قوية لجدة — سوق النشاط الأساسي.
4. **جدة أول مدينة في `areaServed`** (كانت الرياض أولاً): الترتيب إشارة أولوية ضمنية.
5. **الإبقاء على `Country: Saudi Arabia` في `areaServed`** للتغطية الوطنية، **مع** المدن الثماني للاستهداف المحلي.
6. **`serviceArea` مرآة اختيارية**: الخاصية superseded رسمياً — يمكن حذفها بلا خسارة؛ أُبقيت للتوافق فقط. *لو أردت الحد الأدنى النظيف: احذفها.*
7. **حذف `hasMap`**: لا رابط خرائط عام للنشاط، وإضافته للـSAB غير منصوح بها.
8. **`priceRange: "SAR 500 - SAR 5000"`**: أوضح وأصدق من `$$$$`.
9. **`foundingDate: "2016"` + `founder`**: إشارات E-E-A-T (خبرة 9+ سنوات).
10. **`contactPoint` داخل الكيان نفسه**: يوحّد بيانات التواصل مع Organization schema.

---

## 4. توصية التنفيذ — `src/lib/schema.ts`

استبدل جسم `generateLocalBusinessSchema()` بالكامل:

```typescript
export function generateLocalBusinessSchema() {
  // Service Area Business: المقر جدة، التغطية كل المملكة.
  // address بمستوى المدينة فقط (بدون streetAddress) حسب أفضل ممارسة جوجل للـSAB.
  const cities = [
    "جدة", "الرياض", "مكة المكرمة", "المدينة المنورة",
    "الدمام", "الطائف", "أبها", "ينبع",
  ].map((name) => ({ "@type": "City" as const, name }));

  return {
    "@context": "https://schema.org",
    "@type": "CateringService",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: "Keif Al-Diafa",
    description:
      "خدمات ضيافة فاخرة متنقلة في جميع مدن المملكة العربية السعودية — قهوة سعودية، شاي، تقديمات، وفريق ضيافة احترافي يصل إلى موقع مناسبتك. المقر الرئيسي: جدة.",
    url: SITE_URL,
    image: `${SITE_URL}/icon-512.png`,
    logo: `${SITE_URL}/icon-512.png`,
    telephone: PHONE,
    email: EMAIL,
    foundingDate: "2016",
    founder: { "@type": "Person", name: "فريق كيف الضيافة" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "جدة",
      addressRegion: "منطقة مكة المكرمة",
      addressCountry: "SA",
    },
    geo: { "@type": "GeoCoordinates", latitude: 21.4858, longitude: 39.1925 },
    areaServed: [...cities, { "@type": "Country", name: "Saudi Arabia" }],
    serviceArea: cities,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "SAR 500 - SAR 5000",
    servesCuisine: "قهوة سعودية وضيافة عربية",
    sameAs: [
      "https://www.instagram.com/keifaldiafa",
      "https://wa.me/966508252134",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE,
      email: EMAIL,
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
      areaServed: "SA",
    },
  };
}
```

**بعد التنفيذ:** تحقّق عبر [Rich Results Test](https://search.google.com/test/rich-results) — النوع المتوقع: LocalBusiness ✅ بدون أخطاء.
