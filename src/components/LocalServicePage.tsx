/**
 * مكوّن مشترك لصفحات الخدمات المحلية (خدمة × مدينة) — كيف الضيافة.
 * محتوى عربي غني (H1 + مقدمة + أقسام بصور + أحياء + باقات + لماذا نحن + معرض + FAQ + CTA)
 * بهوية كيف البصرية (gold-matte / gold-gradient-text / font-tajawal / خلفية #0f0f0f).
 *
 * Server Component: كل المحتوى SSR (مرئي لـ Googlebot). الحركة فقط عبر RevealOnScroll
 * (leaf client) والمحتوى دائماً موجود في HTML.
 */

import Image from "next/image";
import Link from "next/link";
import ProtectedImage from "@/components/ProtectedImage";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const WA = "966508252134";
const WA_DISPLAY = "0508252134";

export type Package = { name: string; desc: string; features: string[] };
export type FAQ = { question: string; answer: string };

export interface LocalServicePageProps {
  h1: string;
  cityAr: string;
  serviceAr: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  sections: { h2: string; body: string; img?: string; imgAlt?: string }[];
  districts: string[];
  packages: Package[];
  pricingNote: string;
  whyUs: string[];
  faqs: FAQ[];
  gallery: { src: string; alt: string }[];
  otherCities: { label: string; href: string }[];
  breadcrumbItems: { label: string; href: string }[];
}

