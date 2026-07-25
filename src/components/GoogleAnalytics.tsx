import Script from "next/script";

/**
 * Google gtag.js — علامة موحّدة تخدم:
 *   • Google Analytics 4 — G-ZZHYDVVMT1 (التحليلات)
 *   • Google Ads       — AW-11081441847 (تتبّع التحويلات والإعلانات)
 *   • Google Tag       — GT-NMLD8SD5 (معرّف العلامة الموحّدة للحساب)
 *
 * ✅ مصحح 2026-07-13: الرقم الصحيح لحساب العميل هو AW-11081441847
 * (مؤكّد من Google Ads → Google Tag)؛ الرقم السابق AW-3412658939 كان خاطئاً
 * (مستخرج خطأً من Customer ID) وتسبّب في خطأ «لا تتوفر علامة تتبّع».
 *
 * يُحمّل بعد تفاعل الصفحة (afterInteractive) لحماية Core Web Vitals.
 * الـ CSP في next.config.js يسمح بنطاقات جوجل.
 */

// GA4 (G-ZZHYDVVMT1) + gtag config محقونان مباشرة في <head> بـlayout.tsx.
const GOOGLE_ADS_ID = "AW-11081441847";

/**
 * Conversion Labels — تُضاف من Google Ads (Goals → Conversions → New → Website → Click).
 * الصيغة الرسمية تشترط send_to: 'AW-XXXX/LABEL' — بدون label لا يُسجّل التحويل.
 * تُضبط في Vercel Environment Variables بعد إنشاء إجراءات التحويل؛ تركُ فارغة يُرسل حدثاً عاماً للقياس فقط.
 *   NEXT_PUBLIC_GADS_LABEL_WHATSAPP  → label إجراء تحويل «تواصل واتساب»
 *   NEXT_PUBLIC_GADS_LABEL_CALL      → label إجراء تحويل «اتصال»
 */
// label إجراء تحويل «واتساب» المؤكّد من Google Ads (Conversion «واتساب»).
// يُمكن تجاوزه عبر ENV عند الحاجة.
const GADS_LABEL_WHATSAPP =
  process.env.NEXT_PUBLIC_GADS_LABEL_WHATSAPP || "NIEKCOWDzPYYELfEhaQp";
// label إجراء التحويل «الاتصال» — مأخوذ من Google Ads (2026-07-25).
// الإجراء: «الاتصال» · ctId=6687515233 · أُنشئ 2023/11/8 · المصدر: الموقع الإلكتروني.
// ⚠️ تصحيح: الرمز الأول (pN9CDgzb6YNupNBWGX3wzQ) كان استنتاجاً من شيفرة الصفحة
// وليس من صفحة الإجراء نفسها ⇒ استُبدل بالرمز الصحيح المقروء من صفحة إجراء
// «الاتصال» مباشرة، ويطابق منهجاً مُختبراً: صفحة إجراء واتساب (ctId 6691160549)
// أعادت بنفس الطريقة الرمز المنشور والعامل NIEKCOWDzPYYELfEhaQp.
// كان فارغاً ⇒ الشرط `if (label)` يفشل ⇒ **كل نقرات زر «اتصل» لا تُسجّل إطلاقاً**
// في Google Ads (بينما واتساب يعمل)، فتتعلم الخوارزمية من نصف البيانات فقط.
const GADS_LABEL_CALL =
  process.env.NEXT_PUBLIC_GADS_LABEL_CALL || "Xq_gCOHE7fQYELfEhaQp";

/**
 * Meta Pixel + TikTok Pixel — مشروطة بمتغيرات البيئة.
 * لن تُحمَّل هذه السكربتات إطلاقاً حتى تُضاف القيم في .env.local أو Vercel:
 *   NEXT_PUBLIC_META_PIXEL_ID   → من Meta Business Suite (Events Manager)
 *   NEXT_PUBLIC_TIKTOK_PIXEL_ID → من TikTok Ads Manager (Assets → Events)
 * راجع reports/PIXELS-SETUP.md للتفاصيل.
 */
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

export default function GoogleAnalytics() {
  return (
    <>
      {/* ملاحظة: gtag.js الأساسي + config (GA4 + Ads) محقونان مباشرة في <head> بـlayout.tsx
          (لضمان اكتشاف Google الآلي). هنا فقط: تتبّع التحويلات + Pixels. */}

      {/* تتبّع التحويلات: أي نقرة على رابط واتساب (wa.me) أو اتصال (tel:)
          تُطلق حدث conversion لـGoogle Ads + GA4 + Meta + TikTok تلقائياً.
          مستمع عام (event delegation) — يغطّي كل الأزرار في الموقع دون تعديل كل زر. */}
      <Script id="conversion-tracking" strategy="afterInteractive">
        {`
          (function () {
            var GADS = '${GOOGLE_ADS_ID}';
            var LBL_WA = '${GADS_LABEL_WHATSAPP}';
            var LBL_CALL = '${GADS_LABEL_CALL}';
            function fireConversion(kind) {
              try {
                if (typeof gtag === 'function') {
                  // Google Ads conversion — مع conversion label إن وُجد (الصيغة الرسمية: AW-XXXX/LABEL)
                  var label = kind === 'call' ? LBL_CALL : LBL_WA;
                  if (label) {
                    gtag('event', 'conversion', { send_to: GADS + '/' + label });
                  }
                  // GA4: generate_lead (الحدث الموصى به رسمياً) + حدث وصفي
                  gtag('event', 'generate_lead', { method: kind, currency: 'SAR' });
                  gtag('event', kind === 'call' ? 'contact_call' : 'contact_whatsapp', { method: kind });
                }
                if (typeof fbq === 'function') { fbq('track', 'Lead', { method: kind }); }
                if (typeof ttq !== 'undefined' && ttq.track) { ttq.track('Contact', { method: kind }); }
              } catch (e) {}
            }
            document.addEventListener('click', function (ev) {
              var el = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
              if (!el) return;
              var href = el.getAttribute('href') || '';
              if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) {
                fireConversion('whatsapp');
              } else if (href.indexOf('tel:') === 0) {
                fireConversion('call');
              }
            }, { capture: true });
          })();
        `}
      </Script>

      {/* Meta Pixel (Facebook/Instagram) — الكود الرسمي من Meta */}
      {META_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {/* TikTok Pixel — الكود الرسمي من TikTok */}
      {TIKTOK_PIXEL_ID && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
            var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
            ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

              ttq.load('${TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}
    </>
  );
}
