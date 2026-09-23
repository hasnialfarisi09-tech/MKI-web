import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/sections/Reveal";
import { growthPillars, growthSection } from "@/constants/content";

export function GrowthPlanSection() {
  return (
    <section className="section-padding relative overflow-hidden bg-background">
      <div className="container relative z-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal>
          <h2 className="font-display text-[2rem] font-semibold leading-[1.1] tracking-tightest text-foreground md:text-[3rem]">
            {growthSection.title}
          </h2>
          <p className="mt-6 text-base leading-8 text-muted-foreground">{growthSection.description}</p>
        </Reveal>
        <ol className="divide-y divide-border border-y border-border">
          {growthPillars.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={index * 0.06} className="group flex items-start gap-5 py-6">
                <span className="font-display text-2xl font-semibold italic leading-none text-mki-orange">
                  0{index + 1}
                </span>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-mki-orange/10 text-mki-orange transition-all duration-500 group-hover:bg-mki-gradient group-hover:text-white group-hover:shadow-glow">
                  <Icon name={item.icon} className="size-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