export default function LocalServicePage(props: LocalServicePageProps) {
  const wa = `https://wa.me/${WA}?text=${encodeURIComponent(
    `مرحباً، أرغب بالاستفسار عن خدمة ${props.serviceAr} في ${props.cityAr}.`
  )}`;

  return (
    <main className="bg-[#0f0f0f] text-[#F5F5DC]" dir="rtl">
      {/* Hero */}
      <section className="relative min-h-[62vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={props.heroImage}
            alt={props.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(197,160,89,0.12) 0%, transparent 60%)" }}
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-14 sm:py-20">
          <nav className="text-xs text-[#F5F5DC]/50 mb-5" aria-label="breadcrumb">
            {props.breadcrumbItems.map((b, i) => (
              <span key={b.href}>
                {i > 0 && <span className="mx-2">/</span>}
                {i < props.breadcrumbItems.length - 1 ? (
                  <Link href={b.href} className="hover:text-[#F5F5DC]">{b.label}</Link>
                ) : (
                  <span className="text-[#F5F5DC]/80">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
          <RevealOnScroll as="h1" immediate className="gold-gradient-text font-tajawal text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-5">
            {props.h1}
          </RevealOnScroll>
          <p className="text-[#F5F5DC]/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {props.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="px-7 py-3 rounded-full bg-[#C5A059] text-[#0f0f0f] font-bold hover:brightness-110 transition">
              احجز عبر واتساب
            </a>
            <a href={`tel:+966${WA_DISPLAY.replace(/^0/, "")}`} className="px-7 py-3 rounded-full border border-[#C5A059]/40 text-[#F5F5DC] hover:bg-[#C5A059]/10 transition">
              اتصل: {WA_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        {/* Sections with alternating images */}
        {props.sections.map((s, i) => (
          <RevealOnScroll key={i} as="section" className="grid md:grid-cols-2 gap-8 items-center">
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <h2 className="text-[#C5A059] font-tajawal text-2xl sm:text-3xl font-bold mb-4">{s.h2}</h2>
              <p className="text-[#F5F5DC]/80 leading-loose whitespace-pre-line">{s.body}</p>
            </div>
            {s.img && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#C5A059]/15">
                <ProtectedImage src={s.img} alt={s.imgAlt || s.h2} fill showWatermark sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
            )}
          </RevealOnScroll>
        ))}

        {/* Districts */}
        <RevealOnScroll as="section">
          <h2 className="text-[#C5A059] font-tajawal text-2xl sm:text-3xl font-bold mb-4">
            الأحياء والمناطق التي نخدمها في {props.cityAr}
          </h2>
          <p className="text-[#F5F5DC]/80 leading-loose mb-4">
            نصل إليك أينما كنت في {props.cityAr} وما حولها، ومن أبرز المناطق التي نخدمها:
          </p>
          <div className="flex flex-wrap gap-2">
            {props.districts.map((d) => (
              <span key={d} className="px-3 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#F5F5DC]/85 text-sm">
                {d}
              </span>
            ))}
          </div>
        </RevealOnScroll>

        {/* Packages */}
        <RevealOnScroll as="section">
          <h2 className="text-[#C5A059] font-tajawal text-2xl sm:text-3xl font-bold mb-6">
            باقات {props.serviceAr} في {props.cityAr}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {props.packages.map((p) => (
              <div key={p.name} className="rounded-2xl p-6 bg-[#1a1a1a] border border-[#C5A059]/15">
                <h3 className="text-[#F5F5DC] font-tajawal text-xl font-bold mb-2">{p.name}</h3>
                <p className="text-[#F5F5DC]/70 text-sm mb-4 leading-relaxed">{p.desc}</p>
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[#F5F5DC]/80 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-[#F5F5DC]/60 text-sm mt-6 leading-relaxed">{props.pricingNote}</p>
        </RevealOnScroll>

        {/* Why us */}
        <RevealOnScroll as="section">
          <h2 className="text-[#C5A059] font-tajawal text-2xl sm:text-3xl font-bold mb-4">
            لماذا تختار كيف الضيافة في {props.cityAr}؟
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {props.whyUs.map((w) => (
              <li key={w} className="flex items-start gap-2 text-[#F5F5DC]/80 leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C5A059] flex-shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        {/* Gallery */}
        {props.gallery.length > 0 && (
          <RevealOnScroll as="section">
            <h2 className="text-[#C5A059] font-tajawal text-2xl sm:text-3xl font-bold mb-8 text-center">من أعمالنا</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {props.gallery.map((g, i) => (
                <div key={i} className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#C5A059]/15 shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition-transform duration-500 hover:-translate-y-1">
                  <ProtectedImage src={g.src} alt={g.alt} fill showWatermark sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105" />
                </div>
              ))}
            </div>
          </RevealOnScroll>
        )}

        {/* FAQ */}
        <RevealOnScroll as="section">
          <h2 className="text-[#C5A059] font-tajawal text-2xl sm:text-3xl font-bold mb-6">
            أسئلة شائعة — {props.serviceAr} في {props.cityAr}
          </h2>
          <div className="space-y-6">
            {props.faqs.map((f) => (
              <div key={f.question}>
                <h3 className="font-semibold text-[#F5F5DC] mb-2">{f.question}</h3>
                <p className="text-[#F5F5DC]/70 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* CTA */}
        <RevealOnScroll as="section" className="text-center rounded-2xl p-10 bg-[#1a1a1a] border border-[#C5A059]/20">
          <h2 className="text-[#F5F5DC] font-tajawal text-2xl font-bold mb-3">
            جاهزون لخدمة مناسبتك في {props.cityAr}
          </h2>
          <p className="text-[#F5F5DC]/70 mb-6">تواصل معنا الآن لعرض سعر مجاني ومخصّص.</p>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 rounded-full bg-[#C5A059] text-[#0f0f0f] font-bold hover:brightness-110 transition">
            احجز عبر واتساب
          </a>
        </RevealOnScroll>

        {/* Other cities */}
        {props.otherCities.length > 0 && (
          <section className="border-t border-white/10 pt-8">
            <h2 className="text-lg font-semibold mb-4 text-[#F5F5DC]/80">{props.serviceAr} في مدن أخرى</h2>
            <div className="flex flex-wrap gap-3">
              {props.otherCities.map((c) => (
                <Link key={c.href} href={c.href} className="text-sm px-4 py-2 rounded-full bg-white/5 text-[#F5F5DC]/75 hover:bg-white/10 transition">
                  {c.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
