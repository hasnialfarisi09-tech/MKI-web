"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/motion";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** max rotation in degrees */
  max?: number;
  /** show a soft light glare that tracks the cursor */
  glare?: boolean;
};

/**
 * Interactive 3D tilt on pointer move, with spring smoothing and an optional
 * cursor-tracking glare. Falls back to a static container when the user
 * prefers reduced motion.
 */
export function Tilt({ children, className, max = 7, glare = true }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);
  const glareBg = useMotionTemplate`radial-gradient(380px circle at ${glareX} ${glareY}, rgba(242,104,44,0.16), transparent 60%)`;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 1000 }}
      className={cn("relative", className)}
    >
      {children}
      {glare ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBg }}
        />
      ) : null}
    </motion.div>
  );
}
