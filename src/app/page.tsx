import { Metadata } from "next";
import { HomePageClient } from "./HomePageClient";
import { HOME_FAQS } from "@/lib/homeFaqs";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/schema";

const SITE_URL = "https://keifaldiafa.com";

export const metadata: Metadata = {
  title: { absolute: "كيف الضيافة | قهوجيين وصبابين قهوة لضيافة فاخرة في السعودية" },
  description:
    "كيف الضيافة - قهوجيين وصبابين قهوة سعودية، صبابات ومباشرات زواجات، وتقديمات راقية لمناسباتكم في كل مناطق المملكة. +500 مناسبة ناجحة.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "كيف الضيافة | قهوجيين وصبابين قهوة لضيافة فاخرة في السعودية",
    description:
      "قهوجيين وصبابين قهوة سعودية، صبابات ومباشرات، وتقديمات راقية لمناسباتكم الفاخرة",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "كيف الضيافة - خدمات الضيافة الفاخرة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "كيف الضيافة | قهوجيين وصبابين قهوة لضيافة فاخرة",
    description: "قهوجيين وصبابين وصبابات لمناسبات فاخرة في المملكة العربية السعودية",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

const faqSchema = generateFAQSchema(HOME_FAQS);

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
]);

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HomePageClient />
    </>
  );
}
