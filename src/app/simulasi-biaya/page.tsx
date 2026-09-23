import type { Metadata } from "next";
import { CostCalculator } from "@/components/calculator/cost-calculator";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Simulasi Biaya & Kalkulator Furniture Custom",
  description:
    "Simulasi perkiraan biaya pembuatan furniture custom (Kitchen Set, Lemari, Backdrop TV, Kamar Tidur). Hitung transparan dengan satuan Meter Lari (M1) dan Meter Persegi (M2).",
};

const GUARANTEES = [
  {
    index: "01",
    title: "Desain Terverifikasi",
    body: "Revisi dan konfirmasi tampilan visual, kombinasi warna, serta ergonomi rancangan hingga Anda yakin 100% sebelum produksi.",
  },
  {
    index: "02",
    title: "Ukuran Aktual Lapangan",
    body: "Pengukuran ulang dengan meteran laser digital di lokasi sebelum gambar kerja detail dilepas ke proses pemotongan mesin workshop.",
  },
  {
    index: "03",
    title: "Spesifikasi Tertulis",
    body: "Tipe multipleks/blockboard, merk HPL, kode warna, dan jenis engsel dicantumkan resmi dan transparan dalam Surat Perjanjian Kerja.",
  },
  {
    index: "04",
    title: "Scope Pekerjaan Jelas",
    body: "Batasan pekerjaan sipil, pemindahan instalasi pipa/listrik, dan finishing tertera secara tertulis tanpa biaya terselubung.",
  },
  {
    index: "05",
    title: "RAB Tanpa Biaya Tersembunyi",
    body: "Harga yang disepakati adalah nilai final tanpa tambahan biaya mendadak di tengah jalan saat proses perakitan dan pemasangan.",
  },
  {
    index: "06",
    title: "Estimasi Jadwal Pasti",
    body: "Tahapan produksi, perakitan, pengiriman, dan instalasi memiliki estimasi durasi terencana yang disepakati bersama sejak awal.",
  },
];

export default function SimulasiBiayaPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Main Calculator Engine */}
      <section className="bg-background">
        <CostCalculator />
      </section>

      {/* Workshop Quality Standards & Commitments */}
      <section className="border-t border-border bg-card/40 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="size-3.5" />
              Kepastian & Kenyamanan
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
              Produksi tidak dimulai dari asumsi.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Enam komitmen kejelasan untuk memastikan Anda tenang sebelum kayu pertama dipotong.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUARANTEES.map((item) => (
              <div
                key={item.index}
                className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                    {item.index}
                  </span>
                  <CheckCircle2 className="size-4 text-primary/60" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
