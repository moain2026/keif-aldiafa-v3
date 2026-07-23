import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProtectedImage from "@/components/ProtectedImage";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CITIES, getCity } from "@/lib/cities";
import { CITIES as SC_CITIES, SERVICES as SC_SERVICES, localSlug } from "@/lib/localPages";
import { getAllImages } from "@/lib/imageCatalog";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateWebPageSchema,
  generateFAQSchema,
  generateImageGallerySchema,
} from "@/lib/schema";

const SITE_URL = "https://keifaldiafa.com";
const WHATSAPP = "https://wa.me/966508252134?text=";

interface Params {
  params: { city: string };
}

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const city = getCity(decodeURIComponent(params.city));
  if (!city)
    return generatePageMetadata({ title: "غير موجود", description: "", path: "/locations", noIndex: true });

  return generatePageMetadata({
    title: `ضيافة فاخرة في ${city.name} — خبرة +500 مناسبة`,
    description: `✓ خبرة +500 مناسبة ✓ طاقم سعودي محترف ✓ تغطية كل أحياء ${city.name}. قهوجيين وصبابين قهوة وتجهيز ضيافة متكامل. عرض سعر مجاني — واتساب 0508252134`,
    path: `/locations/${city.slug}`,
    keywords: city.keywords,
  });
}

/**
 * اختيار صور مناسبة لكل مدينة من كتالوج الصور الحقيقي (deterministic حسب المدينة
 * حتى تختلف الصور بين المدن لكنها ثابتة لكل مدينة). فئات فاخرة: فعاليات/أعراس/
 * خدمات/توزيعات. كل الصور تُعرض بمكوّن ProtectedImage مع العلامة المائية.
 */
function cityImages(seed: number) {
  const cats = ["events", "weddings", "services", "distributions"];
  const all = getAllImages().filter((im) => cats.includes(im.category));
  const pool = all.length >= 12 ? all : getAllImages();
  const start = (seed * 5) % Math.max(pool.length, 1);
  const pick = (i: number) => pool[(start + i * 3) % pool.length];
  return {
    hero: pick(0),
    s1: pick(1),
    s2: pick(2),
    gallery: [pick(3), pick(4), pick(5), pick(6), pick(7), pick(8)],
  };
}

