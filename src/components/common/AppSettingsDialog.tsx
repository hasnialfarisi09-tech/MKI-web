"use client";

import React, { useState } from "react";
import { Bell, Wifi, MapPin, HardDrive, Settings, ExternalLink, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { openAppSettings } from "@/lib/nativeSettings";
import { Capacitor } from "@capacitor/core";

export function AppSettingsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const isNative = typeof window !== "undefined" && Capacitor.isNativePlatform();

  const handleOpenNativeSettings = async () => {
    const success = await openAppSettings();
    if (success) {
      setIsOpen(false);
    }
  };

  const permissionsList = [
    {
      icon: Bell,
      title: "Notifikasi",
      desc: "Untuk menerima info update versi aplikasi & pemberitahuan penting.",
      type: "Bisa diatur On/Off",
    },
    {
      icon: Wifi,
      title: "Akses Jaringan (Internet)",
      desc: "Untuk sinkronisasi harga bahan & update sistem secara real-time.",
      type: "Diatur via Batasi Data",
    },
    {
      icon: MapPin,
      title: "Lokasi (GPS)",
      desc: "Untuk estimasi jarak workshop & pengiriman material proyek.",
      type: "Opsional / Saat dipakai",
    },
    {
      icon: HardDrive,
      title: "Penyimpanan",
      desc: "Untuk menyimpan file PDF rincian estimasi biaya ke perangkat.",
      type: "Sesuai kebutuhan",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          id="btn-app-permissions"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted text-[11px] font-medium transition-colors shadow-sm"
          title="Atur izin notifikasi, jaringan, dan lokasi"
        >
          <ShieldCheck className="size-3.5 text-primary" />
          <span>Izin Aplikasi</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-6 rounded-3xl">
        <DialogTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Settings className="size-4" />
          </div>
          <span>Izin & Privasi Aplikasi</span>
        </DialogTitle>

        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Anda memiliki kontrol penuh atas seluruh izin yang digunakan aplikasi. Anda dapat mengaktifkan atau menonaktifkan izin kapan saja melalui setelan ponsel Anda.
        </p>

        <div className="mt-4 space-y-2.5">
          {permissionsList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-muted/40 border border-border/60"
              >
                <div className="size-8 rounded-xl bg-background border border-border/80 flex items-center justify-center text-primary shrink-0 mt-0.5 shadow-xs">
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border/70 text-muted-foreground font-medium">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-border flex flex-col gap-2.5">
          {isNative ? (
            <button
              type="button"
              onClick={handleOpenNativeSettings}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md hover:bg-primary/90 transition active:scale-[0.98]"
            >
              <ExternalLink className="size-3.5" />
              <span>Buka Pengaturan HP Sekarang</span>
            </button>
          ) : (
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-2.5 text-[11px] text-muted-foreground">
              <strong className="text-foreground font-semibold block mb-0.5">Panduan di Ponsel Android:</strong>
              Buka menu <em>Pengaturan HP &gt; Aplikasi &gt; Info Aplikasi &gt; Izin</em> untuk mengubah status izin notifikasi, lokasi, atau jaringan.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
