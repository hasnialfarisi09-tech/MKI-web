"use client";

import { Icon } from "@/components/ui/icon";
import { AnimatedValue } from "@/components/ui/animated-value";
import { Tilt } from "@/components/motion/Tilt";
import type { StatItem } from "@/constants/types";

type StatCardProps = {
  item: StatItem;
};

export function StatCard({ item }: StatCardProps) {
  return (
    <Tilt max={6} className="h-full [transform-style:preserve-3d]">
      <div className="group relative h-full overflow-hidden rounded-[1.4rem] border border-border bg-card p-6 shadow-soft transition-colors duration-500 hover:border-mki-orange/40">
        <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-mki-orange/[0.06] blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
        <div className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-mki-orange/10 text-mki-orange transition-all duration-500 group-hover:bg-mki-gradient group-hover:text-white group-hover:shadow-glow">
          <Icon name={item.icon} className="size-6" />
        </div>
        <div className="font-display text-[2.75rem] font-semibold leading-none tracking-tightest text-foreground">
          <AnimatedValue value={item.value} />
        </div>
        <div className="mt-3 text-base font-bold text-foreground">{item.label}</div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
      </div>
    </Tilt>
  );
}
