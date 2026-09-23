"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useParallaxScene } from "./ParallaxScene";
import { cn } from "@/lib/utils";

type ParallaxLayerProps = {
  children: ReactNode;
  className?: string;
  /** px of pointer-driven translation across a full swing (negative = moves opposite) */
  depth?: number;
  /** degrees of pointer-driven 3D tilt */
  rotate?: number;
  /** static z translation (px) for depth ordering within the 3D scene */
  z?: number;
  /** lock pointer interactivity off (decorative layers) */
  decorative?: boolean;
};

/**
 * A depth layer inside a <ParallaxScene>. Translates (and optionally tilts in 3D)
 * in response to the scene's spring-smoothed pointer values. Larger `depth`
 * reads as closer to the viewer. All movement is GPU-composited transforms.
 */
export function ParallaxLayer({
  children,
  className,
  depth = 24,
  rotate = 0,
  z = 0,
  decorative = false,
}: ParallaxLayerProps) {
  const scene = useParallaxScene();
  const fallback = useMotionValue(0);
  const mx = scene?.mx ?? fallback;
  const my = scene?.my ?? fallback;

  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  const rotateY = useTransform(mx, (v) => v * rotate);
  const rotateX = useTransform(my, (v) => v * -rotate);

  return (
    <motion.div
      className={cn("[transform-style:preserve-3d]", decorative && "pointer-events-none", className)}
      style={{ x, y, rotateX, rotateY, z, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
