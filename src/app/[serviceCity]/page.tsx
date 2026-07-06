import { Metadata } from "next";
import { notFound } from "next/navigation";
import LocalServicePage from "@/components/LocalServicePage";
import { getLocalContent } from "@/lib/localContent";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateFAQSchema,
  generateWebPageSchema,
} from "@/lib/schema";
import { CITIES, SERVICES, LOCAL_PAGES, localSlug, parseServiceCity } from "@/lib/localPages";

const SITE_URL = "https://keifaldiafa.com";

/** Pre-render every (service × city) page at build time (SSG). */
export function generateStaticParams(): { serviceCity: string }[] {
  return LOCAL_PAGES.map((p) => ({ serviceCity: localSlug(p.service, p.city) }));
}

// Only the generated slugs are valid; anything else → real 404.
export const dynamicParams = false;

interface Props {
  params: { serviceCity: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const parsed = parseServiceCity(decodeURIComponent(params.serviceCity));
  if (!parsed) {
    return generatePageMetadata({ title: "غير موجود", description: "", path: "/", noIndex: true });
  }
  const data = getLocalContent(parsed.service, parsed.city);
  const c = CITIES[parsed.city];
  const s = SERVICES[parsed.service];
  return generatePageMetadata({
    title: data.metaTitle,
    description: data.metaDescription,
    path: `/${localSlug(parsed.service, parsed.city)}`,
    keywords: [
      `${s.ar} ${c.ar}`,
      `صبابين قهوة ${c.ar}`,
      `قهوجي ${c.ar}`,
      `قهوجيين ${c.ar}`,
      `مباشرين قهوة ${c.ar}`,
      `صبابين سعوديين ${c.ar}`,
      `ضيافة ${c.ar}`,
      ...s.synonyms.map((k) => `${k} ${c.ar}`),
    ],
  });
}

export default function Page({ params }: Props) {
  const parsed = parseServiceCity(decodeURIComponent(params.serviceCity));
  if (!parsed) notFound();

  const data = getLocalContent(parsed.service, parsed.city);
  const c = CITIES[parsed.city];
  const s = SERVICES[parsed.service];
  const url = `${SITE_URL}/${localSlug(parsed.service, parsed.city)}`;

  const breadcrumbSchema = generateBreadcrumbSchema(
    data.page.breadcrumbItems.map((b) => ({ name: b.label, url: `${SITE_URL}${b.href}` }))
  );
  const serviceSchema = generateServiceSchema({
    name: `${s.ar} في ${c.ar}`,
    description: data.metaDescription,
    url,
    cityAr: c.ar,
    serviceType: s.ar,
  });
  const faqSchema = generateFAQSchema(data.faqs);
  const webPageSchema = generateWebPageSchema({
    name: data.metaTitle,
    description: data.metaDescription,
    url,
    primaryImage: `${SITE_URL}${data.page.heroImage}`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <LocalServicePage {...data.page} />
    </>
  );
}
