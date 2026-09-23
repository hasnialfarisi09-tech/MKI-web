import { Fragment } from "react";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/sections/Reveal";
import { Aurora } from "@/components/motion/Aurora";
import { productionMetrics, productionSection, workshopItems } from "@/constants/content";

export function ProductionCapacitySection() {
  const workshopGroups = Array.from(new Set(workshopItems.map((item) => item.group))).map((group) => {
    const items = workshopItems.filter((item) => item.group === group);
    const totalCapacity = items.reduce((total, item) => total + item.capacityValue, 0);
    const totalTeam = items.reduce((total, item) => total + item.teamValue, 0);

    return { group, items, totalCapacity, totalTeam };
  });

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <Aurora variant="soft" />
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern-grid-sm opacity-50" />
      <div className="container relative z-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tightest text-foreground md:text-[3rem]">
              {productionSection.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">{productionSection.description}</p>
            <div className="mt-7 rounded-2xl border border-mki-orange/20 bg-mki-orange/[0.06] p-5 text-sm font-semibold leading-7 text-foreground dark:text-orange-100">
              {productionSection.summary}
            </div>
          </Reveal>

          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {productionMetrics.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.05}>
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 md:p-6">
                  <div className="flex items-center gap-4 sm:contents">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-mki-gradient text-white shadow-glow">
                      <Icon name={item.icon} className="size-5" />
                    </div>
                    <div className="font-display text-3xl font-semibold tracking-tightest text-foreground sm:w-40 sm:shrink-0">
                      {item.value}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold text-foreground">{item.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.12} className="mt-10 overflow-hidden rounded-2xl border border-border bg-secondary">
          <div className="border-b border-border bg-card px-4 py-3 md:px-5">
            <h3 className="text-sm font-black text-foreground">Data Workshop Aktif</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Ringkasan kapasitas dari company overview MKI.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="bg-foreground text-background">
                <tr>
                  <th className="px-4 py-3 font-extrabold md:px-5">Area WS</th>
                  <th className="px-4 py-3 font-extrabold md:px-5">Nama WS</th>
                  <th className="px-4 py-3 font-extrabold md:px-5">Lokasi Daerah</th>
                  <th className="px-4 py-3 font-extrabold md:px-5">Pekerja</th>
                  <th className="px-4 py-3 font-extrabold md:px-5">Kapasitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {workshopGroups.map(({ group, items, totalCapacity, totalTeam }) => (
                  <Fragment key={group}>
                    <tr className="bg-orange-50 dark:bg-orange-950/30">
                      <td className="px-4 py-3 font-black uppercase tracking-[0.12em] text-mki-orange md:px-5" colSpan={5}>
                        Data WS {group}
                      </td>
                    </tr>
                    {items.map((item) => (
                      <tr key={`${item.group}-${item.name}`} className="transition hover:bg-orange-50/60 dark:hover:bg-orange-950/20">
                        <td className="px-4 py-2.5 font-bold text-foreground md:px-5">{item.group}</td>
                        <td className="px-4 py-2.5 font-bold text-foreground md:px-5">{item.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground md:px-5">{item.location}</td>
                        <td className="px-4 py-2.5 text-muted-foreground md:px-5">{item.team}</td>
                        <td className="px-4 py-2.5 text-muted-foreground md:px-5">{item.capacity}</td>
                      </tr>
                    ))}
                    <tr className="bg-green-50 dark:bg-green-950/30">
                      <td className="px-4 py-2.5 font-black text-foreground md:px-5" colSpan={3}>
                        Total Meteran {group}
                      </td>
                      <td className="px-4 py-2.5 font-black text-foreground md:px-5">{totalTeam} orang</td>
                      <td className="px-4 py-2.5 font-black text-foreground md:px-5">{totalCapacity.toLocaleString("id-ID")} meter</td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
