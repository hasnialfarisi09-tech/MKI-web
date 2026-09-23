import { ServiceCard } from "@/components/cards/ServiceCard";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { serviceSection, services } from "@/constants/content";
import { Reveal } from "@/components/sections/Reveal";
import { Aurora } from "@/components/motion/Aurora";

export function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-background relative overflow-hidden">
      <Aurora variant="soft" />
      <div className="container relative z-10">
        <SectionHeader
          title={serviceSection.title}
          description={serviceSection.description}
          align="left"
          highlight={[3]}
        />
        <div className="mt-14 grid gap-5 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.05}
              className={index === 0 ? "sm:col-span-2 lg:col-span-2" : undefined}
            >
              <ServiceCard item={item} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
