"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/motion";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** class applied to the translating inner wrapper (e.g. "absolute inset-0" for fill images) */
  innerClassName?: string;
  /** travel distance in px across the full scroll pass (positive = moves up) */
  distance?: number;
  /** opacity fade at the edges */
  fade?: boolean;
};

/**
 * Scroll-linked parallax. Translates its child on the Y axis as the element
 * passes through the viewport. For a fill image, give the outer `className`
 * a sized box (e.g. "absolute inset-0") and `innerClassName="absolute inset-0"`
 * so the image has a positioned parent.
 */
export function Parallax({ children, className, innerClassName, distance = 60, fade = false }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        className={cn(innerClassName)}
        style={reduce ? undefined : { y, opacity: fade ? opacity : undefined }}
      >
        {children}
      </motion.div>
    </div>
  );
}
