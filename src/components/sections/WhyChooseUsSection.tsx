import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { features, whyChooseSection } from "@/constants/content";
import { Reveal } from "@/components/sections/Reveal";
import { cn } from "@/lib/utils";

export function WhyChooseUsSection() {
  return (
    <section id="why-us" className="section-padding bg-background relative overflow-hidden">
      <div className="container relative z-10">
        <SectionHeader
          title={whyChooseSection.title}
          description={whyChooseSection.description}
          highlight={[2]}
        />
        <div className="mt-14 grid border-t border-border md:grid-cols-2">
          {features.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.05}
              className={cn(
                "flex items-start gap-4 border-b border-border py-6 md:px-8",
                index % 2 === 1 && "md:border-l",
              )}
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-mki-orange/10 text-mki-orange dark:bg-orange-500/10">
                <Icon name={item.icon} className="size-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
