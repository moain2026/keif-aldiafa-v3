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

const GA_MEASUREMENT_ID = "G-ZZHYDVVMT1";
const GOOGLE_ADS_ID = "AW-11081441847";

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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
          gtag('config', '${GOOGLE_ADS_ID}');
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
