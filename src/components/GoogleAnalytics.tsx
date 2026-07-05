import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js)
 * Measurement ID: G-ZZHYDVVMT1
 *
 * يُحمّل بعد تفاعل الصفحة (afterInteractive) حتى لا يؤثر على سرعة التحميل
 * ولا على Core Web Vitals. الـ CSP في next.config.js يسمح بنطاقات جوجل.
 */

const GA_MEASUREMENT_ID = "G-ZZHYDVVMT1";

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
        `}
      </Script>
    </>
  );
}
