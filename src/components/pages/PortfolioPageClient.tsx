"use client";

import Link from "next/link";
import { useState } from "react";
import { IconArrowLeft, IconBrandWhatsapp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { richPortfolioItems } from "@/constants/portfolio";
import { Aurora } from "@/components/motion/Aurora";
import { createWhatsAppLink } from "@/lib/whatsapp";

const CATEGORIES = [
  "Semua Proyek",
  "Kitchen Set",
  "Bedroom",
  "Living Room",
  "Wardrobe",
  "Under The Stairs",
  "Lainnya",
];

export function PortfolioPageClient() {
  const [activeCategory, setActiveCategory] = useState("Semua Proyek");

  const filteredItems = activeCategory === "Semua Proyek"
    ? richPortfolioItems
    : richPortfolioItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden pb-20">
      {/* Background patterns and glows */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Aurora variant="soft" />
        <div className="absolute inset-0 bg-pattern-grid opacity-30" />
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-mki-ember/5 blur-[110px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-10">
        {/* Navigation Breadcrumb / Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-mki-orange transition-colors group mb-8"
        >
          <IconArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Beranda
        </Link>

        {/* Header Section */}
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <Badge className="bg-mki-orange/10 text-mki-orange hover:bg-mki-orange/20 border-none px-3 py-1 font-bold">
              Galeri Hasil Kerja
            </Badge>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
              {richPortfolioItems.length} Proyek Aktif
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-foreground lg:text-5xl">
            Semua Portfolio <span className="text-mki-orange font-bold">Interior Custom</span> MKI
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Eksplorasi seluruh hasil produksi furnitur dan pemasangan interior custom PT Menuju Keindahan Indonesia. Kitchen set, bedroom, wardrobe, backdrop TV, dan area bawah tangga di 28 kota di Indonesia.
          </p>
        </header>

        {/* Filter Navigation */}
        <nav className="mt-12 overflow-x-auto pb-4 scrollbar-hide">
          <ul className="flex min-w-max gap-2 pr-4 sm:justify-start">
            {CATEGORIES.map((category) => {
              const count = category === "Semua Proyek" 
                ? richPortfolioItems.length 
                : richPortfolioItems.filter(item => item.category === category).length;

              return (
                <li key={category}>
                  <button
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      activeCategory === category
                        ? "border-transparent bg-mki-gradient text-white shadow-glow"
                        : "border-border bg-card text-muted-foreground hover:border-mki-orange/30 hover:text-foreground"
                    }`}
                  >
                    {category}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                      activeCategory === category
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Portfolio Grid */}
        <main className="mt-10">
          {filteredItems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-3xl border border-dashed border-border bg-card/50 backdrop-blur-sm">
              <p className="text-muted-foreground">Belum ada portofolio untuk kategori ini.</p>
            </div>
          )}
        </main>

        {/* CTA Banner */}
        <section className="mt-20 rounded-3xl border border-mki-orange/15 bg-card/85 p-8 shadow-soft backdrop-blur-xl md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-mki-orange blur-[80px]" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl font-semibold leading-tight text-foreground">
              Ingin Mewujudkan Interior Impian Anda?
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Konsultasikan kebutuhan interior rumah, kantor, atau apartemen Anda secara gratis bersama tim desainer dan pengrajin ahli MKI. Kami siap melayani mulai dari survey lokasi, desain 3D, hingga produksi workshop dan pemasangan rapi.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" className="shadow-glow">
                <a href={createWhatsAppLink()} target="_blank" rel="noreferrer">
                  <IconBrandWhatsapp className="size-5" />
                  Hubungi Kontak Official via WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
