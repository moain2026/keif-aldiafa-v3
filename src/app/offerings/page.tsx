import { Metadata } from "next";
import OfferingsClient from "./OfferingsClient";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateWebPageSchema,
  generateImageGallerySchema,
} from "@/lib/schema";
import { getImagesForPage } from "@/lib/imageCatalog";

const SITE_URL = "https://keifaldiafa.com";
const offeringsImages = getImagesForPage("/offerings");

export const metadata: Metadata = generatePageMetadata({
  title: "تقديمات ضيافة: قهوة سعودية وشاي وحلويات فاخرة",
  description:
    "أرقى التقديمات والمشروبات - قهوة سعودية أصيلة، شاي فاخر، حلويات شرقية وغربية، تمور فاخرة ومعدات ضيافة للإيجار. جودة لا مثيل لها.",
  path: "/offerings",
  keywords: [
    "قهوة سعودية",
    "شاي فاخر",
    "حلويات",
    "تمور فاخرة",
    "مشروبات باردة",
    "تقديمات مناسبات",
    "ضيافة عربية",
    "معدات ضيافة",
    "سناكات",
    "سندوتشات",
    "فواكه مشكلة",
    "مكسرات",
    "وجبات خفيفة",
  ],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
  { name: "تقديماتنا", url: `${SITE_URL}/offerings` },
]);

const serviceSchema = generateServiceSchema({
  name: "تقديمات الضيافة الفاخرة",
  description:
    "قهوة سعودية أصيلة، شاي فاخر، حلويات شرقية وغربية، تمور فاخرة ومعدات ضيافة",
  url: `${SITE_URL}/offerings`,
});

const webPageSchema = generateWebPageSchema({
  name: "تقديماتنا - كيف الضيافة",
  description:
    "استعرض مجموعة التقديمات الفاخرة من المشروبات والحلويات والتمور",
  url: `${SITE_URL}/offerings`,
  primaryImage: offeringsImages[0]?.url,
});

const imageGallerySchema = generateImageGallerySchema(
  `${SITE_URL}/offerings`,
  offeringsImages
);

export default function OfferingsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
      />
      <OfferingsClient />
    </>
  );
}
