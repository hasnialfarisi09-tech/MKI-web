import Image from "next/image";
import { clientLogos, socialProofSection } from "@/constants/content";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { Parallax } from "@/components/motion/Parallax";
import { Aurora } from "@/components/motion/Aurora";
import { cn } from "@/lib/utils";
import type { LogoItem } from "@/constants/types";

function LogoChip({ item }: { item: LogoItem }) {
  const inner = (
    <>
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-card">
        {item.logo ? (
          <Image
            src={item.logo}
            alt={`Logo ${item.name}`}
            width={64}
            height={64}
            className={cn(
              "h-full w-full rounded-full object-center grayscale transition duration-500 group-hover/chip:grayscale-0",
              item.logoFit === "cover" ? "object-cover" : "object-contain",
              item.logoFit !== "cover" && item.logoPadding !== "none" && "p-2",
            )}
          />
        ) : (
          <span className="flex size-full items-center justify-center rounded-full bg-secondary text-sm font-black text-foreground">
            {item.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-display text-base font-semibold text-foreground">{item.name}</h3>
        <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">{item.descriptor}</p>
      </div>
    </>
  );

  const className =
    "group/chip flex w-[16rem] shrink-0 items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm transition-colors duration-300 hover:border-mki-orange/40";

  return item.href ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <div className={className}>{inner}</div>
  );
}

export function SocialProofSection() {
  const half = Math.ceil(clientLogos.length / 2);
  const rowOne = clientLogos.slice(0, half);
  const rowTwo = clientLogos.slice(half);

  return (
    <section className="section-padding bg-secondary/50 relative overflow-hidden">
      <Aurora variant="soft" />
      <div className="container relative z-10">
        <Parallax distance={28}>
          <SectionHeader
            title={socialProofSection.title}
            description={socialProofSection.description}
            highlight={[2]}
          />
        </Parallax>
      </div>
      <div className="relative z-10 mt-14 flex flex-col gap-5">
        <VelocityMarquee baseVelocity={1.0}>
          {rowOne.map((item) => (
            <LogoChip key={item.name} item={item} />
          ))}
        </VelocityMarquee>
        <VelocityMarquee baseVelocity={-1.0}>
          {rowTwo.map((item) => (
            <LogoChip key={item.name} item={item} />
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}
