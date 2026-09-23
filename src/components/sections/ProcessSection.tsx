"use client";

import { useRef, useState, type ComponentType } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import {
  IconCircleCheckFilled,
  IconBuildingFactory2,
  IconTruck,
  IconFileText,
  IconHeartHandshake,
  IconMapPin,
  IconMessageCircle,
  IconRulerMeasure,
  IconRuler,
  IconSearch,
} from "@tabler/icons-react";
import { processSection, processSteps } from "@/constants/content";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Aurora } from "@/components/motion/Aurora";
import { useSafeReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ProcessStep } from "@/constants/types";

type StepIcon = ComponentType<{ className?: string }>;

const processIcons: StepIcon[] = [
  IconMessageCircle,
  IconMapPin,
  IconRuler,
  IconRulerMeasure,
  IconFileText,
  IconBuildingFactory2,
  IconCircleCheckFilled,
  IconTruck,
  IconSearch,
  IconHeartHandshake,
];

type TimelineStepProps = {
  step: ProcessStep;
  index: number;
  Icon: StepIcon;
  side: "left" | "right";
  active: boolean;
  reached: boolean;
  reduce: boolean;
  onSelect: () => void;
};

function TimelineStep({ step, index, Icon, side, active, reached, reduce, onSelect }: TimelineStepProps) {
  // a node is "lit" once scrolled past (reached) or selected by click
  const lit = reached || active;
  // `animate`/`whileInView` always resolves to the visible state, so flipping
  // `reduce` after mount can't freeze a not-yet-revealed card at opacity 0.
  const reveal = (extra: object = {}) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, y: 0, scale: 1 } }
      : {
          initial: { opacity: 0, y: 28, ...extra },
          whileInView: { opacity: 1, y: 0, scale: 1 },
          viewport: { once: true, margin: "0px 0px -14% 0px" },
          transition: { duration: 0.6, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <li className="relative grid pb-10 last:pb-0 lg:grid-cols-2 lg:gap-x-16 lg:pb-16">
      {/* Node on the line */}
      <div className="absolute left-[26px] top-1 z-20 -translate-x-1/2 lg:left-1/2">
        <motion.span
          {...(reduce
            ? { initial: false as const, animate: { scale: 1, opacity: 1 } }
            : {
                initial: { scale: 0.4, opacity: 0 },
                whileInView: { scale: 1, opacity: 1 },
                viewport: { once: true, margin: "0px 0px -16% 0px" },
                transition: { duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] as const },
              })}
          className={cn(
            // ring in the section bg color = a clean gap so the line never touches the icon
            "relative flex size-12 items-center justify-center rounded-2xl border ring-[6px] ring-secondary transition-all duration-500",
            lit
              ? "border-transparent bg-mki-gradient text-white shadow-glow"
              : "border-border bg-card text-mki-orange",
          )}
        >
          {active ? (
            <span className="absolute inset-0 -z-10 animate-ping rounded-2xl bg-mki-orange/30" />
          ) : null}
          <Icon className="size-5" />
        </motion.span>
      </div>

      {/* Card */}
      <motion.div
        {...reveal({ scale: 0.98 })}
        className={cn(
          "pl-16 lg:pl-0 relative z-10",
          side === "left"
            ? "lg:col-start-1 lg:pr-16 lg:text-right"
            : "lg:col-start-2 lg:row-start-1 lg:pl-16",
        )}
      >
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={active}
          className={cn(
            "group w-full rounded-[1.4rem] border p-6 text-left shadow-soft backdrop-blur-sm transition-all duration-500 hover:-translate-y-1",
            active
              ? "border-mki-orange/45 bg-card shadow-glow"
              : lit
                ? "border-mki-orange/25 bg-card/90 shadow-sm"
                : "border-border bg-card/70 hover:border-mki-orange/30",
            side === "left" && "lg:text-right",
          )}
        >
          <div className={cn("flex items-center gap-3", side === "left" && "lg:flex-row-reverse")}>
            <span
              className={cn(
                "font-display text-3xl font-semibold italic leading-none transition-colors duration-500",
                lit ? "text-mki-orange" : "text-border group-hover:text-mki-orange/40",
              )}
            >
              {step.step}
            </span>
            <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
              {step.title}
            </h3>
          </div>
          {step.description ? (
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
          ) : null}
        </button>
      </motion.div>
    </li>
  );
}

