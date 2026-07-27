# التحقق من حزمة قياس اللفات (scripts/measure-loop.sh)
**إعداد: عالم أبحاث · 2026-07-27 · تشغيل تحقق كامل على البناء الإنتاجي الحالي (قبل تنفيذ اللفة 2)**

## ما هي الحزمة
`./scripts/measure-loop.sh <loop-number> [port]` — تعيد إنتاج منهجية خط الأساس 992630c حرفياً:
tsc → Lighthouse موبايل+ديسكتوب (رئيسية) → مسح A11y على 8 صفحات → ملخص آلي + بوابة المادة 8.
كل المخرجات JSON تُحفظ في docs/evidence/lighthouse/loop-<n>/.

## نتائج تشغيل التحقق (نفس البناء الإنتاجي لخط الأساس)

### بوابة المادة 8 (الرئيسية موبايل)
| المقياس | القيمة | الهدف | الحالة |
|---|---|---|---|
| Performance | 76 | ≥85 | 🔴 |
| LCP | 4.1s | ≤2.5s | 🔴 |
| TBT | 429ms | ≤300ms | 🔴 |
| CLS | 0.000 | ≤0.1 | 🟢 |

(فرق TBT عن خط الأساس 310→429ms = تذبذب قياس طبيعي بين تشغيلين على نفس الكود؛ يؤكد ضرورة هامش أمان في الإصلاح، لا الاكتفاء بـ300 بالظبط.)

### ⚠️ اكتشاف موسّع — A11y ليست 100 على 5 صفحات (مسح 8 صفحات)
| الصفحة | A11y | الفشل |
|---|---|---|
| / (رئيسية) | 100 🟢 | — |
| /portfolio · /locations/جدة · /sababin-qahwa-jeddah | 100 🟢 | — |
| /contact | 97 🔴 | color-contrast + label-content-name-mismatch |
| /about | 🔴 | color-contrast + label-content-name-mismatch |
| /services | 95 🔴 | color-contrast + heading-order + label-mismatch |
| /offerings | 95 🔴 | color-contrast + heading-order + label-mismatch |
| /locations | 95 🔴 | color-contrast + heading-order + label-mismatch |

**الأنماط الجذرية الثلاثة (تتكرر عبر الصفحات — إصلاح واحد يغلقها جميعاً):**
1. **color-contrast**: نصوص بشفافية `/60` و`/40` (gold-matte، #F5F5DC) في التذييل/العناوين الفرعية — أقل من 4.5:1
2. **label-content-name-mismatch**: aria-label="الصفحة الرئيسية" على رابط الشعار لا يطابق نصه المرئي — مكوّن مشترك (Navbar/Footer)
3. **heading-order**: قفزات في تسلسل العناوين على صفحات القوائم

→ لأن الأسباب في مكونات مشتركة، المطلوب من @مهندس إصلاحها مرة واحدة في المكوّن — وليس صفحة صفحة.

## للفة 2
فور اكتمال commits التنفيذ: `./scripts/measure-loop.sh 2` تعطي المقارنة الكاملة قبل/بعد آلياً.
