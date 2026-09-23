"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/motion";

type SceneContextValue = {
  /** spring-smoothed pointer offset, normalized to roughly [-0.5, 0.5] */
  mx: MotionValue<number>;
  my: MotionValue<number>;
  enabled: boolean;
};

const SceneContext = createContext<SceneContextValue | null>(null);

export function useParallaxScene() {
  return useContext(SceneContext);
}

type ParallaxSceneProps = {
  children: ReactNode;
  className?: string;
  /** multiplies pointer influence */
  strength?: number;
  /** render a soft cursor-following spotlight */
  spotlight?: boolean;
};

/**
 * Root of a 3D parallax stage. Tracks the pointer as two spring-smoothed motion
 * values (inertia) and shares them with any nested <ParallaxLayer> via context —
 * all without React re-renders, so layers stay at 60fps. Establishes a 3D
 * perspective so layers can use translateZ / rotateX / rotateY for real depth.
 * Pointer tracking is disabled for touch and prefers-reduced-motion.
 */
export function ParallaxScene({ children, className, strength = 1, spotlight = false }: ParallaxSceneProps) {
  const reduce = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  // spring smoothing = the "inertia" — the scene eases toward the cursor
  const mx = useSpring(rawX, { stiffness: 55, damping: 16, mass: 0.7 });
  const my = useSpring(rawY, { stiffness: 55, damping: 16, mass: 0.7 });

  // "Gentle ambient always-on": reduced motion softens the effect (0.4x) rather
  // than disabling it, so the scene still feels alive while staying calm.
  const factor = reduce ? 0.4 : 1;
  const enabled = true;

  const spotX = useTransform(mx, (v) => `${50 + v * 110}%`);
  const spotY = useTransform(my, (v) => `${50 + v * 110}%`);
  const spotlightBg = useMotionTemplate`radial-gradient(620px circle at ${spotX} ${spotY}, rgba(242,104,44,0.13), transparent 68%)`;

  function handlePointer(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(((event.clientX - rect.left) / rect.width - 0.5) * strength * factor);
    rawY.set(((event.clientY - rect.top) / rect.height - 0.5) * strength * factor);
  }

  function reset() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <SceneContext.Provider value={{ mx, my, enabled }}>
      <div
        ref={ref}
        onPointerMove={handlePointer}
        onPointerLeave={reset}
        className={cn("relative [perspective:1400px] [transform-style:preserve-3d]", className)}
      >
        {spotlight ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{ background: spotlightBg, opacity: reduce ? 0.6 : 1 }}
          />
        ) : null}
        {children}
      </div>
    </SceneContext.Provider>
  );
}