export function ProcessSection() {
  const reduce = useSafeReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const [reached, setReached] = useState(0);
  const timelineRef = useRef<HTMLOListElement>(null);

  // Scroll-driven progress: the line fills as the timeline passes through view.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 85%"],
  });
  const fillScaleY = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);
  const pct = useTransform(scrollYProgress, (v) => `${Math.round(Math.min(Math.max(v, 0), 1) * 100)}%`);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reduce) return;
    let currentReached = 0;
    for (let i = 0; i < 10; i++) {
      if (latest >= (i / 9) - 0.02) {
        currentReached = i;
      }
    }
    setReached(currentReached);
    setActive(currentReached);
  });

  return (
    <section className="section-padding relative bg-secondary">
      {/* Architectural blueprint background (clipped here, NOT on the section,
          so the section can host a position:sticky progress indicator) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Aurora variant="soft" />
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-mki-ember/10 blur-[110px]" />
      </div>

      <div className="container relative z-10">
        <SectionHeader
          eyebrow={processSection.eyebrow}
          title={processSection.title}
          description={processSection.description}
          highlight={[2]}
        />

        {/* Sticky live progress indicator */}
        <div className="sticky top-24 z-30 mx-auto mt-10 flex max-w-md items-center gap-4 rounded-full border border-border bg-card/85 px-5 py-3 shadow-soft backdrop-blur-xl">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Progress
          </span>
          <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <motion.div
              style={{ scaleX: fillScaleY, transformOrigin: "left" }}
              className="absolute inset-0 rounded-full bg-mki-gradient"
            />
          </div>
          <motion.span className="w-10 text-right font-display text-base font-semibold text-mki-orange">
            {pct}
          </motion.span>
        </div>

        {/* Timeline */}
        <ol ref={timelineRef} className="relative mx-auto mt-14 max-w-5xl">
          {/* Curving Snake Timeline Line */}
          <svg
            className="absolute left-[26px] top-2 h-[calc(100%-1rem)] w-[48px] -translate-x-1/2 pointer-events-none lg:left-1/2 lg:w-[150px] z-0"
            viewBox="0 0 100 900"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="mki-timeline-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F2682C" />
                <stop offset="100%" stopColor="#B23A18" />
              </linearGradient>
            </defs>
            {/* Background path (static grey track) */}
            <path
              d="M 50 0 C 50 25, 25 25, 25 50 C 25 75, 50 75, 50 100 C 50 125, 75 125, 75 150 C 75 175, 50 175, 50 200 C 50 225, 25 225, 25 250 C 25 275, 50 275, 50 300 C 50 325, 75 325, 75 350 C 75 375, 50 375, 50 400 C 50 425, 25 425, 25 450 C 25 475, 50 475, 50 500 C 50 525, 75 525, 75 550 C 75 575, 50 575, 50 600 C 50 625, 25 625, 25 650 C 25 675, 50 675, 50 700 C 50 725, 75 725, 75 750 C 75 775, 50 775, 50 800 C 50 825, 25 825, 25 850 C 25 875, 50 875, 50 900"
              fill="none"
              stroke="currentColor"
              className="text-border"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Foreground path (animated gradient snake fill) */}
            <motion.path
              d="M 50 0 C 50 25, 25 25, 25 50 C 25 75, 50 75, 50 100 C 50 125, 75 125, 75 150 C 75 175, 50 175, 50 200 C 50 225, 25 225, 25 250 C 25 275, 50 275, 50 300 C 50 325, 75 325, 75 350 C 75 375, 50 375, 50 400 C 50 425, 25 425, 25 450 C 25 475, 50 475, 50 500 C 50 525, 75 525, 75 550 C 75 575, 50 575, 50 600 C 50 625, 25 625, 25 650 C 25 675, 50 675, 50 700 C 50 725, 75 725, 75 750 C 75 775, 50 775, 50 800 C 50 825, 25 825, 25 850 C 25 875, 50 875, 50 900"
              fill="none"
              stroke="url(#mki-timeline-gradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              pathLength={fillScaleY}
            />
          </svg>

          {processSteps.map((step, index) => (
            <TimelineStep
              key={step.step}
              step={step}
              index={index}
              Icon={processIcons[index] ?? IconCircleCheckFilled}
              side={index % 2 === 0 ? "left" : "right"}
              active={active === index}
              reached={index <= reached}
              reduce={reduce}
              onSelect={() => setActive(index)}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
