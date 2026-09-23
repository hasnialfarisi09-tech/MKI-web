"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import { Icon } from "@/components/ui/icon";
import { Tilt } from "@/components/motion/Tilt";
import type { ServiceItem } from "@/constants/types";

type ServiceCardProps = {
  item: ServiceItem;
  index: number;
};

export function ServiceCard({ item, index }: ServiceCardProps) {
  return (
    <Tilt max={6} className="h-full [transform-style:preserve-3d]">
      <article className="group relative h-full overflow-hidden rounded-[1.4rem] border border-border bg-card p-7 shadow-soft transition-colors duration-500 hover:border-mki-orange/40">
        {/* hover wash */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-mki-gradient transition-transform duration-500 group-hover:scale-x-100" />
        <div className="flex items-start justify-between gap-6">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-mki-orange/10 text-mki-orange transition-all duration-500 group-hover:bg-mki-gradient group-hover:text-white group-hover:shadow-glow">
            <Icon name={item.icon} className="size-6" />
          </div>
          <span className="font-display text-3xl font-semibold italic text-border transition-colors duration-500 group-hover:text-mki-orange/30">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="mt-8 font-display text-xl font-semibold text-foreground">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.details.map((detail) => (
            <span
              key={detail}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground"
            >
              {detail}
            </span>
          ))}
        </div>
        <div className="mt-8 inline-flex size-10 items-center justify-center rounded-full border border-border text-mki-orange transition-all duration-500 group-hover:border-mki-orange group-hover:bg-mki-orange group-hover:text-white">
          <IconArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
        </div>
      </article>
    </Tilt>
  );
}
