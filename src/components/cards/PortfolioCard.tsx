"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { IconEye, IconChevronLeft, IconChevronRight, IconBrandWhatsapp } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tilt } from "@/components/motion/Tilt";
import { cn } from "@/lib/utils";
import { createWhatsAppLink } from "@/lib/whatsapp";
import type { RichPortfolioItem } from "@/constants/portfolio";

type PortfolioCardProps = {
  item: RichPortfolioItem;
};

export function PortfolioCard({ item }: PortfolioCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const hasMultiple = item.images.length > 1;

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1));
  }, [item.images.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === item.images.length - 1 ? 0 : prev + 1));
  }, [item.images.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    goPrev();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    goNext();
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setCurrentIndex(0); // Reset to first image when opened
    }
  };

  // Keyboard navigation while the lightbox is open (Esc is handled by Radix Dialog).
  useEffect(() => {
    if (!open || !hasMultiple) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, hasMultiple, goPrev, goNext]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="group w-full text-left [transform-style:preserve-3d]" asChild>
        <div>
          <Tilt max={7} glare={false} className="[transform-style:preserve-3d]">
            <article className="overflow-hidden rounded-[1.4rem] border border-border bg-card shadow-soft transition-colors duration-500 group-hover:border-mki-orange/40">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mki-navy/75 via-mki-navy/10 to-transparent" />
                
                {/* Top badge row — compact chips, spaced apart so they fit even on narrow cards */}
                <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                  {/* Category Badge */}
                  <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 bg-white/90 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide text-mki-orange backdrop-blur">
                    <span className="size-1.5 shrink-0 rounded-full bg-mki-orange" />
                    {item.category}
                  </span>

                  {/* Photo Count Badge */}
                  {item.images.length > 1 ? (
                    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/10 bg-black/65 px-2.5 py-1 text-[0.625rem] font-bold text-white/90 backdrop-blur">
                      📷 {item.images.length} Foto
                    </span>
                  ) : null}
                </div>

                <div className="absolute bottom-4 right-4 inline-flex size-11 translate-y-2 items-center justify-center rounded-full bg-mki-gradient text-white opacity-0 shadow-glow transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <IconEye className="size-5" />
                </div>
                <div className="absolute bottom-4 left-4 right-16 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="font-display text-lg font-semibold text-white drop-shadow">{item.title}</h3>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            </article>
          </Tilt>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl overflow-hidden p-0">
        <DialogTitle className="sr-only">{item.title}</DialogTitle>

        <div className="grid grid-cols-1 lg:max-h-[86vh] lg:grid-cols-[1.65fr_1fr]">
          {/* ── Image gallery pane — full image, no crop ── */}
          <div className="group/carousel relative flex h-[28vh] min-h-[180px] items-center justify-center overflow-hidden bg-secondary/50 dark:bg-mki-navy sm:h-[38vh] lg:h-[86vh]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(242,104,44,0.12),transparent_60%)]" />
            <AnimatePresence>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, filter: "blur(8px)", scale: 1.01 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(8px)", scale: 0.99 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center touch-pan-y"
                onPanEnd={item.images.length > 1 ? (e, info) => {
                  const swipeThreshold = 40;
                  if (info.offset.x < -swipeThreshold) {
                    goNext();
                  } else if (info.offset.x > swipeThreshold) {
                    goPrev();
                  }
                } : undefined}
              >
                <Image
                  src={item.images[currentIndex]}
                  alt={`${item.title} - foto ${currentIndex + 1}`}
                  fill
                  sizes="(min-width: 1024px) 60vw, 92vw"
                  className="object-contain pointer-events-none"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {item.images.length > 1 ? (
              <div className="absolute left-4 top-4 select-none rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-sm">
                {currentIndex + 1} / {item.images.length}
              </div>
            ) : null}

            {item.images.length > 1 ? (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-mki-gradient active:scale-95 sm:left-4"
                  aria-label="Foto Sebelumnya"
                >
                  <IconChevronLeft className="size-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-mki-gradient active:scale-95 sm:right-4"
                  aria-label="Foto Selanjutnya"
                >
                  <IconChevronRight className="size-5" />
                </button>
              </>
            ) : null}
          </div>

          {/* ── Info pane ── */}
          <div className="flex min-h-0 flex-col bg-card p-4 sm:p-6 lg:max-h-[86vh] lg:p-8 lg:overflow-y-auto">
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-mki-orange/10 px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-mki-orange sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
              <span className="size-1.5 rounded-full bg-mki-orange" />
              {item.category}
            </span>
            <h3 className="mt-2 font-display text-lg font-semibold leading-tight text-foreground sm:mt-4 sm:text-2xl md:text-[2rem]">
              {item.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm sm:leading-7">{item.description}</p>

            {/* Thumbnail strip */}
            {item.images.length > 1 ? (
              <div className="mt-3 sm:mt-6">
                <p className="mb-1.5 text-[0.625rem] font-bold uppercase tracking-wide text-muted-foreground/70 sm:mb-2 sm:text-xs">
                  {item.images.length} Foto
                </p>
                <div className="flex gap-1.5 sm:gap-2">
                  {item.images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      aria-label={`Lihat foto ${i + 1}`}
                      className={cn(
                        "relative aspect-square w-full max-w-[44px] overflow-hidden rounded-lg border-2 transition-all duration-300 sm:max-w-[64px] sm:rounded-xl",
                        i === currentIndex
                          ? "border-mki-orange opacity-100"
                          : "border-transparent opacity-55 hover:opacity-100",
                      )}
                    >
                      <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* CTA */}
            <div className="mt-auto pt-3 sm:pt-8">
              <div className="rounded-xl border border-border bg-secondary/60 p-3 sm:rounded-2xl sm:p-4">
                <p className="font-display text-sm font-semibold text-foreground sm:text-base">Suka dengan desain ini?</p>
                <p className="mt-0.5 text-[0.7rem] leading-normal text-muted-foreground sm:mt-1 sm:text-xs sm:leading-6">
                  Konsultasikan interior serupa untuk hunian atau ruang komersial Anda.
                </p>
                <Button asChild size="lg" className="mt-2.5 w-full h-9 px-4 text-xs sm:mt-4 sm:h-12 sm:px-7 sm:text-sm">
                  <a
                    href={createWhatsAppLink({
                      category: item.category,
                      message: `Saya tertarik dengan project "${item.title}". Bisa diskusi lebih lanjut?`,
                    })}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconBrandWhatsapp className="size-4 sm:size-5" />
                    Diskusikan Project Ini
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
