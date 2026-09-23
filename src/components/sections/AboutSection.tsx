import Image from "next/image";
import { IconCircleCheck } from "@tabler/icons-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Reveal } from "@/components/sections/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Aurora } from "@/components/motion/Aurora";
import { aboutContent } from "@/constants/content";

export function AboutSection() {
  return (
    <section id="about" className="section-padding relative w-full overflow-hidden bg-background">
      <Aurora variant="soft" />
      <div className="container relative z-10 grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <Reveal>
          <div className="relative">
            {/* decorative frame */}
            <div className="absolute -left-4 -top-4 hidden size-24 rounded-[2rem] border-[6px] border-mki-orange/20 lg:block" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-soft">
              <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[4/5]">
                <Parallax distance={36} className="absolute inset-0" innerClassName="absolute inset-0">
                  <Image
                    src={aboutContent.image}
                    alt={aboutContent.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 44vw, 92vw"
                    className="scale-110 object-cover"
                    loading="lazy"
                  />
                </Parallax>
                <div className="absolute inset-0 bg-gradient-to-t from-mki-navy/40 to-transparent" />
              </div>
            </div>
            {/* floating since-card */}
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-border bg-card p-5 shadow-soft sm:block">
              <div className="font-display text-3xl font-semibold text-mki-orange">2018</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Tahun berdiri
              </div>
            </div>
          </div>
        </Reveal>
        <div>
          <SectionHeader
            title={aboutContent.title}
            description={aboutContent.description}
            align="left"
            highlight={[3]}
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {aboutContent.highlights.map((item, index) => (
              <Reveal key={item} delay={index * 0.06}>
                <div className="flex h-full items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-mki-orange/40">
                  <IconCircleCheck className="size-5 shrink-0 text-mki-orange" />
                  <span className="text-sm font-bold text-foreground">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
