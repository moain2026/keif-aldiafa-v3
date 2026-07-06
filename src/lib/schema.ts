// Centralized Schema.org structured data generators

const SITE_URL = "https://keifaldiafa.com";
const SITE_NAME = "كيف الضيافة";
const PHONE = "+966508252134";
const EMAIL = "keifaldiafa@gmail.com";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "Keif Al-Diafa",
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE,
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
      areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    },
    sameAs: [
      "https://www.instagram.com/keifaldiafa",
      `https://wa.me/966508252134`,
    ],
  };
}

export function generateLocalBusinessSchema() {
  // نشاط وطني (Service Area Business) — الخدمة تغطي كل المملكة،
  // لذلك لا نحصر النشاط بإحداثيات مدينة واحدة (كانت الرياض خطأً يحصر الظهور).
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "FoodService"],
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: "Keif Al-Diafa",
    description:
      "خدمات الضيافة الفاخرة في جميع مناطق المملكة العربية السعودية - قهوة سعودية، شاي، تقديمات وفريق احترافي تغطي كل المدن.",
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    image: `${SITE_URL}/icon-512.png`,
    logo: `${SITE_URL}/icon-512.png`,
    // عنوان على مستوى الدولة (بدون حصر بمدينة/إحداثيات)
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "$$$$",
    servesCuisine: "Arabic Hospitality",
    // التغطية الوطنية: المملكة كاملة + أبرز المناطق (تقوّي الظهور في كل مدينة)
    areaServed: [
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "City", name: "الرياض" },
      { "@type": "City", name: "جدة" },
      { "@type": "City", name: "مكة المكرمة" },
      { "@type": "City", name: "المدينة المنورة" },
      { "@type": "City", name: "الدمام" },
      { "@type": "City", name: "ينبع" },
      { "@type": "City", name: "الطائف" },
      { "@type": "City", name: "أبها" },
    ],
    sameAs: [
      "https://www.instagram.com/keifaldiafa",
      `https://wa.me/966508252134`,
    ],
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebPageSchema(page: {
  name: string;
  description: string;
  url: string;
  /** Preferred/representative image for this page (Google: primaryImageOfPage). */
  primaryImage?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": page.url,
    name: page.name,
    description: page.description,
    url: page.url,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: "ar",
  };
  // Google recommends primaryImageOfPage to influence the representative image
  // shown in Search / Google Images / Discover.
  if (page.primaryImage) {
    schema.primaryImageOfPage = {
      "@type": "ImageObject",
      contentUrl: page.primaryImage,
      url: page.primaryImage,
    };
  }
  return schema;
}

/**
 * ImageGallery of ImageObject entries for a page's images.
 * `contentUrl` is REQUIRED by Google for image rich-result / badge eligibility
 * in Google Images. `caption`/`name` provide the descriptive text (this is where
 * captions live now that image:caption was removed from the sitemap spec).
 */
export function generateImageGallerySchema(
  pageUrl: string,
  images: { url: string; alt: string; title?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${pageUrl}#gallery`,
    url: pageUrl,
    inLanguage: "ar",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    associatedMedia: images.map((img) => ({
      "@type": "ImageObject",
      contentUrl: img.url,
      url: img.url,
      name: img.title || img.alt,
      caption: img.alt,
      creditText: SITE_NAME,
      creator: { "@type": "Organization", name: SITE_NAME },
      copyrightNotice: `\u00a9 ${new Date().getFullYear()} ${SITE_NAME}`,
    })),
  };
}

export function generateServiceSchema(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      "@id": `${SITE_URL}/#business`,
    },
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    serviceType: "Hospitality Services",
  };
}

export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: "Keif Al-Diafa",
    url: SITE_URL,
    inLanguage: "ar",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512.png`,
      },
    },
  };
}
