/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://googleads.g.doubleclick.net https://td.doubleclick.net https://connect.facebook.net https://www.facebook.com https://analytics.tiktok.com https://sf16-website-login.neutral.ttwstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // الصور: يحتاج Google Ads/Analytics tracking pixels (تشمل googletagmanager/td لـconversion pixel) + محول Next
      "img-src 'self' data: blob: https://www.google.com https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://td.doubleclick.net https://stats.g.doubleclick.net https://www.facebook.com https://analytics.tiktok.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      // الاتصالات: يحتاج Google Ads (ccm/collect، doubleclick) + Analytics + region GA endpoints
      "connect-src 'self' https://www.google.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://region1.analytics.google.com https://googleads.g.doubleclick.net https://td.doubleclick.net https://ad.doubleclick.net https://stats.g.doubleclick.net https://wa.me https://connect.facebook.net https://www.facebook.com https://analytics.tiktok.com https://mssdk.tiktok.com",
      // Meta Pixel يستخدم iframe للتحقق
      "frame-src 'self' https://www.facebook.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  // Experimental performance features
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ["motion"],
  },

  images: {
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 60, // 60 days
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          {
            key: 'X-Robots-Tag',
            // Index in production by default. Only block indexing for EXPLICIT
            // preview/staging environments. Previously this required
            // VERCEL_ENV==='production', which silently emitted `noindex` on any
            // non-Vercel or custom deployment — hiding the ENTIRE site from Google.
            value:
              process.env.VERCEL_ENV === 'preview' ||
              process.env.NEXT_PUBLIC_NOINDEX === 'true' ||
              process.env.NODE_ENV !== 'production'
                ? 'noindex, nofollow'
                : 'all',
          },
        ],
      },
      {
        source: "/(.*)\\.(jpg|jpeg|png|gif|svg|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // ملاحظة: توحيد www→non-www وروابط WordPress القديمة (?page_id)
      // تتم الآن عبر src/middleware.ts (تجنّب حلقة 308 السابقة).
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
