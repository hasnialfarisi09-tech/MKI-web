"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  /** seconds for one full loop */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
};

/**
 * Infinite horizontal marquee using a pure-CSS keyframe (no JS scroll work).
 * Children are duplicated so the loop is seamless; edges fade via `.mask-fade-x`.
 */
export function Marquee({
  children,
  className,
  duration = 38,
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div className={cn("group flex w-full overflow-hidden mask-fade-x", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 items-stretch gap-5 pr-5 animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as CSSProperties
        }
      >
        {children}
        {children}
      </div>
    </div>
  );
}
