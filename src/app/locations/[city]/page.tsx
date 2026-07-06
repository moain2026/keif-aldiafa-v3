import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CITIES, getCity } from "@/lib/cities";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateWebPageSchema,
  generateFAQSchema,
} from "@/lib/schema";

const SITE_URL = "https://keifaldiafa.com";
const WHATSAPP = "https://wa.me/966508252134";

interface Params {
  params: { city: string };
}

// Pre-render all city pages at build time (SSG).
export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const city = getCity(decodeURIComponent(params.city));
  if (!city) return generatePageMetadata({ title: "غير موجود", description: "", path: "/locations", noIndex: true });

  return generatePageMetadata({
    title: `خدمات الضيافة في ${city.name} — قهوجيين وصبابين قهوة`,
    description: city.intro,
    path: `/locations/${city.slug}`,
    keywords: city.keywords,
  });
}

export default function CityPage({ params }: Params) {
  const city = getCity(decodeURIComponent(params.city));
  if (!city) notFound();

  const url = `${SITE_URL}/locations/${city.slug}`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "الرئيسية", url: SITE_URL },
    { name: "المناطق", url: `${SITE_URL}/locations` },
    { name: city.name, url },
  ]);
  const webPageSchema = generateWebPageSchema({
    name: `خدمات الضيافة في ${city.name}`,
    description: city.intro,
    url,
  });
  const serviceSchema = generateServiceSchema({
    name: `خدمات ضيافة فاخرة في ${city.name}`,
    description: city.body,
    url,
  });
  const faqSchema = generateFAQSchema(city.faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main dir="rtl" className="min-h-screen bg-[#0f0f0f] text-white px-5 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-400 mb-6" aria-label="breadcrumb">
            <Link href="/" className="hover:text-white">الرئيسية</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">خدمات الضيافة في {city.name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold gold-gradient-text mb-4">
            خدمات الضيافة الفاخرة في {city.name}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">{city.intro}</p>
          <p className="text-gray-400 leading-relaxed mb-8">{city.body}</p>

          <h2 className="text-2xl font-semibold mb-4 text-amber-300/90">لماذا نخدم {city.region}؟</h2>
          <ul className="space-y-3 mb-10">
            {city.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-gray-300">
                <span className="text-amber-400 mt-1">◆</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 mb-14">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 rounded-full bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
            >
              احجز ضيافتك في {city.name}
            </a>
            <Link
              href="/services"
              className="px-7 py-3 rounded-full border border-amber-400/40 text-amber-200 hover:bg-amber-400/10 transition"
            >
              تصفّح خدماتنا
            </Link>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-amber-300/90">أسئلة شائعة — {city.name}</h2>
          <div className="space-y-6 mb-14">
            {city.faqs.map((f) => (
              <div key={f.question}>
                <h3 className="font-semibold text-white mb-2">{f.question}</h3>
                <p className="text-gray-400 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">مناطق أخرى نغطّيها</h2>
            <div className="flex flex-wrap gap-3">
              {CITIES.filter((c) => c.slug !== city.slug).map((c) => (
                <Link
                  key={c.slug}
                  href={`/locations/${c.slug}`}
                  className="text-sm px-4 py-2 rounded-full bg-white/5 text-gray-300 hover:bg-white/10 transition"
                >
                  ضيافة {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
