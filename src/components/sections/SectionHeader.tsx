"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { TextReveal } from "@/components/motion/TextReveal";
import { cn } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/motion";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  /** 0-based word indices rendered in accent serif italic */
  highlight?: number[];
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  highlight,
}: SectionHeaderProps) {
  const reduce = useSafeReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {
          initial: false as const,
          animate: { opacity: 1, y: 0 },
        }
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "0px 0px -10% 0px" },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow ? (
        <motion.div {...fade(0)} className={cn(align === "center" && "flex justify-center")}>
          <Badge className={dark ? "border-white/15 bg-white/10 text-white" : undefined}>{eyebrow}</Badge>
        </motion.div>
      ) : null}
      <h2
        className={cn(
          "font-display text-[2rem] font-semibold leading-[1.08] tracking-tightest md:text-[3rem] lg:text-[3.4rem]",
          eyebrow && "mt-6",
          dark ? "text-white" : "text-foreground",
        )}
      >
        <TextReveal text={title} highlight={highlight} />
      </h2>
      {description ? (
        <motion.p
          {...fade(0.15)}
          className={cn(
            "mt-6 text-base leading-8 md:text-lg",
            dark ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}
