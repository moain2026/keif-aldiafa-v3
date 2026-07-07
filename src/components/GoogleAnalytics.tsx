import Script from "next/script";

/**
 * Google gtag.js — علامة موحّدة تخدم:
 *   • Google Analytics 4 — G-ZZHYDVVMT1 (التحليلات)
 *   • Google Ads       — AW-3412658939 (تتبّع التحويلات والإعلانات)
 *
 * تمّ دمج معرّف Google Ads (Customer ID: 341-265-8939) بصيغة AW-
 * حتى يرفع خطأ «لا تتوفر علامة تتبّع من Google» في حملات Ads
 * وتعمل الحملة بشكل طبيعي. sript واحد (gtag.js) يخدم الاثنين معاً.
 *
 * يُحمّل بعد تفاعل الصفحة (afterInteractive) لحماية Core Web Vitals.
 * الـ CSP في next.config.js يسمح بنطاقات جوجل.
 */

const GA_MEASUREMENT_ID = "G-ZZHYDVVMT1";
const GOOGLE_ADS_ID = "AW-3412658939";

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
    </>
  );
}
