import { Metadata } from "next";
import { HomePageClient } from "./HomePageClient";

import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import { HOME_FAQS } from "@/lib/homeFaqs";

const SITE_URL = "https://keifaldiafa.com";

export const metadata: Metadata = {
  title: { absolute: "كيف الضيافة | قهوجيين وصبابين قهوة لضيافة فاخرة في السعودية" },
  description:
    "كيف الضيافة - قهوجيين وصبابين قهوة سعودية، صبابات ومباشرات زواجات، وتقديمات راقية لمناسباتكم في كل مناطق المملكة. +500 مناسبة ناجحة.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    // مهم: metadata في الصفحة **يستبدل** كامل openGraph من layout ولا يدمجه،
    // لذا يجب إعادة تعريف type/siteName/locale هنا وإلا سقطت من HTML
    // (أداة تصحيح مشاركة فيسبوك تعدّ og:type أصلاً مطلوباً).
    type: "website",
    siteName: "كيف الضيافة",
    locale: "ar_SA",
    title: "كيف الضيافة | قهوجيين وصبابين قهوة لضيافة فاخرة في السعودية",
    description:
      "قهوجيين وصبابين قهوة سعودية، صبابات ومباشرات، وتقديمات راقية لمناسباتكم الفاخرة",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-cover-v2.jpg`,
        width: 1200,
        height: 630,
        alt: "كيف الضيافة - خدمات الضيافة الفاخرة",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "كيف الضيافة | قهوجيين وصبابين قهوة لضيافة فاخرة",
    description: "قهوجيين وصبابين وصبابات لمناسبات فاخرة في المملكة العربية السعودية",
    images: [`${SITE_URL}/og-cover-v2.jpg`],
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
]);

// FAQPage schema — يطابق الأسئلة المرئية في HomePageClient.
// ملاحظة: FAQ rich results ألغتها Google (مايو 2026)، لكن الـschema لا يزال يفيد
// فهم المحتوى + AI Overviews (يقتبس من الأسئلة المهيكلة) — غير ضار.
const faqSchema = generateFAQSchema(HOME_FAQS);

export default function HomePage() {
  return (
    <>
      {/* ملاحظة: لا preload يدوي للهيرو — مكوّن next/image بـpriority في HomePageClient
          يولّد preload تلقائياً مع srcset مستجيب. إضافة preload يدوي هنا كانت
          تُحمّل الصورة مرتين (هدر نطاق على الجوال). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePageClient />
    </>
  );
}
