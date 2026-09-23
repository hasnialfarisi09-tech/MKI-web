"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useSafeReducedMotion } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** vertical travel distance in px */
  y?: number;
  once?: boolean;
};

/**
 * Scroll-reveal primitive powered by Framer Motion.
 * Keeps the original API ({ children, className, delay }) so every existing
 * section upgrades to staggered, blurred motion reveals with zero churn.
 */
export function Reveal({ children, className, delay = 0, y = 28, once = true }: RevealProps) {
  const reduce = useSafeReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
