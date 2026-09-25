"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Calculator, ArrowLeft } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const native = Capacitor.isNativePlatform();
    setIsNative(native);
    if (native && pathname === "/") {
      router.replace("/simulasi-biaya");
    }
  }, [pathname, router]);

  const isSimulation = pathname?.startsWith("/simulasi-biaya") || isNative;

  if (isSimulation) {
    // White-label page: completely free of brand identity
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Neutral Header (No Brand Identity) */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Calculator className="size-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-foreground leading-tight">
                  Kalkulator Interior Custom
                </h1>
                <p className="text-[11px] text-muted-foreground leading-none">
                  Simulasi Biaya Transparan & Terstandarisasi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              {!isNative && (
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="size-3.5" />
                  <span className="hidden sm:inline">Kembali ke</span> Beranda
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Neutral Footer (No Brand Identity) */}
        <footer className="border-t border-border bg-card py-8 text-center text-xs text-muted-foreground">
          <div className="mx-auto max-w-7xl px-4 space-y-2">
            <p className="font-medium text-foreground">
              Kalkulator Estimasi Biaya Interior & Furniture Custom
            </p>
            <p>
              Perhitungan transparan berdasarkan standar dimensi, jenis bahan, dan tarif pengerjaan workshop resmi.
            </p>
            <p className="text-[11px] text-muted-foreground/80 pt-2">
              © {new Date().getFullYear()} Estimasi Biaya Interior Custom. Hak cipta dilindungi.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Standard brand shell for regular pages
  return (
    <>
      <ScrollProgress />
      <SmoothScroll />
      <Navbar />
      {children}
      <Footer />
      <ScrollToTop />
      <FloatingCta />
    </>
  );
}
