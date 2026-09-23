"use client";

import { Icon } from "@/components/ui/icon";
import { Tilt } from "@/components/motion/Tilt";
import type { FeatureItem } from "@/constants/types";

type FeatureCardProps = {
  item: FeatureItem;
};

export function FeatureCard({ item }: FeatureCardProps) {
  return (
    <Tilt max={5} className="h-full [transform-style:preserve-3d]">
      <article className="group relative h-full overflow-hidden rounded-[1.4rem] border border-border bg-card p-7 shadow-soft transition-colors duration-500 hover:border-mki-orange/40">
        <div className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-mki-orange/10 text-mki-orange transition-all duration-500 group-hover:bg-mki-gradient group-hover:text-white group-hover:shadow-glow dark:bg-orange-500/10">
          <Icon name={item.icon} className="size-6" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
      </article>
    </Tilt>
  );
}
