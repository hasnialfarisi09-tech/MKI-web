import type { Metadata } from "next";
import { CostCalculator } from "@/components/calculator/cost-calculator";

export const metadata: Metadata = {
  title: "Simulasi Biaya & Kalkulator Furniture Custom",
  description:
    "Simulasi perkiraan biaya pembuatan furniture custom (Kitchen Set, Lemari, Backdrop TV, Kamar Tidur). Hitung transparan dengan satuan Meter Lari (M1) dan Meter Persegi (M2).",
};

export default function SimulasiBiayaPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Main Calculator Engine */}
      <section className="bg-background">
        <CostCalculator />
      </section>
    </div>
  );
}
