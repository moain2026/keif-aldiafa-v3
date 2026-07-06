"use client";

/**
 * RevealOnScroll — leaf client component that isolates the motion library.
 * Wrap any server-rendered content to add a scroll-triggered fade/slide-in.
 * The content is ALWAYS present in SSR HTML (initial={false}) — only the
 * animation runs after hydration, so SEO/Googlebot never sees hidden text.
 * Respects prefers-reduced-motion.
 */

import { motion, useReducedMotion } from "motion/react";
import type { ElementType, ReactNode } from "react";

export function RevealOnScroll({
  children,
  delay = 0,
  as = "div",
  className,
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  /** Above-the-fold elements animate on mount instead of on scroll. */
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  if (immediate) {
    return (
      <MotionTag
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.32, 0.72, 0, 1] }}
        className={className}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      initial={false}
      whileInView={{ opacity: [0, 1], y: [24, 0] }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.32, 0.72, 0, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
