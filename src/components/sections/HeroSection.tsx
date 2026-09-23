"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { IconArrowRight, IconCircleCheck, IconBrandWhatsapp } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/Magnetic";
import { TextReveal } from "@/components/motion/TextReveal";
import { ParallaxScene } from "@/components/motion/ParallaxScene";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { ctaLabels, heroContent } from "@/constants/content";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { useSafeReducedMotion } from "@/lib/motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function HeroSection() {
  const reduce = useSafeReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // ── Cinematic scroll: the scene recedes, scales and fades as you scroll past ──
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 24 : 60]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 0.99 : 0.96]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, reduce ? 0.7 : 0.45]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 50 : 120]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1.05 : 1.12]);

  const stageStyle = { y: stageY, scale: stageScale, opacity: stageOpacity };
  const bgStyle = { y: bgY, scale: bgScale };

  const executionPoints = [
    "Workshop aktif lintas area",
    "Alur produksi & instalasi terstruktur",
    "Quality control sampai final checking",
  ];

  const capacityStats = [
    { value: "2.690m", label: "Kapasitas / bln" },
    { value: "23", label: "Workshop" },
    { value: "156", label: "Personel WS" },
  ];

  // `animate` always resolves to the visible state, so flipping `reduce` after
  // mount can never freeze an element mid-fade. Only the entry is gated.
  const anim = (i: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : { variants: fadeUp, custom: i, initial: "hidden" as const, animate: "show" as const };

  return (
    <section id="home" ref={heroRef} className="relative overflow-hidden bg-background">
      <ParallaxScene strength={1} spotlight className="pt-24 md:pt-28">
        {/* ── Background depth field — one gesture, not a scatter of blobs ── */}
        <motion.div style={bgStyle} className="absolute inset-0 z-0">
          <ParallaxLayer depth={-26} decorative className="absolute inset-0">
            <div
              className="absolute inset-y-0 left-0 w-full lg:w-[62%]"
              style={{
                background:
                  "radial-gradient(60% 55% at 22% 30%, rgba(242,104,44,0.16), transparent 72%)",
              }}
            />
          </ParallaxLayer>

          <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-secondary/70 to-transparent" />
        </motion.div>

        {/* ── Foreground content stage ───────────────────────── */}
        <motion.div style={stageStyle} className="relative z-10">
          <div className="container grid items-center gap-12 pb-16 pt-6 md:pb-20 lg:min-h-[calc(100svh-11rem)] lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
            {/* Left — text (subtle depth so it stays readable) */}
            <ParallaxLayer depth={8} className="[transform-style:preserve-3d]">
              <motion.span {...anim(0)} className="eyebrow">
                {heroContent.badge} · Interior Manufacturing
              </motion.span>

              <h1 className="mt-6 max-w-3xl font-display text-[2.7rem] font-semibold leading-[1.1] tracking-tightest text-foreground sm:text-[3.75rem] lg:text-[4.1rem] xl:text-[4.6rem]">
                <TextReveal text="Wujudkan Interior" delay={0.2} />
                <br />
                <span className="inline-block pb-1">
                  <TextReveal text="Premium Terukur" delay={0.42} highlight={[0]} />
                </span>
              </h1>

              <motion.p
                {...anim(4)}
                className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg"
              >
                {heroContent.description}
              </motion.p>

              <motion.div {...anim(5)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Magnetic>
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <a href={createWhatsAppLink()} target="_blank" rel="noreferrer">
                      <IconBrandWhatsapp className="size-5" />
                      {ctaLabels.consult}
                    </a>
                  </Button>
                </Magnetic>
                <Button asChild variant="secondary" size="lg" className="group w-full sm:w-auto">
                  <a href="#portfolio">
                    {ctaLabels.portfolio}
                    <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </motion.div>

              <motion.div
                {...anim(6)}
                className="mt-9 grid max-w-2xl grid-cols-1 gap-3 min-[420px]:grid-cols-3"
              >
                {heroContent.miniStats.map((item) => (
                  <div
                    key={item.label}
                    className="group rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-sm transition-colors hover:border-mki-orange/40"
                  >
                    <div className="font-display text-3xl font-semibold text-foreground">{item.value}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </ParallaxLayer>

            {/* Right — image card with stronger depth + 3D tilt */}
            <ParallaxLayer
              depth={30}
              rotate={7}
              z={40}
              className="relative mx-auto w-full max-w-xl lg:max-w-none"
            >
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative [transform-style:preserve-3d]"
              >
                {/* main image frame */}
                <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft">
                  <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/5]">
                    <Image
                      src={heroContent.image}
                      alt={heroContent.imageAlt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 46vw, 92vw"
                      className="scale-105 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mki-navy/70 via-transparent to-transparent" />
                  </div>
                </div>

                {/* unified spec dock — one surface for capacity stats + execution proof,
                    replacing what used to be two separately floating cards */}
                <ParallaxLayer
                  depth={48}
                  z={55}
                  className="relative z-20 mx-3 -mt-10 rounded-2xl border border-border bg-card p-4 shadow-soft sm:mx-6"
                >
                  <div className="grid grid-cols-3 divide-x divide-border">
                    {capacityStats.map((m) => (
                      <div key={m.label} className="px-2 text-center first:pl-0 last:pr-0">
                        <div className="font-display text-lg font-semibold text-foreground sm:text-xl">{m.value}</div>
                        <div className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-muted-foreground">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-2 border-t border-border pt-3">
                    {executionPoints.map((point) => (
                      <div key={point} className="flex items-center gap-2.5 text-xs font-bold text-foreground sm:text-sm">
                        <IconCircleCheck className="size-4 shrink-0 text-mki-orange" />
                        {point}
                      </div>
                    ))}
                  </div>
                </ParallaxLayer>
              </motion.div>
            </ParallaxLayer>
          </div>
        </motion.div>
      </ParallaxScene>
    </section>
  );
}
