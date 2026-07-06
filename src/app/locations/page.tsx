import { Metadata } from "next";
import Link from "next/link";
import { CITIES } from "@/lib/cities";
import { generatePageMetadata } from "@/components/SEO";
import { generateBreadcrumbSchema, generateWebPageSchema } from "@/lib/schema";

const SITE_URL = "https://keifaldiafa.com";

export const metadata: Metadata = generatePageMetadata({
  title: "مناطق خدمات الضيافة — تغطية كل مدن المملكة",
  description:
    "خدمات كيف الضيافة تغطي مدن المملكة: الرياض، جدة، مكة المكرمة، المدينة المنورة، الدمام، الطائف، أبها، ينبع. قهوجيين وصبابين قهوة وتقديمات فاخرة.",
  path: "/locations",
  keywords: ["ضيافة كل مدن السعودية", "خدمات ضيافة المناطق", "ضيافة المملكة"],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
  { name: "المناطق", url: `${SITE_URL}/locations` },
]);
const webPageSchema = generateWebPageSchema({
  name: "مناطق خدمات الضيافة - كيف الضيافة",
  description: "المدن والمناطق التي تغطيها خدمات كيف الضيافة في المملكة",
  url: `${SITE_URL}/locations`,
});

export default function LocationsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <main dir="rtl" className="min-h-screen bg-[#0f0f0f] text-white px-5 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold gold-gradient-text mb-4">
            نغطّي كل مناطق المملكة
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            خدمات كيف الضيافة الفاخرة — قهوجيين وصبابين قهوة سعودية وتقديمات راقية — متاحة في أبرز مدن المملكة. اختر مدينتك لمعرفة التفاصيل.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/locations/${c.slug}`}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition text-center"
              >
                <span className="block text-lg font-semibold text-amber-200">ضيافة {c.name}</span>
                <span className="block text-xs text-gray-400 mt-1">{c.region}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
