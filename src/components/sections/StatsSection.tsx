import { Icon } from "@/components/ui/icon";
import { AnimatedValue } from "@/components/ui/animated-value";
import { stats } from "@/constants/content";
import { Reveal } from "@/components/sections/Reveal";

export function StatsSection() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-secondary/50 py-16 md:py-20">
      <div className="container relative z-10">
        <Reveal className="mb-10 max-w-2xl">
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tightest text-foreground md:text-4xl">
            Angka yang berbicara soal kapasitas
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:border-t-0 lg:grid-cols-6">
          {stats.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.05} className="py-6 pr-4 sm:px-5 sm:py-2 lg:px-6">
              <Icon name={item.icon} className="size-5 text-mki-orange" />
              <div className="mt-4 font-display text-3xl font-semibold leading-none tracking-tightest text-foreground md:text-[2.25rem]">
                <AnimatedValue value={item.value} />
              </div>
              <div className="mt-2 text-sm font-bold text-foreground">{item.label}</div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
