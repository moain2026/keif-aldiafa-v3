"use client";

import { motion, useAnimationFrame, useMotionValue, useTransform } from "motion/react";
import { useRef, useState, useEffect, useMemo } from "react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

// Partner logos (30 total)
const allPartners = [
  { id: 1, name: "Olayan Group", logo: "/images/partners/01_Olayan_Group.webp" },
  { id: 2, name: "Schneider Electric", logo: "/images/partners/02_Schneider_Electric.webp" },
  { id: 3, name: "Najeeb Auto Suzuki", logo: "/images/partners/03_Najeeb_Auto_Suzuki.webp" },
  { id: 4, name: "WSM Digital", logo: "/images/partners/04_WSM_Digital.webp" },
  { id: 5, name: "Mokab", logo: "/images/partners/05_Mokab.webp" },
  { id: 6, name: "MyClinic", logo: "/images/partners/06_MyClinic.webp" },
  { id: 7, name: "Al Ahli FC", logo: "/images/partners/07_Al_Ahli_FC.webp" },
  { id: 8, name: "Benchmark", logo: "/images/partners/08_Benchmark.webp" },
  { id: 9, name: "Fuchs KSA", logo: "/images/partners/09_Fuchs_KSA.webp" },
  { id: 10, name: "Milia Travel", logo: "/images/partners/10_Milia_Travel.webp" },
  { id: 11, name: "Al Mousa Group", logo: "/images/partners/11_Al_Mousa_Group.webp" },
  { id: 12, name: "Damanat", logo: "/images/partners/12_Damanat.webp" },
  { id: 13, name: "Daam Broker", logo: "/images/partners/13_Daam_Broker.webp" },
  { id: 14, name: "Munera Alessa", logo: "/images/partners/14_Munera_Alessa.webp" },
  { id: 15, name: "Somer", logo: "/images/partners/15_Somer.webp" },
  { id: 16, name: "Napco National", logo: "/images/partners/16_Napco_National.webp" },
  { id: 17, name: "Saudi Binladen Group", logo: "/images/partners/17_Saudi_Binladen_Group.webp" },
  { id: 18, name: "Glamera", logo: "/images/partners/18_Glamera.webp" },
  { id: 19, name: "Sharq Jeddah Association", logo: "/images/partners/19_Sharq_Jeddah_Association.webp" },
  { id: 20, name: "Olayan Group Alt", logo: "/images/partners/20_Olayan_Group_Alt.webp" },
  { id: 21, name: "Najeeb Auto Suzuki Alt", logo: "/images/partners/21_Najeeb_Auto_Suzuki_Alt.webp" },
  { id: 22, name: "WSM Digital Alt", logo: "/images/partners/22_WSM_Digital_Alt.webp" },
  { id: 23, name: "Benchmark Strategy", logo: "/images/partners/23_Benchmark_Strategy.webp" },
  { id: 24, name: "Fuchs KSA Alt", logo: "/images/partners/24_Fuchs_KSA_Alt.webp" },
  { id: 25, name: "Damanat Alt", logo: "/images/partners/25_Damanat_Alt.webp" },
  { id: 26, name: "Napco National Alt", logo: "/images/partners/26_Napco_National_Alt.webp" },
  { id: 27, name: "Binladin Holding", logo: "/images/partners/27_Binladin_Holding.webp" },
  { id: 28, name: "Glamera Alt", logo: "/images/partners/28_Glamera_Alt.webp" },
  { id: 29, name: "Bahja Events", logo: "/images/partners/29_Bahja_Events.webp" },
  { id: 30, name: "Hamat Leading", logo: "/images/partners/30_Hamat_Leading.webp" },
];

