import { Metadata } from "next";
import ServicesClient from "./ServicesClient";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateWebPageSchema,
  generateImageGallerySchema,
} from "@/lib/schema";
import { getImagesForPage } from "@/lib/imageCatalog";

const SITE_URL = "https://keifaldiafa.com";
const servicesImages = getImagesForPage("/services");

export const metadata: Metadata = generatePageMetadata({
  title: "قهوجيين وصبابين قهوة — خدمات ضيافة فاخرة",
  description:
    "قهوجيين وصبابين قهوة سعودية، صبابات ومباشرات زواجات، سقاء زمزم، خدمات فنية وتراثية، ومعدات فاخرة. طاقم بزي فاخر ببروتوكول VIP — تغطية كل مناطق المملكة.",
  path: "/services",
  keywords: [
    "قهوجيين",
    "قهوجي",
    "صبابين قهوة",
    "مباشرين قهوة",
    "صبابات زواجات",
    "سقاء زمزم",
    "خدمات فنية",
    "خطاط",
    "رسام",
    "فرقة شعبية",
    "خيمة تراثية",
    "ضيافة مناسبات",
  ],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
  { name: "خدماتنا", url: `${SITE_URL}/services` },
]);

const serviceSchema = generateServiceSchema({
  name: "قهوجيين وصبابين قهوة وخدمات ضيافة فاخرة",
  description:
    "قهوجيين وصبابين قهوة سعودية، صبابات ومباشرات، سقاء زمزم، خدمات فنية وتراثية، معدات فاخرة",
  url: `${SITE_URL}/services`,
});

const webPageSchema = generateWebPageSchema({
  name: "خدماتنا - كيف الضيافة",
  description:
    "استعرض مجموعة خدمات الضيافة الفاخرة لدينا - مضيفون، قهوة سعودية، خدمات فنية والمزيد",
  url: `${SITE_URL}/services`,
  primaryImage: servicesImages[0]?.url,
});

const imageGallerySchema = generateImageGallerySchema(
  `${SITE_URL}/services`,
  servicesImages
);

export default function ServicesPage() {
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
      <ServicesClient />
    </>
  );
}
