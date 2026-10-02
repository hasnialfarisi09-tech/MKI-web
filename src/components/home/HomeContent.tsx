"use client";

import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { CostCalculator } from "@/components/calculator/cost-calculator";

interface HomeContentProps {
  children: React.ReactNode;
}

/**
 * Komponen pelindung rute beranda:
 * Jika diakses via Android Native (Capacitor), aplikasi selalu menampilkan
 * Kalkulator Simulasi Biaya secara eksklusif dan tidak menampilkan landing page perusahaan.
 */
export function HomeContent({ children }: HomeContentProps) {
  const [isNative, setIsNative] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return Capacitor.isNativePlatform();
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  if (isNative) {
    return (
      <div className="bg-background min-h-screen">
        <section className="bg-background">
          <CostCalculator />
        </section>
      </div>
    );
  }

  return <>{children}</>;
}