// دالة رياضية فائقة الدقة لضمان التفاف المسبحة (Seamless Wrap) بدون أي فراغات
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function PartnerCard({ partner }: { partner: (typeof allPartners)[0] }) {
  return (
    <div className="flex-shrink-0 select-none px-2 sm:px-3" style={{ width: "clamp(110px, 25vw, 160px)" }}>
      <div
        className="relative h-16 sm:h-20 rounded-xl flex items-center justify-center transition-all duration-300 hover:border-[rgba(184,134,11,0.4)] group hover:scale-105 overflow-hidden"
        style={{
          background: "rgba(20,16,6,0.4)",
          border: "1px solid rgba(184,134,11,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="w-full h-full flex items-center justify-center opacity-100 transition-opacity duration-300">
          <ImageWithFallback
            src={partner.logo}
            alt={partner.name}
            className="w-full h-full object-fill brightness-110 contrast-110 transition-all duration-500 pointer-events-none"
            loading="lazy"
            width={160}
            height={80}
            quality={85}
          />
        </div>
      </div>
    </div>
  );
}

interface MarqueeRowProps {
  items: typeof allPartners;
  baseVelocity: number;
  direction?: "ltr" | "rtl";
}

function MarqueeRow({ items, baseVelocity = 1, direction = "rtl" }: MarqueeRowProps) {
  const baseX = useMotionValue(0);
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // نستخدم 4 مجموعات (بدلاً من 3) لضمان عدم وجود أي فراغ مهما كانت شاشة المستخدم عملاقة أو تم سحب الشريط بقوة
  const sets = [0, 1, 2, 3];

  // تحديد اتجاه الحركة بناءً على المتغير
  const velocityFactor = direction === "rtl" ? -1 : 1;

  useEffect(() => {
    const calculateWidth = () => {
      if (contentRef.current) {
        // نقيس عرض مجموعة واحدة فقط بدقة البكسل المتناهية
        setContentWidth(contentRef.current.getBoundingClientRect().width);
      }
    };

    calculateWidth();
    window.addEventListener("resize", calculateWidth);
    
    // تأمين إضافي: إعادة الحساب بعد تحميل الصور والخطوط
    const timer = setTimeout(calculateWidth, 1000);

    return () => {
      window.removeEventListener("resize", calculateWidth);
      clearTimeout(timer);
    };
  }, [items]);

  // هنا السحر: عند وصول الشريط لحافة معينة، يلتف بشكل مخفي 100% بدون أي قفزة بصرية
  const x = useTransform(baseX, (v) => {
    if (contentWidth === 0) return 0;
    return wrap(-contentWidth, 0, v);
  });

  useAnimationFrame((t, delta) => {
    if (contentWidth === 0) return;
    // الحفاظ على سرعة موحدة بغض النظر عن معدل تحديث الشاشة (Refresh Rate)
    const moveBy = baseVelocity * (delta / 16.6) * velocityFactor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    // السر الأكبر هنا هو إجبار الحاوية على (dir="ltr") لفصل رياضيات الحركة عن اتجاه الموقع العربي
    <div className="relative overflow-hidden py-2 touch-pan-y" dir="ltr">
      <motion.div
        className="flex whitespace-nowrap will-change-transform w-max cursor-grab active:cursor-grabbing"
        style={{ x }}
        // onPan يسمح بالسحب اليدوي بسلاسة تامة ويحدث القيمة الحركية دون كسر الدوران
        onPan={(e, info) => {
          baseX.set(baseX.get() + info.delta.x);
        }}
      >
        {sets.map((setIndex) => (
          <div 
            key={setIndex} 
            ref={setIndex === 0 ? contentRef : null} 
            className="flex shrink-0 items-center"
          >
            {items.map((partner) => (
              <PartnerCard key={`${setIndex}-${partner.id}`} partner={partner} />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function PartnersMarquee() {
  const firstRow = useMemo(() => allPartners.slice(0, 15), []);
  const secondRow = useMemo(() => allPartners.slice(15, 30), []);

  return (
    <section className="py-12 sm:py-16 px-4 overflow-hidden contain-paint bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-[#B8860B] mb-2 text-center" style={{ fontSize: "0.7rem", letterSpacing: "0.3em", fontWeight: 600 }}>
            ✦ نثق بهم ويثقون بنا ✦
          </p>
          <h2
            className="text-[#F5F5DC] text-center font-tajawal font-bold"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2 }}
          >
            شركاء النجاح
          </h2>
          <div
            className="mt-3 mb-1 rounded-full mx-auto"
            style={{
              width: 60,
              height: 2,
              background: "linear-gradient(90deg, transparent, #B8860B 30%, #D4A017 60%, transparent)",
            }}
          />
        </motion.div>
      </div>

      <div className="relative space-y-4 sm:space-y-6">
        {/* تدرجات الحواف للمسة فاخرة (Gradients) */}
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#0f0f0f] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#0f0f0f] to-transparent z-20 pointer-events-none" />

        {/* الشريط الأول */}
        <MarqueeRow items={firstRow} baseVelocity={0.8} direction="rtl" />

        {/* الشريط الثاني */}
        <MarqueeRow items={secondRow} baseVelocity={0.6} direction="ltr" />
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-[#F5F5DC]/30 text-[10px] sm:text-xs text-center mt-8 font-cairo tracking-wide"
      >
        يمكنك سحب الشريط يدوياً لاستكشاف المزيد من الشركاء
      </motion.p>
    </section>
  );
}
