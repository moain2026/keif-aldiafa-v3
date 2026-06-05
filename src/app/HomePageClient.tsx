'use client';

import { useRef, lazy, Suspense } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { HERO_IMG } from "@/lib/images";

const PartnersMarquee = lazy(() =>
  import("@/components/PartnersMarquee").then((m) => ({ default: m.PartnersMarquee }))
);
const WA = "966508252134";

const whyCards = [
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>, title: "خبرة متميزة", desc: "أكثر من ٨ سنوات في تقديم خدمات الضيافة الفاخرة للمناسبات الكبرى والمحافل الرسمية" },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>, title: "فريق احترافي", desc: "كوادر مدربة على أعلى معايير الضيافة الدولية والأصالة العربية" },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>, title: "تقديمات فاخرة", desc: "أرقى المشروبات والتقديمات من قهوة سعودية وشاي وحلويات فاخرة" },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>, title: "تغطية المملكة", desc: "نصل إلى جميع مناطق المملكة بأسطول من المعدات الفاخرة" },
];

function SectionHeader({ label, title, center = true }: { label?: string; title: string; center?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className={`mb-14 ${center ? "text-center" : ""}`}>
      {label && <p className={`text-gold-matte mb-3 ${center ? "text-center" : ""}`} style={{ fontSize: "0.75rem", letterSpacing: "0.35em" }}>✦ {label} ✦</p>}
      <h2 className={`text-text-primary font-cairo ${center ? "text-center" : ""}`} style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)", fontWeight: 800, lineHeight: 1.3 }}>{title}</h2>
      <div className="mt-4 mb-1 rounded-full" style={{ width: center ? 90 : 70, height: 2, background: "linear-gradient(90deg, transparent, #C5A059 30%, #E2C68E 60%, transparent)", margin: "12px auto 0" }} />
    </motion.div>
  );
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-gold-matte" style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }} animate={{ y: [0, -30, 0], opacity: [0.15, 0.5, 0.15], scale: [1, 1.5, 1] }} transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

function GoldenSparkle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        background: "radial-gradient(circle, #E2C68E 0%, #C5A059 100%)",
        boxShadow: "0 0 8px rgba(197, 160, 89, 0.8)",
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export function HomePageClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <div>
      {/* HERO */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] max-h-[950px] overflow-hidden" aria-label="الشاشة الرئيسية">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          {/* Video Background from v3 */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={HERO_IMG}
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        {/* Charcoal Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/80 via-luxury-deep/40 to-luxury-rich" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(197,160,89,0.1) 0%, transparent 70%)" }} />
        <Particles />
        
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-start sm:justify-center text-center px-4 sm:px-6 pt-12 sm:pt-0" 
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl px-6 sm:px-8 py-8 sm:py-12 rounded-3xl mt-4 sm:mt-0 hero-card-mobile"
            style={{
              background: "rgba(26, 26, 26, 0.75)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(197, 160, 89, 0.25)",
              boxShadow: "0 12px 48px rgba(0, 0, 0, 0.5)",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <GoldenSparkle key={i} delay={i * 0.25} x={15 + (i % 2) * 70} y={10 + Math.floor(i / 2) * 25} />
            ))}

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="h-px w-8 sm:w-10 bg-gradient-to-l from-gold-matte to-transparent" />
              <span className="text-gold-highlight font-medium" style={{ fontSize: "0.7rem", letterSpacing: "0.3em" }}>SINCE 2016</span>
              <div className="h-px w-8 sm:w-10 bg-gradient-to-r from-gold-matte to-transparent" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-text-primary mb-4 font-cairo gold-shine-text"
              style={{
                fontSize: "clamp(2.2rem, 8vw, 4.5rem)",
                fontWeight: 900,
                lineHeight: 1.2,
                textShadow: "0 4px 30px rgba(0,0,0,0.6)",
                filter: "drop-shadow(0 0 20px rgba(197, 160, 89, 0.4))",
              }}
            >
              كيف الضيافة
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-5 mx-auto"
              style={{
                width: 80,
                height: 2,
                background: "linear-gradient(90deg, transparent, #C5A059, #E2C68E, #C5A059, transparent)",
                boxShadow: "0 0 15px rgba(197, 160, 89, 0.6)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex flex-col items-center gap-2 mb-6"
            >
              <p className="text-gold-highlight" style={{ fontSize: "clamp(0.8rem, 2vw, 0.95rem)", letterSpacing: "0.25em", fontWeight: 600 }}>KEIF AL-DIAFA</p>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-6 bg-gradient-to-l from-gold-matte to-transparent" />
                <span className="text-gold-matte" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", fontWeight: 500 }}>LUXURY HOSPITALITY</span>
                <div className="h-px w-6 bg-gradient-to-r from-gold-matte to-transparent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="max-w-2xl mx-auto w-full px-4"
            >
              <p className="text-text-primary/90 mb-6 font-tajawal text-[clamp(1rem,2vw,1.15rem)] leading-[1.8] font-light">
                نبتكر تجارب ضيافة استثنائية تلبي تطلعات النخبة، مع أفضل طاقم صبابين وصبابات زواجات ومباشرين بزي فاخر لفعاليات الشركات والمحافل الحكومية والخاصة.
              </p>
              
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10">
                {["فعاليات رسمية", "مؤتمرات دولية", "مناسبات خاصة"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-matte shadow-[0_0_8px_rgba(197,160,89,0.8)]" />
                    <span className="text-gold-highlight text-xs font-medium tracking-wider">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={`https://wa.me/${WA}`} target="_blank" className="gold-button w-full sm:w-auto px-10 py-4 rounded-full text-sm tracking-widest">
                  احجز الآن
                </Link>
                <Link href="services" className="w-full sm:w-auto px-10 py-4 rounded-full text-sm tracking-widest border border-gold-matte/30 text-gold-matte hover:bg-gold-matte/10 transition-all">
                  اكتشف خدماتنا
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* PARTNERS */}
      <section className="py-12 bg-luxury-rich border-y border-gold-matte/10">
        <Suspense fallback={<div className="h-20" />}>
          <PartnersMarquee />
        </Suspense>
      </section>

      {/* WHY US */}
      <section className="py-24 px-4 bg-luxury-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-matte/20 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader label="لماذا نحن" title="ضيافة مناسبات VIP نصنع فيها الفرق" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCards.map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-luxury p-8 rounded-3xl group">
                <div className="w-14 h-14 rounded-2xl bg-gold-matte/10 flex items-center justify-center text-gold-matte mb-6 group-hover:bg-gold-matte group-hover:text-luxury-black transition-all duration-500">
                  {card.icon}
                </div>
                <h3 className="text-xl font-cairo font-bold text-text-primary mb-3">{card.title}</h3>
                <p className="text-text-secondary leading-relaxed text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
