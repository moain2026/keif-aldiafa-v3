"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useScroll } from "motion/react";

import { ImageWithFallback } from "@/components/ImageWithFallback";
import ProtectedImage from "@/components/ProtectedImage";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  HOT_DRINKS_IMAGES,
  COLD_DRINKS_IMAGES,
  DATES_IMAGES,
  SWEETS_IMAGES,
  PASTRY_IMAGES,
  SNACKS_IMAGES,
  SANDWICHES_IMAGES,
  FRUITS_IMAGES,
  NUTS_IMAGES,
} from "@/lib/images";

const WA = "966508252134";

interface OfferingItem {
  name: string;
  description: string;
  img: string;
}

interface CategoryData {
  id: string;
  label: string;
  icon: string;
  description: string;
  items: OfferingItem[];
}

const categories: CategoryData[] = [
  {
    id: "hot", label: "المشروبات الحارة", icon: "☕", description: "قهوة سعودية أصيلة وشاي فاخر ومشروبات دافئة",
    items: [
      { name: "القهوة التركية",      description: "قهوة تركية أصيلة",                 img: HOT_DRINKS_IMAGES.turkishCoffee },
      { name: "الشاي الأحمر",        description: "شاي أحمر معطر بالنعناع",            img: HOT_DRINKS_IMAGES.redTea },
      { name: "الشاي الأخضر",        description: "شاي أخضر طبيعي منعش",               img: HOT_DRINKS_IMAGES.greenTea },
      { name: "شاي الكرك",           description: "شاي كرك بنكهة فريدة",               img: HOT_DRINKS_IMAGES.karakTea },
      { name: "السحلب",              description: "مشروب الدفء الشتوي",               img: HOT_DRINKS_IMAGES.sahlab },
      { name: "زنجبيل بالأناناس",    description: "مزيج فريد منعش",                    img: HOT_DRINKS_IMAGES.gingerPineapple },
      { name: "الكابتشينو",          description: "كابتشينو إيطالي الأصل",             img: HOT_DRINKS_IMAGES.cappuccino },
    ],
  },
  {
    id: "cold", label: "المشروبات الباردة", icon: "🧊", description: "مشروبات منعشة وباردة تليق بالمناسبات",
    items: [
      { name: "عصائر طبيعية",       description: "عصائر فواكه طازجة",                 img: COLD_DRINKS_IMAGES.freshJuice },
      { name: "موهيتو",             description: "موهيتو منعش بنكهات متعددة",         img: COLD_DRINKS_IMAGES.mojito },
      { name: "عرق سوس",            description: "مشروب عرق السوس الأصيل",            img: COLD_DRINKS_IMAGES.arakSous },
      { name: "كركديه",             description: "شراب الكركديه الأحمر المنعش",        img: COLD_DRINKS_IMAGES.karkade },
      { name: "تمر هندي",           description: "شراب التمر الهندي الحامض",          img: COLD_DRINKS_IMAGES.tamarind },
      { name: "سوبيا",              description: "سوبيا تراثية سعودية",               img: COLD_DRINKS_IMAGES.sobia },
      { name: "سموذي فواكه",        description: "سموذي طازج من الفواكه",             img: COLD_DRINKS_IMAGES.smoothie },
      { name: "آيس لاتيه",          description: "لاتيه مثلج بنكهات مختلفة",          img: COLD_DRINKS_IMAGES.icedLatte },
    ],
  },
  {
    id: "dates", label: "التمور الفاخرة", icon: "🌴", description: "أجود أنواع التمور السعودية الفاخرة",
    items: [
      { name: "تمر سكري محشي",             description: "محشو بالمكسرات الملكية",              img: DATES_IMAGES.sukariStuffed },
      { name: "تمر خلاص محشي",             description: "محشي بالقشدة واللوز",               img: DATES_IMAGES.khalasStuffed },
      { name: "تمر خلاص بالسمسم",          description: "بالسمسم والطحينية الطبيعية",         img: DATES_IMAGES.khalasSesame },
      { name: "تمر محشي بالمكسرات",         description: "تشكيلة تمور محشية فاخرة",            img: DATES_IMAGES.stuffedDates },
      { name: "تمر محشي مشكّل",            description: "بمزيج الشوكولاتة والمكسرات",          img: DATES_IMAGES.stuffedDates2 },
      { name: "تمر محشي فاخر",             description: "تشكيلة فاخرة للمناسبات",             img: DATES_IMAGES.stuffedDates3 },
      { name: "تمر محشي ملكي",             description: "ملكية بالفستق والكاجو",              img: DATES_IMAGES.stuffedDates5 },
      { name: "نخلة تمر سكري",             description: "طبيعي معروض بأناقة",                img: DATES_IMAGES.palmSukari },
      { name: "نخلة تمر سكري محشي",        description: "نخلة تقديم فاخرة",                  img: DATES_IMAGES.palmSukariStuffed },
      { name: "نخلة تمر خلاص محشي",        description: "نخلة تقديم أنيقة",                  img: DATES_IMAGES.palmKhalasStuffed },
      { name: "تمور مشكّلة",               description: "أجود التمور السعودية",               img: DATES_IMAGES.datesAssorted },
    ],
  },
  {
    id: "sweets", label: "الحلويات", icon: "🍰", description: "حلويات شرقية وغربية فاخرة",
    items: [
      { name: "بقلاوة فاخرة",           description: "بقلاوة تركية بالفستق",                  img: SWEETS_IMAGES.baklava },
      { name: "كنافة نابلسية",          description: "كنافة بالجبن والقطر",                  img: SWEETS_IMAGES.kunafa },
      { name: "شوكولاتة باتشي",         description: "باتشي الفاخرة للمناسبات",              img: SWEETS_IMAGES.patchiChocolate },
      { name: "شوكولاتة بستاني",        description: "بستاني الفاخرة بنكهات مميزة",           img: SWEETS_IMAGES.bostaniChocolate },
      { name: "كرواءسون شوكولاتة",       description: "كرواسون فرنسي محشو",                   img: SWEETS_IMAGES.chocolateCroissant },
      { name: "بان كيك",                description: "بان كيك طازج بالتوبينج",               img: SWEETS_IMAGES.pancake },
      { name: "بوفيه حلى كاسات",         description: "حلى كاسات شوكولاتة وبسبوسة ومكعبات",    img: SWEETS_IMAGES.chocolateMousseBasbousaBuffet },
      { name: "تشكيلة شرقية فاخرة",      description: "بقلاوة وكنافة بالفستق مع فواكه طازجة",   img: SWEETS_IMAGES.baklavaKunafaFruitPlatter },
      { name: "ركن الحلويات الفاخر",     description: "كاسات مانجو وريد فيلفيت وبقلاوة أصابع",  img: SWEETS_IMAGES.mangoPannaCottaRedVelvetStation },
    ],
  },
  {
    id: "pastry", label: "المعجنات", icon: "🥐", description: "معجنات طازجة محضرة بعناية",
    items: [
      { name: "سمبوسة",               description: "ذهبية مقرمشة بحشوات متنوعة",           img: PASTRY_IMAGES.samosa },
      { name: "فطائر بالفواكه",        description: "محشوة بالفواكه الموسمية",               img: PASTRY_IMAGES.fruitPie },
      { name: "معجنات عربية",          description: "تشكيلة معجنات أصيلة",                  img: PASTRY_IMAGES.arabicPastry },
      { name: "معجنات متنوعة",         description: "باقة متنوعة للمناسبات",               img: PASTRY_IMAGES.assortedPastry },
      { name: "مقبلات فاخرة",          description: "مقبلات صغيرة فاخرة",                  img: PASTRY_IMAGES.appetizers },
    ],
  },
  {
    id: "snacks", label: "السناكات", icon: "🍿", description: "وجبات خفيفة فاخرة ومتنوعة تليق بالمناسبات",
    items: [
      { name: "ميني بيتزا",        description: "بيتزا صغيرة بحشوات متنوعة",           img: SNACKS_IMAGES.miniPizza },
      { name: "ناتشوز",            description: "ناتشوز مقرمشة بالجبن والصلصة",        img: SNACKS_IMAGES.nachos },
      { name: "بطاطس ودجز",        description: "ودجز ذهبية مقرمشة",                   img: SNACKS_IMAGES.potatoWedges },
      { name: "سبرنج رول",         description: "لفائف مقرمشة بحشوات شرقية",           img: SNACKS_IMAGES.springRoll },
      { name: "تشيكن بوبس",        description: "كرات دجاج مقرمشة ذهبية",             img: SNACKS_IMAGES.chickenPops },
      { name: "كروكيت",            description: "كروكيت بالبطاطس والجبن",              img: SNACKS_IMAGES.croquette },
      { name: "فنجر فود",          description: "تشكيلة مقبلات صغيرة فاخرة",           img: SNACKS_IMAGES.fingerFood },
      { name: "ميني برجر",         description: "برجر صغير بلمسة فاخرة",              img: SNACKS_IMAGES.miniBurger },
      { name: "تشيز ستيك",         description: "أصابع جبن مقرمشة ذهبية",             img: SNACKS_IMAGES.cheeseStick },
      { name: "بروشيتا",           description: "خبز محمص بالطماطم والريحان",          img: SNACKS_IMAGES.bruschetta },
    ],
  },
  {
    id: "sandwiches", label: "السندوتشات", icon: "🥪", description: "سندوتشات طازجة محضرة بعناية فائقة",
    items: [
      { name: "كلوب ساندوتش",      description: "ساندوتش كلاسيكي ثلاثي الطبقات",       img: SANDWICHES_IMAGES.clubSandwich },
      { name: "دجاج مشوي",         description: "ساندوتش دجاج مشوي بالأعشاب",         img: SANDWICHES_IMAGES.grilledChicken },
      { name: "ساندوتش تونة",      description: "تونة طازجة بالخضروات",               img: SANDWICHES_IMAGES.tunaSandwich },
      { name: "لحم بارد",          description: "شرائح لحم بارد فاخرة",               img: SANDWICHES_IMAGES.coldCuts },
      { name: "حلوم مشوي",         description: "جبن حلوم مشوي بالخضروات",            img: SANDWICHES_IMAGES.grilledHalloumi },
      { name: "ديك رومي",          description: "شرائح ديك رومي مدخنة",               img: SANDWICHES_IMAGES.turkeySandwich },
      { name: "سلمون مدخن",        description: "سلمون مدخن بالكريمة",                img: SANDWICHES_IMAGES.smokedSalmon },
    ],
  },
  {
    id: "fruits", label: "فواكه مشكلة", icon: "🍇", description: "فواكه طازجة مقطعة ومقدمة بأناقة",
    items: [
      { name: "فراولة طازجة",       description: "فراولة حمراء طازجة ومنتقاة",          img: FRUITS_IMAGES.strawberry },
      { name: "عنب أحمر وأخضر",    description: "عنب فاخر بنوعيه",                    img: FRUITS_IMAGES.grapes },
      { name: "مانجو مقطعة",       description: "مانجو ناضجة مقطعة بأناقة",            img: FRUITS_IMAGES.mango },
      { name: "أناناس طازج",       description: "أناناس استوائي مقطع",                img: FRUITS_IMAGES.pineapple },
      { name: "كيوي مقطع",         description: "كيوي أخضر طازج ومنعش",               img: FRUITS_IMAGES.kiwi },
      { name: "توت مشكل",          description: "تشكيلة توت بري فاخرة",               img: FRUITS_IMAGES.mixedBerries },
      { name: "بطيخ مكعبات",       description: "بطيخ أحمر مقطع مكعبات",              img: FRUITS_IMAGES.watermelon },
      { name: "تين طازج",          description: "تين موسمي طازج ومميز",               img: FRUITS_IMAGES.figs },
      { name: "رمان مفصص",         description: "حبات رمان مفصصة بعناية",             img: FRUITS_IMAGES.pomegranate },
    ],
  },
  {
    id: "nuts", label: "المكسرات", icon: "🥜", description: "مكسرات فاخرة محمصة ومملحة بعناية",
    items: [
      { name: "لوز محمص",          description: "لوز محمص بالملح الخفيف",              img: NUTS_IMAGES.roastedAlmonds },
      { name: "كاجو ملكي",         description: "كاجو فاخر محمص بالزبدة",             img: NUTS_IMAGES.royalCashew },
      { name: "فستق حلبي",         description: "فستق حلبي أخضر فاخر",               img: NUTS_IMAGES.pistachio },
      { name: "جوز عين الجمل",     description: "جوز طبيعي غني بالفوائد",             img: NUTS_IMAGES.walnut },
      { name: "بندق محمص",         description: "بندق محمص بنكهة مميزة",              img: NUTS_IMAGES.roastedHazelnut },
      { name: "مكسرات مشكلة فاخرة", description: "تشكيلة ملكية من أجود المكسرات",       img: NUTS_IMAGES.premiumMix },
      { name: "صنوبر ذهبي",        description: "صنوبر محمص ذهبي اللون",              img: NUTS_IMAGES.pineNuts },
      { name: "مكاديميا",          description: "مكاديميا فاخرة نادرة",               img: NUTS_IMAGES.macadamia },
      { name: "بيكان محمص",        description: "بيكان أمريكي محمص فاخر",             img: NUTS_IMAGES.roastedPecan },
      { name: "فول سوداني مملح",    description: "فول سوداني مقرمش ومملح",             img: NUTS_IMAGES.saltedPeanuts },
    ],
  },
];

