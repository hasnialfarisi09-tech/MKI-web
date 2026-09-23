"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  type PanInfo,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/motion";

/** wrap a value into the [min, max) range (for seamless looping) */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

type VelocityMarqueeProps = {
  children: ReactNode;
  /** base auto-scroll speed in %/sec (sign sets direction) */
  baseVelocity?: number;
  className?: string;
};

/**
 * Scroll-velocity parallax marquee. The row auto-scrolls continuously, and the
 * page's scroll velocity adds momentum and flips direction — marquee + parallax
 * in one. Children are repeated so the loop is seamless. Static under
 * prefers-reduced-motion.
 */
export function VelocityMarquee({ children, baseVelocity = 3, className }: VelocityMarqueeProps) {
  const reduce = useSafeReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });

  // 4 copies → one copy is 25% of the track; wrap over that span for a seamless loop
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const directionFactor = useRef(1);
  const isHoveredRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, delta) => {
    // Pause animation if hovered/touched/dragged
    if (isHoveredRef.current) return;

    const isMobile = window.innerWidth < 768;
    const activeAutoVelocity = isMobile ? 0 : baseVelocity;

    // Base auto-scroll
    let moveBy = directionFactor.current * activeAutoVelocity * (delta / 1000);

    // The scroll-velocity boost (the parallax part) is gated behind reduced motion.
    if (!reduce) {
      const currentVelocity = velocityFactor.get();
      if (currentVelocity < 0) directionFactor.current = -1;
      else if (currentVelocity > 0) directionFactor.current = 1;

      // Maintain opposite parallax scroll directions based on baseVelocity sign
      const velocityMultiplier = isMobile ? baseVelocity * 2.5 : activeAutoVelocity;
      const scrollMove = directionFactor.current * velocityMultiplier * Math.abs(currentVelocity) * (delta / 1000);
      
      moveBy += scrollMove;
    }

    baseX.set(baseX.get() + moveBy);
  });

  const handlePan = (event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    isHoveredRef.current = true;
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      if (width > 0) {
        // Convert pixel delta to percentage
        const deltaPercent = (info.delta.x / width) * 100;
        baseX.set(baseX.get() + deltaPercent);
      }
    }
  };

  const handlePanEnd = () => {
    setTimeout(() => {
      isHoveredRef.current = false;
    }, 150);
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn("flex w-full overflow-hidden mask-fade-x cursor-grab active:cursor-grabbing select-none touch-pan-y", className)}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
    >
      <motion.div className="flex shrink-0 flex-nowrap gap-5 pr-5" style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </motion.div>
  );
}
