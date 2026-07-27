# اللفة 1 — القياس الأساس (Baseline) على البناء الإنتاجي
**إعداد: عالم أبحاث · 2026-07-27**

## منهجية التنفيذ (المادة 9 — قياس إنتاجي فقط)
```
npm ci                                # اعتماديات نظيفة
npx tsc --noEmit                      # → exit 0 (صفر أخطاء TypeScript)
npm run build                         # → 47 صفحة، بناء ناجح بلا أخطاء
PORT=3190 npm run start               # تشغيل إنتاجي
npx lighthouse http://localhost:3190/ --form-factor=mobile --screenEmulation.mobile \
  --throttling-method=simulate --output=json ...   # Chrome headless 151.0.7922.47
```
ملفات JSON الكاملة في هذا المجلد: home-mobile.json · home-desktop.json · contact-mobile.json

## النتائج — الصفحة الرئيسية

| المقياس | موبايل | ديسكتوب | هدف المادة 8 | الحالة |
|---|---|---|---|---|
| Performance | **79** | 96 | ≥85 | 🔴 فجوة 6 نقاط (موبايل) |
| LCP | **4.1s** | 0.8s | ≤2.5s | 🔴 فجوة 1.6s |
| TBT | **310ms** | 30ms | ≤300ms | 🔴 فجوة 10ms (حدّية) |
| CLS | 0 | 0 | ≤0.1 | 🟢 |
| Accessibility | **100** | 100 | =100 | 🟢 (الرئيسية فقط — انظر /contact) |
| SEO | 100 | 100 | — | 🟢 |
| FCP / SI / TTI (موبايل) | 1.0s / 3.3s / 7.6s | — | — | TTI مرتفع |

## تفكيك الأسباب الجذرية (من JSON الفعلي)

### 1) LCP موبايل 4.1s — رغم FCP ممتاز 1.0s
الفجوة FCP→LCP = 3.1s تحدث بعد الرسم الأول → العنصر الأكبر يتأخر (صور hero عبر JS/hydration).
حمل الصفحة الكلي: **74 طلباً / 1.23MB** transfer.

### 2) TBT 310ms + TTI 7.6s — الخيط الرئيسي مشغول 7.2s
| المصدر | Main-thread | Scripting |
|---|---|---|
| chunk 148 (أكبر حزمة Next) | 4104ms | 541ms |
| chunk 117 | 441ms | 423ms |
| googletagmanager (G-ZZHYDVVMT1) | 250ms | 217ms |
- **Script Evaluation إجمالاً: 1589ms** · Style & Layout: 1032ms
- **unused-javascript: توفير ممكن 145KB** — أكبر مصدرين هما وسما GTM (166KB + 154KB transfer، منها 128KB غير مستخدم)

### 3) الخطوط: 12 ملف woff2 = 179KB
12 وجهاً محمّلاً (يطابق ملاحظة preload في STRATEGY-NUMBER-ONE.md — تحققنا منها بأنفسنا). التوصية: الاقتصار على الأوجه المستخدمة فوق الطية.

### 4) Best Practices 77
- third-party-cookies (كوكي GTM/Ads) + inspector-issues — قرار مطلوب من مدير المنتج: هل نؤجل تحميل GTM لما بعد التفاعل؟ (يرفع Perf وBP معاً)

### 5) ⚠️ Accessibility ليست 100 خارج الرئيسية — /contact = 97
فشلان مقيسان (contact-mobile.json):
- **color-contrast**: نصوص بشفافية منخفضة `text-gold-matte/60` و`text-[#F5F5DC]/40` — أقل من 4.5:1 (يكسر أيضاً بند التباين في المادة 8)
- **label-content-name-mismatch**: aria-label لا يطابق النص المرئي في رابط الرئيسية
→ يجب قياس A11y على **كل** الصفحات لا الرئيسية فقط؛ سنُدرجها في زحف اللفة 1.

## خلاصة الفجوات لأهداف المادة 8 (الرئيسية موبايل)
1. LCP 4.1s → ≤2.5s (الفجوة الأكبر — صور hero + خيط رئيسي مشغول)
2. Perf 79 → ≥85 (يتحقق تلقائياً بإصلاح LCP/TBT)
3. TBT 310ms → ≤300ms (GTM deferral + تقسيم chunk 148)
4. A11y 100 على كل الصفحات (حالياً /contact=97: تباين + label mismatch)
5. الخطوط 12→الأوجه الحرجة فقط (−~100KB)

**أثر متوقع مرتب بالأولوية:** (أ) fetchpriority/priority لصورة الـLCP وإزالة تأخير الـhydration عنها · (ب) تأجيل GTM لأول تفاعل · (ج) تقليص الخطوط · (د) إصلاح التباين في التذييل عبر رفع الشفافية إلى ≥/70.
