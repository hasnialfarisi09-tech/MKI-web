"use client";

import { motion, type Variants } from "motion/react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/motion";

type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  /** index of words (0-based) to render in the accent serif italic */
  highlight?: number[];
};

const container: Variants = {
  hidden: {},
  show: (delay: number = 0) => ({
    transition: { staggerChildren: 0.045, delayChildren: delay },
  }),
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Word-by-word staggered reveal for hero/section headlines. Selected words can
 * be highlighted in the accent serif italic for an editorial pull-quote feel.
 */
export function TextReveal({ text, className, delay = 0, highlight = [] }: TextRevealProps) {
  const reduce = useSafeReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return (
      <span className={className}>
        {words.map((w, i) => (
          <Fragment key={i}>
            {highlight.includes(i) ? <em className="font-display italic text-mki-orange">{w}</em> : w}
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
    );
  }

  return (
    <motion.span
      className={cn("inline-block", className)}
      variants={container}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block align-bottom">
          <motion.span variants={word} className="inline-block">
            {highlight.includes(i) ? (
              <em className="font-display italic text-mki-orange">{w}</em>
            ) : (
              w
            )}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
