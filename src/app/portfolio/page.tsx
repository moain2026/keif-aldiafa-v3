import { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateImageGallerySchema,
} from "@/lib/schema";
import { getImagesForPage } from "@/lib/imageCatalog";

const SITE_URL = "https://keifaldiafa.com";

export const metadata: Metadata = generatePageMetadata({
  title: "معرض أعمال الضيافة — +500 مناسبة ناجحة",
  description:
    "استعرض أعمالنا السابقة في الضيافة الفاخرة - حفلات زفاف، مؤتمرات، فعاليات حكومية وتجارية. أكثر من 500 مناسبة ناجحة في جميع مناطق المملكة.",
  path: "/portfolio",
  keywords: [
    "معرض أعمال ضيافة",
    "حفلات زفاف",
    "مؤتمرات",
    "فعاليات حكومية",
    "مناسبات فاخرة",
    "ضيافة فعاليات",
  ],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
  { name: "معرض الأعمال", url: `${SITE_URL}/portfolio` },
]);

const portfolioImages = getImagesForPage("/portfolio");

const webPageSchema = generateWebPageSchema({
  name: "معرض الأعمال - كيف الضيافة",
  description:
    "استعرض أعمالنا السابقة في الضيافة الفاخرة - حفلات زفاف ومؤتمرات وفعاليات",
  url: `${SITE_URL}/portfolio`,
  primaryImage: portfolioImages[0]?.url,
});

const imageGallerySchema = generateImageGallerySchema(
  `${SITE_URL}/portfolio`,
  portfolioImages
);

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
      />
      <PortfolioClient />
    </>
  );
}
