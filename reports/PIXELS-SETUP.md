# إعداد Meta Pixel + TikTok Pixel — keifaldiafa.com

**التاريخ:** 2026-07-08
**الحالة:** الكود جاهز ✅ — بانتظار وضع الـIDs الفعلية في Vercel

## ما تم عمله

- أُضيف Meta Pixel (fbq) و TikTok Pixel (ttq) في `src/components/GoogleAnalytics.tsx` بالأكواد الرسمية عبر Next.js `<Script strategy="afterInteractive">`.
- **كلاهما مشروط بمتغير بيئة** — لا يُحمَّل أي سكربت حتى تُضاف القيمة. GA4 وGoogle Ads لم يُمسّا ويعملان كالمعتاد.
- وُسِّع CSP في `next.config.js` (script-src / img-src / connect-src / frame-src) لنطاقات Meta وTikTok.
- أُنشئ `.env.local.example` كمرجع لأسماء المتغيرات.

## 1) الحصول على Meta Pixel ID

1. ادخل [Meta Business Suite](https://business.facebook.com/) → **All Tools → Events Manager**.
2. **Connect Data Sources → Web → Meta Pixel** (أو استخدم Pixel موجود).
3. سمِّه (مثلاً "Keif Aldiafa") وأدخل `keifaldiafa.com`.
4. انسخ **Pixel ID** (رقم ~15-16 خانة) من أعلى صفحة الـPixel في Events Manager.

## 2) الحصول على TikTok Pixel ID

1. ادخل [TikTok Ads Manager](https://ads.tiktok.com/) → **Assets → Events**.
2. تحت **Web Events** اضغط **Manage → Create Pixel**.
3. اختر **Manually Install Pixel Code** (لأن الكود مثبّت عندنا مسبقاً).
4. انسخ **Pixel ID** (يظهر أعلى الصفحة، حروف/أرقام ~20 خانة مثل `C1234ABCDEFGHIJKLMNO`).

## 3) الإضافة في Vercel

1. Vercel → مشروع keifaldiafa → **Settings → Environment Variables**.
2. أضف:
   | Name | Value | Environments |
   |------|-------|--------------|
   | `NEXT_PUBLIC_META_PIXEL_ID` | (Pixel ID من Meta) | Production |
   | `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | (Pixel ID من TikTok) | Production |
3. **مهم:** متغيرات `NEXT_PUBLIC_*` تُدمَج وقت البيلد — يلزم **Redeploy** بعد إضافتها (Deployments → ⋯ → Redeploy).
4. (اختياري) للتجربة محلياً: انسخ `.env.local.example` إلى `.env.local` وضع القيم.

## 4) التحقق من عمل البكسلات

### Meta
- ثبّت إضافة كروم [Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc).
- افتح `keifaldiafa.com` → يجب أن تظهر الإضافة الـPixel ID مع حدث **PageView** ✅.
- أو من Events Manager → **Test Events** وأدخل رابط الموقع.

### TikTok
- ثبّت إضافة [TikTok Pixel Helper](https://chromewebstore.google.com/detail/tiktok-pixel-helper/aelgobmabdmlfmiblddjfnjodalhidnn).
- افتح الموقع → يجب أن يظهر الـPixel مع حدث **Pageview** ✅.
- أو من Ads Manager → Events → الـPixel → **Test Events**.

### تحقق سريع من الطرفية (بعد الـRedeploy)
```bash
curl -s https://keifaldiafa.com | grep -o 'fbq\|ttq' | sort -u
# يجب أن يُخرج: fbq و ttq
```

## ملاحظات

- بدون الـIDs الموقع يعمل تماماً كما كان — صفر تغيير في السلوك.
- لاحقاً يمكن إضافة أحداث تحويل (Lead / Contact عند ضغط زر واتساب) بـ`fbq('track','Lead')` و`ttq.track('Contact')` — قل لي متى تريدها.
