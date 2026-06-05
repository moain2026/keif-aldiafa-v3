"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useScroll } from "motion/react";

import ProtectedImage from "@/components/ProtectedImage";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  EVENT_IMAGES,
  WEDDING_IMAGES,
  EQUIPMENT_IMAGES,
} from "@/lib/images";


const ITEMS_PER_PAGE = 12;

type FilterType = "all" | "events" | "weddings" | "equipment";

interface PortfolioItem {
  id: number;
  image: string;
  category: FilterType;
}

const seoAltMapping: Record<string, string> = {
  all: "خدمات ضيافة فاخرة في السعودية - كيف الضيافة",
  events: "تجهيز ضيافة فعاليات ومؤتمرات VIP - صبابين وقهوجية مناسبات",
  weddings: "ضيافة زواجات فاخرة في السعودية - صبابات ومباشرات ضيافة نسائية",
  equipment: "تأجير معدات ضيافة ملكية - دلال نحاسية وكاونترات استقبال"
};

const portfolioItems: PortfolioItem[] = [
  ...EVENT_IMAGES.map((img, i) => ({
    id: i + 1,
    image: img,
    category: "events" as FilterType,
  })),
  ...WEDDING_IMAGES.map((img, i) => ({
    id: 100 + i + 1,
    image: img,
    category: "weddings" as FilterType,
  })),
  ...EQUIPMENT_IMAGES.map((img, i) => ({
    id: 200 + i + 1,
    image: img,
    category: "equipment" as FilterType,
  })),
];

const filters: { key: FilterType; label: string; icon: string }[] = [
  { key: "all", label: "الكل", icon: "◎" },
  { key: "events", label: "الفعاليات", icon: "🎉" },
  { key: "weddings", label: "الأعراس", icon: "💍" },
  { key: "equipment", label: "المعدات", icon: "⚙️" },
];

// ─────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────
function Lightbox({
  items,
  initialIndex,
  onClose,
}: {
  items: PortfolioItem[];
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
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(index - 1);
      if (e.key === "ArrowLeft") goTo(index + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goTo, index]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0, scale: 0.92 }),
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

      <div className="relative z-10 w-full h-full flex items-center justify-center px-2 md:px-4" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={item.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 320, damping: 38 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x: dragX }}
            onDragEnd={handleDragEnd}
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          >
            <div className="relative w-full h-full max-w-[95vw] max-h-[85vh] md:max-w-[75vw] md:max-h-[75vh] flex items-center justify-center">
              <ProtectedImage
                src={item.image}
                alt={`${seoAltMapping[item.category]} - عرض تفصيلي رقم ${index + 1}`}
                fill={true}
                className="object-contain shadow-2xl select-none"
                priority
                showWatermark={true}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Royal Trio Sticky Navigation Component
// ─────────────────────────────────────────────
function RoyalTrioNav({ activeFilter, onFilterChange }: { activeFilter: FilterType; onFilterChange: (key: FilterType) => void }) {
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.onChange(() => {
      if (containerRef.current) {
        const containerTop = containerRef.current.getBoundingClientRect().top;
        setIsSticky(containerTop <= 0);
      }
    });
    return () => unsubscribe();
  }, [scrollY]);

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
          <div className="flex justify-center gap-2 sm:gap-3">
            {filters.map((filter) => (
              <motion.button
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                className="relative group flex-1 max-w-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Background with Glassmorphism */}
                <motion.div
                  className="absolute inset-0 rounded-3xl transition-all duration-300"
                  animate={{
                    background: activeFilter === filter.key
                      ? 'linear-gradient(135deg, rgba(184, 134, 11, 0.25), rgba(212, 160, 23, 0.15))'
                      : 'rgba(0, 0, 0, 0.25)',
                    border: activeFilter === filter.key
                      ? '2px solid rgba(184, 134, 11, 0.7)'
                      : '1.5px solid rgba(184, 134, 11, 0.15)',
                    boxShadow: activeFilter === filter.key
                      ? '0 0 30px rgba(184, 134, 11, 0.4), inset 0 0 20px rgba(184, 134, 11, 0.1)'
                      : 'none',
                  }}
                />

                {/* Content Container */}
                <div className="relative flex flex-col items-center justify-center p-2 sm:p-4 h-full min-h-[65px] sm:min-h-[80px]">
                  {/* Icon with Animation */}
                  <motion.span 
                    className="text-lg sm:text-xl mb-1.5"
                    animate={{ 
                      scale: activeFilter === filter.key ? 1.2 : 1,
                      filter: activeFilter === filter.key ? 'drop-shadow(0 0 8px rgba(184, 134, 11, 0.5))' : 'grayscale(0.5) opacity(0.7)'
                    }}
                  >
                    {filter.icon}
                  </motion.span>
                  <motion.p
                    className="text-[10px] sm:text-[12px] text-center font-bold leading-tight"
                    style={{
                      textShadow: '0 1px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(184, 134, 11, 0.2)',
                    }}
                    animate={{
                      color: activeFilter === filter.key ? '#D4A017' : '#F5F5DC',
                      opacity: activeFilter === filter.key ? 1 : 0.8,
                      fontSize: isSticky ? '0.75rem' : '0.85rem',
                    }}
                    transition={{ type: 'spring', stiffness: 280, damping: 20, mass: 0.8, delay: 0.05 }}
                    layout
                  >
                    {filter.label}
                  </motion.p>
                </div>

                {/* Active Indicator Line */}
                {activeFilter === filter.key && (
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
      </motion.section>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function PortfolioClient() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredItems = activeFilter === "all"
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeFilter);

  const displayedItems = filteredItems.slice(0, displayCount);
  const hasMore = displayCount < filteredItems.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-32">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(184,134,11,0.08) 0%, transparent 60%)" }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Breadcrumbs />
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[#B8860B] mb-3 mt-8" style={{ fontSize: "0.75rem", letterSpacing: "0.35em" }}>✦ معرض أعمالنا ✦</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[#F5F5DC] mb-4 font-tajawal" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 900, lineHeight: 1.15}}>توثيق للحظات<br /><span className="gold-gradient-text">الفخامة والتميز</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-[#F5F5DC]/55 max-w-xl mx-auto text-sm leading-relaxed">استعرض أفضل لحظاتنا من الفعاليات والأعراس والمعدات الفاخرة التي تعكس جودة خدماتنا</motion.p>
        </div>
      </section>

      {/* Royal Trio Sticky Navigation */}
      <RoyalTrioNav activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Gallery Grid - Masonry Style (Natural Aspect Ratio) */}
      <div className="container mx-auto px-4 pt-12">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {displayedItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedIndex(idx)}
              className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer bg-[#1a1a1a]"
            >
              <ProtectedImage
                src={item.image}
                alt={`${seoAltMapping[item.category]} - لقطة ${idx + 1} من معرض أعمالنا`}
                className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 img-overlay" />
              <div className="absolute inset-0 bg-[#B8860B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-[#B8860B]/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              className="px-10 py-4 rounded-full font-bold text-[#0f0f0f] transition-all duration-300 text-sm"
              style={{
                background: "linear-gradient(135deg, #FFD700, #D4A017, #B8860B)",
                boxShadow: "0 8px 30px rgba(184,134,11,0.4)",
              }}
            >
              عرض المزيد ({filteredItems.length - displayCount} متبقي)
            </motion.button>
          </div>
        )}

        {/* Empty State */}
        {displayedItems.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[#F5F5DC]/40 text-lg">لا توجد صور في هذه الفئة حالياً</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            items={displayedItems}
            initialIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
