import Image from "next/image";
import { IconMapPin } from "@tabler/icons-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Reveal } from "@/components/sections/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { coverageCities, coverageSection } from "@/constants/content";

export function CoverageSection() {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="container relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
        <Reveal>
          <SectionHeader
            title={coverageSection.title}
            description={coverageSection.description}
            align="left"
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {coverageSection.highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-mki-orange/40"
              >
                <div className="font-display text-3xl font-semibold text-foreground">{item.value}</div>
                <div className="mt-2 text-sm font-bold text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900/40 dark:bg-orange-950/30">
            <h3 className="text-base font-black text-foreground">{coverageSection.projectRecord.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{coverageSection.projectRecord.description}</p>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-soft">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Parallax distance={32} className="absolute inset-0" innerClassName="absolute inset-0">
                <Image
                  src={coverageSection.image}
                  alt={coverageSection.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="scale-110 object-cover"
                  loading="lazy"
                />
              </Parallax>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-mki-navy/55 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-card/95 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-mki-gradient text-white">
                  <IconMapPin className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-foreground">{coverageSection.highlights[0].value}</p>
                  <p className="text-sm text-muted-foreground">{coverageSection.highlights[1].value}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 -top-4 hidden size-20 rounded-[1.75rem] bg-mki-gradient lg:block" />
        </Reveal>
      </div>
      <div className="container relative z-10 mt-10">
        <Reveal className="rounded-3xl border border-border bg-secondary p-5 md:p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-xl font-black text-foreground">Daftar Kota dan Kabupaten Coverage</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">Area project yang tercatat pada portfolio 2021-2026.</p>
            </div>
            <p className="text-sm font-extrabold text-mki-orange">{coverageCities.length} area</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {coverageCities.map((city) => (
              <span
                key={`${city.type}-${city.name}`}
                className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-muted-foreground transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-mki-orange dark:hover:border-orange-700"
              >
                {city.type} {city.name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
