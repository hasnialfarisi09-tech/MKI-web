"use client";

import { IconCircleCheck, IconBrandWhatsapp } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ctaLabels, partnerships, partnershipSection } from "@/constants/content";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Aurora } from "@/components/motion/Aurora";
import { Magnetic } from "@/components/motion/Magnetic";
import { createWhatsAppLink } from "@/lib/whatsapp";

export function PartnershipSection() {
  return (
    <section id="partnership" className="section-padding relative overflow-hidden bg-[#17110C]">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 55% at 50% 0%, rgba(242, 104, 44, 0.08), transparent 70%)`,
        }}
      />
      <Aurora variant="ember" className="opacity-20" />
      <div className="container relative z-10">
        <SectionHeader
          title={partnershipSection.title}
          description={partnershipSection.description}
          dark
        />
        <Tabs defaultValue={partnerships[0].id} className="mt-10">
          <div className="pb-2 sm:flex sm:justify-center">
            <TabsList className="grid w-full min-w-0 grid-cols-3 gap-1 border-white/10 bg-white/10 sm:inline-grid sm:w-auto sm:min-w-[24rem] sm:gap-2">
              {partnerships.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="min-w-0 px-3 text-xs text-white/70 hover:text-white data-[state=active]:text-white min-[420px]:text-sm sm:px-4"
                >
                  {item.segment}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {partnerships.map((item) => (
            <TabsContent key={item.id} value={item.id}>
              <div className="grid items-center gap-8 rounded-[1.75rem] border border-white/10 bg-[#1E160F]/90 p-6 shadow-[0_28px_90px_rgba(242,104,44,0.18),0_0_0_1px_rgba(242,104,44,0.06)] backdrop-blur-xl md:p-10 lg:grid-cols-[0.85fr_1fr]">
                <div>
                  <div className="inline-flex rounded-full bg-mki-gradient px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white">
                    {item.label}
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-semibold leading-[1.08] tracking-tightest text-white md:text-[3rem]">
                    {item.title}
                  </h3>
                  <p className="mt-5 text-base leading-8 text-white/70">{item.description}</p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {item.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-colors hover:border-mki-orange/40">
                        <div className="font-display text-2xl font-semibold text-white">{metric.value}</div>
                        <div className="mt-1 text-xs font-bold uppercase leading-5 tracking-wide text-white/55">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                  <Magnetic className="mt-8 inline-block">
                    <Button asChild size="lg">
                      <a href={createWhatsAppLink({ category: item.label }, { recipient: "partnership" })} target="_blank" rel="noreferrer">
                        <IconBrandWhatsapp className="size-5" />
                        {ctaLabels.partnership}
                      </a>
                    </Button>
                  </Magnetic>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {item.points.map((point) => (
                    <div key={point} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition-colors hover:border-mki-orange/30">
                      <IconCircleCheck className="mb-5 size-6 text-mki-orange" />
                      <p className="text-sm font-bold leading-6 text-white/90">{point}</p>
                    </div>
                  ))}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 sm:col-span-2">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-mki-orange">Output Kemitraan</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {item.outcomes.map((outcome) => (
                        <p key={outcome} className="flex gap-2 text-sm font-semibold leading-6 text-white/70">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-mki-orange" />
                          {outcome}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