// ─────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────
function Lightbox({
  items,
  initialIndex,
  onClose,
}: {
  items: OfferingItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const dragX = useMotionValue(0);
  const bgOpacity = useTransform(dragX, [-200, 0, 200], [0.5, 1, 0.5]);
  const item = items[index];

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= items.length) return;
      setDirection(next > index ? 1 : -1);
      setIndex(next);
    },
    [index, items.length]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { velocity: { x: number }; offset: { x: number } }) => {
      const { velocity, offset } = info;
      if (velocity.x < -300 || offset.x < -80) {
        goTo(index + 1);
      } else if (velocity.x > 300 || offset.x > 80) {
        goTo(index - 1);
      } else {
        animate(dragX, 0, { type: "spring", stiffness: 400, damping: 40 });
      }
    },
    [goTo, index, dragX]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowRight")  goTo(index - 1);
      if (e.key === "ArrowLeft")   goTo(index + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goTo, index]);

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ?  300 : -300, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -300 :  300, opacity: 0, scale: 0.92 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(5,4,2,0.95)", backdropFilter: "blur(24px)", opacity: bgOpacity }}
      />

      <button
        onClick={onClose}
        className="absolute top-5 left-5 z-20 w-11 h-11 rounded-full flex items-center justify-center text-[#F5F5DC]/70 hover:text-[#F5F5DC] transition-colors"
        style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(184,134,11,0.2)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="absolute top-5 right-5 z-20 px-3 py-1.5 rounded-full text-xs text-[#B8860B]"
        style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(184,134,11,0.2)" }}>
        {index + 1} / {items.length}
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ x: dragX }}
          onDragEnd={handleDragEnd}
          className="relative w-full max-w-4xl px-4 flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-screen max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <ProtectedImage
                src={item.img}
                alt={item.name}
                width={1200}
                height={800}
                className="max-w-full max-h-full"
                priority
                showWatermark={true}
              />
            </div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-amiri text-[#D4A017] mb-2">{item.name}</h3>
            <p className="text-[#F5F5DC]/70 text-sm max-w-md mx-auto">{item.description}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Royal Trio Sticky Navigation Component
// ─────────────────────────────────────────────
function RoyalTrioNav({ activeTab, onTabChange }: { activeTab: string; onTabChange: (id: string) => void }) {
  const [isSticky, setIsSticky] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Track sticky state
  useEffect(() => {
    const unsubscribe = scrollY.on("change", () => {
      if (containerRef.current) {
        const containerTop = containerRef.current.getBoundingClientRect().top;
        setIsSticky(containerTop <= 0);
      }
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Track horizontal scroll state for fade indicators
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // RTL: scrollLeft is negative in RTL
    const absScroll = Math.abs(scrollLeft);
    setCanScrollRight(absScroll > 1);
    setCanScrollLeft(absScroll < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  return (
    <div ref={containerRef} className="w-full">
      <motion.section
        ref={navRef}
        className={`w-full transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-50' : 'relative'}`}
        animate={{
          paddingTop: isSticky ? '12px' : '16px',
          paddingBottom: isSticky ? '12px' : '16px',
          background: isSticky ? 'rgba(15, 15, 15, 0.95)' : 'transparent',
          backdropFilter: isSticky ? 'blur(16px)' : 'none',
          borderBottom: isSticky ? '1px solid rgba(184, 134, 11, 0.15)' : 'none',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative">
            {/* Left fade indicator (RTL: means more content to the right) */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 sm:hidden ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
              style={{ background: 'linear-gradient(to right, rgba(15,15,15,0.95), transparent)' }}
            />
            {/* Right fade indicator (RTL: means more content to the left) */}
            <div
              className={`absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 sm:hidden ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
              style={{ background: 'linear-gradient(to left, rgba(15,15,15,0.95), transparent)' }}
            />
            <div
              ref={scrollRef}
              className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 sm:justify-center sm:flex-wrap scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => onTabChange(category.id)}
                  className="relative group min-w-[72px] sm:min-w-0 sm:flex-1 max-w-sm flex-shrink-0 sm:flex-shrink"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-3xl overflow-hidden transition-all duration-300"
                    animate={{
                      background: activeTab === category.id
                        ? 'linear-gradient(135deg, rgba(184,134,11,0.25), rgba(212, 160, 23, 0.15))'
                        : 'rgba(0, 0, 0, 0.25)',
                      border: activeTab === category.id
                        ? '2px solid rgba(184, 134, 11, 0.7)'
                        : '1.5px solid rgba(184, 134, 11, 0.15)',
                    }}
                    style={{
                      borderRadius: '1.5rem',
                      filter: activeTab === category.id
                        ? 'drop-shadow(0 0 12px rgba(184, 134, 11, 0.35))'
                        : 'none',
                    }}
                  />
                  <div className="relative flex flex-col items-center justify-center p-2 sm:p-4 h-full min-h-[65px] sm:min-h-[80px]">
                    <motion.span
                      className="text-lg sm:text-xl mb-1.5"
                      animate={{
                        scale: activeTab === category.id ? 1.2 : 1,
                        filter: activeTab === category.id ? 'drop-shadow(0 0 8px rgba(184, 134, 11, 0.5))' : 'grayscale(0.5) opacity(0.7)'
                      }}
                    >
                      {category.icon}
                    </motion.span>
                    <motion.p
                      className="text-[10px] sm:text-[12px] text-center font-bold leading-tight"
                      style={{
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(184, 134, 11, 0.2)',
                      }}
                      animate={{
                        color: activeTab === category.id ? '#D4A017' : '#F5F5DC',
                        opacity: activeTab === category.id ? 1 : 0.8,
                      }}
                      transition={{ type: 'spring', stiffness: 280, damping: 20, mass: 0.8, delay: 0.05 }}
                      layout
                    >
                      {category.label}
                    </motion.p>
                  </div>
                  {activeTab === category.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B8860B] via-[#D4A017] to-[#B8860B]"
                      style={{ borderRadius: '2px' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}


// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function OfferingsClient() {
  const [activeTab, setActiveTab] = useState("hot");
  const [lightbox, setLightbox] = useState<{ items: OfferingItem[]; index: number } | null>(null);

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <main className="min-h-screen bg-[#0f0f0f] pb-32">
      <div className="pt-8">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={[{ label: "تقديماتنا", href: "/offerings" }]} />

          <section className="relative pt-4 pb-6 px-4 overflow-hidden">
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(184,134,11,0.08) 0%, transparent 60%)" }} />
            <div className="max-w-5xl mx-auto text-center relative z-10">
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[#B8860B] mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.35em" }}>✦ تقديماتنا ✦</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[#F5F5DC] mb-4 font-tajawal" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 900, lineHeight: 1.15}}>تشكيلة فاخرة من<br /><span className="gold-gradient-text">الضيافة الأصيلة</span></motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-[#F5F5DC]/55 max-w-xl mx-auto text-sm leading-relaxed">نقدم لكم تشكيلة مختارة من أجود المشروبات والتمور والحلويات التي تعكس كرم الضيافة السعودية الأصيلة</motion.p>
            </div>
          </section>
        </div>

        {/* Royal Trio Sticky Navigation */}
        <RoyalTrioNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 pt-12">
        {/* Category Header */}
        <div className="mb-10 text-center">
          <p className="text-[#B8860B] text-sm mb-2" style={{ letterSpacing: "0.1em" }}>✦ {currentCategory.label} ✦</p>
          <p className="text-[#F5F5DC]/60 text-sm sm:text-base max-w-lg mx-auto">{currentCategory.description}</p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {currentCategory.items.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              onClick={() => setLightbox({ items: currentCategory.items, index: idx })}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/5]"
            >
              <div className="relative w-full h-full">
                <ImageWithFallback
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Watermark - Removed from Grid View as requested */}
              </div>
              <div className="absolute inset-0 img-overlay" />
              <div className="absolute inset-0 bg-[#B8860B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="text-[#F5F5DC]" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{item.name}</h3>
                <p className="text-[#F5F5DC]/50 text-xs mt-1 line-clamp-2">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            items={lightbox.items}
            initialIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>

      {/* CTA */}
      <div className="mt-20 text-center p-8 sm:p-12 rounded-3xl relative overflow-hidden mx-4 max-w-2xl mx-auto" style={{ background: "linear-gradient(135deg, rgba(25,20,8,0.9), rgba(15,12,5,0.95))", border: "1px solid rgba(184,134,11,0.2)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(184,134,11,0.06) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <h2 className="text-[#F5F5DC] mb-3" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 800}}>هل تريد تجربة تقديماتنا؟</h2>
          <p className="text-[#F5F5DC]/50 text-sm mb-6 max-w-lg mx-auto">تواصل معنا الآن واستمتع بأجود التقديمات الفاخرة</p>
          <a href={`https://wa.me/${WA}?text=${encodeURIComponent("مرحباً، أود الاستفسار عن تقديماتكم وتوزيعاتكم الفاخرة.")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white" style={{ background: "linear-gradient(135deg, #1da851, #25D366)", fontWeight: 700, boxShadow: "0 6px 25px rgba(37,211,102,0.35)" }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            تواصل عبر واتساب
          </a>
        </div>
      </div>
    </main>
  );
}