export default function CityPage({ params }: Params) {
  const city = getCity(decodeURIComponent(params.city));
  if (!city) notFound();

  const url = `${SITE_URL}/locations/${city.slug}`;
  const imgs = cityImages(city.name.length + city.slug.length);
  const wa = (msg: string) => `${WHATSAPP}${encodeURIComponent(msg)}`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "الرئيسية", url: SITE_URL },
    { name: "المناطق", url: `${SITE_URL}/locations` },
    { name: city.name, url },
  ]);
  const webPageSchema = generateWebPageSchema({
    name: `خدمات الضيافة في ${city.name}`,
    description: city.intro,
    url,
    primaryImage: `${SITE_URL}${imgs.hero.src}`,
  });
  const serviceSchema = generateServiceSchema({
    name: `خدمات ضيافة فاخرة في ${city.name}`,
    description: city.body,
    url,
    cityAr: city.name,
    serviceType: "خدمات الضيافة",
  });
  const faqSchema = generateFAQSchema(city.faqs);
  const gallerySchema = generateImageGallerySchema(
    url,
    imgs.gallery.map((g, i) => ({
      url: `${SITE_URL}${g.src}`,
      alt: `من أعمال كيف الضيافة في ${city.name} (${i + 1})`,
    }))
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }} />

      <main dir="rtl" className="bg-[#0f0f0f] text-[#F5F5DC]">
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <ProtectedImage
              src={imgs.hero.src}
              alt={`خدمات الضيافة الفاخرة في ${city.name} — كيف الضيافة`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/65" />
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(197,160,89,0.14) 0%, transparent 60%)" }}
            />
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-16 sm:py-24">
            <nav className="text-xs text-[#F5F5DC]/55 mb-5" aria-label="breadcrumb">
              <Link href="/" className="hover:text-[#F5F5DC]">الرئيسية</Link>
              <span className="mx-2">/</span>
              <Link href="/locations" className="hover:text-[#F5F5DC]">المناطق</Link>
              <span className="mx-2">/</span>
              <span className="text-[#F5F5DC]/85">{city.name}</span>
            </nav>
            <RevealOnScroll as="h1" immediate className="gold-gradient-text font-tajawal text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-5">
              خدمات الضيافة الفاخرة في {city.name}
            </RevealOnScroll>
            <p className="text-[#F5F5DC]/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">{city.intro}</p>
            <div className="mt-8 flex flex-row items-center justify-center gap-3 sm:gap-4">
              <a href={wa(`مرحباً، أرغب بالاستفسار عن خدمات الضيافة في ${city.name}.`)} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none px-5 sm:px-10 py-4 rounded-full bg-[#C5A059] text-[#0f0f0f] font-bold hover:brightness-110 transition text-center whitespace-nowrap text-sm">
                احجز ضيافتك في {city.name}
              </a>
              <Link href="/services" className="flex-1 sm:flex-none px-5 sm:px-10 py-4 rounded-full border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/10 transition text-center whitespace-nowrap text-sm">
                تصفّح خدماتنا
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
          {/* Intro section with image */}
          <RevealOnScroll as="section" className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-[#C5A059] font-tajawal text-2xl sm:text-3xl font-bold mb-4">
                ضيافة تليق بمناسبات {city.name}
              </h2>
              <p className="text-[#F5F5DC]/80 leading-loose">{city.body}</p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#C5A059]/15">
              <ProtectedImage src={imgs.s1.src} alt={`ضيافة فاخرة في ${city.name}`} fill showWatermark sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
            </div>
          </RevealOnScroll>

          {/* Why us + image */}
          <RevealOnScroll as="section" className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#C5A059]/15 md:order-1">
              <ProtectedImage src={imgs.s2.src} alt={`قهوجيين وصبابين قهوة في ${city.name}`} fill showWatermark sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="md:order-2">
              <h2 className="text-[#C5A059] font-tajawal text-2xl sm:text-3xl font-bold mb-4">لماذا نخدم {city.region}؟</h2>
              <ul className="space-y-3">
                {city.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-[#F5F5DC]/80 leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C5A059] flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          {/* Gallery — أنيق بنسبة موحّدة ومساحات تنفّس (معايير عالمية) + علامة مائية ركنية */}
          <RevealOnScroll as="section">
            <h2 className="text-[#C5A059] font-tajawal text-2xl sm:text-3xl font-bold mb-8 text-center">
              من أعمالنا في {city.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {imgs.gallery.map((g, i) => (
                <div
                  key={i}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#C5A059]/15 shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition-transform duration-500 hover:-translate-y-1"
                >
                  <ProtectedImage
                    src={g.src}
                    alt={`من أعمال كيف الضيافة في ${city.name} — لقطة ${i + 1}`}
                    fill
                    showWatermark
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* FAQ */}
          <RevealOnScroll as="section">
            <h2 className="text-[#C5A059] font-tajawal text-2xl sm:text-3xl font-bold mb-6">أسئلة شائعة — {city.name}</h2>
            <div className="space-y-6">
              {city.faqs.map((f) => (
                <div key={f.question}>
                  <h3 className="font-semibold text-[#F5F5DC] mb-2">{f.question}</h3>
                  <p className="text-[#F5F5DC]/70 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* CTA */}
          <RevealOnScroll as="section" className="text-center rounded-2xl p-10 bg-[#1a1a1a] border border-[#C5A059]/20">
            <h2 className="text-[#F5F5DC] font-tajawal text-2xl font-bold mb-3">جاهزون لخدمة مناسبتك في {city.name}</h2>
            <p className="text-[#F5F5DC]/70 mb-6">تواصل معنا الآن لعرض سعر مجاني ومخصّص.</p>
            <a href={wa(`مرحباً، أرغب بحجز ضيافة في ${city.name}.`)} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 rounded-full bg-[#C5A059] text-[#0f0f0f] font-bold hover:brightness-110 transition">
              احجز عبر واتساب
            </a>
          </RevealOnScroll>

          {/* روابط داخلية لصفحات الخدمة×المدينة (يربط صفحات المال — مهم للسيو) */}
          {(() => {
            const scKey = Object.keys(SC_CITIES).find((k) => SC_CITIES[k].ar === city.name);
            if (!scKey) return null;
            return (
              <RevealOnScroll as="section">
                <h2 className="text-[#C5A059] font-tajawal text-2xl sm:text-3xl font-bold mb-6">خدماتنا في {city.name}</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {Object.keys(SC_SERVICES).map((svc) => (
                    <Link
                      key={svc}
                      href={`/${localSlug(svc, scKey)}`}
                      className="block rounded-2xl p-5 bg-[#1a1a1a] border border-[#C5A059]/15 hover:border-[#C5A059]/40 transition group"
                    >
                      <span className="block text-[#F5F5DC] font-tajawal font-bold mb-1 group-hover:text-[#C5A059] transition">{SC_SERVICES[svc].ar} في {city.name}</span>
                      <span className="block text-[#F5F5DC]/55 text-xs leading-relaxed">{SC_SERVICES[svc].short}</span>
                    </Link>
                  ))}
                </div>
              </RevealOnScroll>
            );
          })()}

          {/* Other cities */}
          <section className="border-t border-white/10 pt-8">
            <h2 className="text-lg font-semibold mb-4 text-[#F5F5DC]/80">مناطق أخرى نغطّيها</h2>
            <div className="flex flex-wrap gap-3">
              {CITIES.filter((c) => c.slug !== city.slug).map((c) => (
                <Link key={c.slug} href={`/locations/${c.slug}`} className="text-sm px-4 py-2 rounded-full bg-white/5 text-[#F5F5DC]/75 hover:bg-white/10 transition">
                  ضيافة {c.name}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
