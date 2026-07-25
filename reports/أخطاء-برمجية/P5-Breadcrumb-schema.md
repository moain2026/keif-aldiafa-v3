# ⚙️ خطأ برمجي P5
### مُصلَح ومنشور حي · commit `db140bc` · 2026-07-25

## 5) Breadcrumb schema — "Unnamed item"
- **الملف:** `src/components/Breadcrumbs.tsx`.
- **المشكلة:** العنصر الأخير (الصفحة الحالية) كان يحمل `itemProp="name"` فقط بلا `itemProp="item"` → Google يعتبره **"Unnamed item"** في اختبار النتائج المنسّقة.
- **الحل:** تغليف العنصر الأخير بـ`itemProp="item"` + `itemScope`/`itemType=WebPage` + `itemID` (رابط مطلق)، والاسم داخله بـ`itemProp="name"`.
- ملاحظة: `SITE_URL` كُتب ثابتاً محلياً؛ الاستيراد من `imageCatalog` يفشل البناء لأنه ملف server-side (`node:fs`).
- **تحقّق:** `itemProp="item"` صار على الروابط **والعنصر الأخير**.
- **الملف:** `src/components/Breadcrumbs.tsx`.
- **المشكلة:** العنصر الأخير (الصفحة الحالية) كان يحمل `itemProp="name"` فقط بلا `itemProp="item"` → Google يعتبره **"Unnamed item"** في اختبار النتائج المنسّقة.
- **الحل:** تغليف العنصر الأخير بـ`itemProp="item"` + `itemScope`/`itemType=WebPage` + `itemID` (رابط مطلق)، والاسم داخله بـ`itemProp="name"`.
- ملاحظة: `SITE_URL` كُتب ثابتاً محلياً؛ الاستيراد من `imageCatalog` يفشل البناء لأنه ملف server-side (`node:fs`).
- **تحقّق:** `itemProp="item"` صار على الروابط **والعنصر الأخير**.

## التحقق الشامل
- ✅ البناء نجح: 47 صفحة، First Load JS **87.4KB** (بلا زيادة).
- ✅ مراجعة بصرية على الجوال (390px، لقطة كاملة مقسّمة): "لا توجد أي عيوب بصرية أو نصوص متداخلة أو عناصر مكسورة".
- ✅ خمسة ملفات، +42/-9 سطر — تغييرات جراحية.

## ملاحظة مرصودة (لم تُعدَّل)
`.env.local` المحلي يحتوي `NEXT_PUBLIC_META_PIXEL_ID=xxxxxxxxxxxxxxxx` (placeholder). القيمة الحقيقية تأتي من متغيرات بيئة Vercel — يُتحقق منها على الموقع الحي بعد النشر.


---
## التحقق العام لهذه الدفعة
- ✅ البناء: 47 صفحة، First Load JS 87.4KB (بلا زيادة).
- ✅ مراجعة بصرية على الجوال 390px: لا عيوب بصرية ولا عناصر مكسورة.
- ✅ رُفع باسم MoTechSys ونشرته Vercel، وتُحقّق منه حياً بعد النشر.
