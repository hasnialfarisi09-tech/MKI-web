import type { Metadata } from "next";
import { CostCalculator } from "@/components/calculator/cost-calculator";

export const metadata: Metadata = {
  title: "Simulasi Biaya & Kalkulator Furniture Custom",
  description:
    "Simulasi perkiraan biaya pembuatan furniture custom (Kitchen Set, Lemari, Backdrop TV, Kamar Tidur). Hitung transparan dengan satuan Meter Lari (M1) dan Meter Persegi (M2).",
};

export default function SimulasiBiayaPage() {
  return (
    <div className="bg-background min-h-screen relative overflow-hidden simulation-theme">
      {/* Ambient Architectural Lighting Mesh (Soft Emerald & Teal Accents) */}
      <div
        className="absolute top-0 left-1/4 -translate-x-1/2 -top-40 size-[550px] rounded-full bg-primary/10 blur-[140px] pointer-events-none opacity-60 dark:opacity-35"
        aria-hidden="true"
      />
      <div
        className="absolute top-[480px] right-0 translate-x-1/3 size-[500px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none opacity-50 dark:opacity-30"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-24 left-10 size-[420px] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none opacity-40 dark:opacity-20"
        aria-hidden="true"
      />

      {/* Main Calculator Engine */}
      <section className="relative z-10">
        <CostCalculator />
      </section>
    </div>
  );
}
