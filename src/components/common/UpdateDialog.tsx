"use client";

import React from "react";
import { Download, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, RefreshCw, X } from "lucide-react";
import { AppUpdateState } from "@/lib/useAppUpdate";

interface UpdateDialogProps {
  updateState: AppUpdateState;
}

export function UpdateDialog({ updateState }: UpdateDialogProps) {
  const {
    currentVersion,
    updateInfo,
    isForceUpdate,
    isModalOpen,
    manualCheckStatus,
    isChecking,
    dismissUpdate,
    closeModal,
    dismissToast,
  } = updateState;

  // Handler download APK
  const handleDownload = () => {
    if (!updateInfo?.downloadUrl) return;
    window.open(updateInfo.downloadUrl, "_blank");
  };

  // Toast untuk status pengecekan manual (jika sudah versi terbaru - otomatis hilang dalam 5 detik)
  if (manualCheckStatus === "latest" && !isModalOpen) {
    return (
      <div
        role="status"
        aria-live="polite"
        onClick={dismissToast}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-300 cursor-pointer hover:bg-emerald-700 transition-colors"
        title="Klik untuk menutup"
      >
        <CheckCircle2 className="size-4 shrink-0 text-emerald-200" />
        <span className="text-xs font-medium">Aplikasi sudah dalam versi terbaru (v{currentVersion}).</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismissToast();
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Tutup pemberitahuan"
        >
          <X className="size-3.5 text-white/80" />
        </button>
      </div>
    );
  }

  if (manualCheckStatus === "error" && !isModalOpen) {
    return (
      <div
        role="alert"
        onClick={dismissToast}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-rose-600 text-white shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-300 cursor-pointer hover:bg-rose-700 transition-colors"
        title="Klik untuk menutup"
      >
        <AlertTriangle className="size-4 shrink-0 text-rose-200" />
        <span className="text-xs font-medium">Tidak dapat memeriksa pembaruan. Cek koneksi Anda.</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismissToast();
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Tutup pemberitahuan"
        >
          <X className="size-3.5 text-white/80" />
        </button>
      </div>
    );
  }

  if (!isModalOpen || !updateInfo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => {
        if (!isForceUpdate) closeModal();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl text-foreground animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup (Hanya jika BUKAN Force Update) */}
        {!isForceUpdate && (
          <button
            type="button"
            onClick={dismissUpdate}
            aria-label="Tutup"
            className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        )}

        {/* Header Icon & Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/15 text-primary">
                {isForceUpdate ? "Pembaruan Wajib" : "Pembaruan Tersedia"}
              </span>
              {updateInfo.releaseDate && (
                <span className="text-[11px] text-muted-foreground">{updateInfo.releaseDate}</span>
              )}
            </div>
            <h2 className="text-base font-bold text-foreground mt-0.5">Versi Baru Siap Diunduh</h2>
          </div>
        </div>

        {/* Versi comparison badge */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/60 border border-border mb-4 text-xs">
          <div className="text-center flex-1">
            <span className="block text-[10px] uppercase text-muted-foreground font-semibold">Versi Anda</span>
            <span className="font-bold text-foreground">v{currentVersion}</span>
          </div>
          <ArrowRight className="size-4 text-muted-foreground/60 shrink-0 mx-2" />
          <div className="text-center flex-1">
            <span className="block text-[10px] uppercase text-primary font-semibold">Versi Terbaru</span>
            <span className="font-bold text-primary">v{updateInfo.latestVersion}</span>
          </div>
        </div>

        {/* Changelog / Catatan Pembaruan */}
        {updateInfo.changelog && (
          <div className="mb-5 space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              Apa yang baru di versi ini:
            </span>
            <div className="max-h-36 overflow-y-auto p-3 rounded-xl bg-background border border-border text-xs leading-relaxed text-foreground whitespace-pre-line">
              {updateInfo.changelog}
            </div>
          </div>
        )}

        {/* Notice jika Force Update */}
        {isForceUpdate && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs mb-5">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span>Pembaruan ini diperlukan agar seluruh fitur estimasi dan data harga tetap akurat.</span>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm shadow-md hover:opacity-95 active:scale-[0.98] transition"
          >
            <Download className="size-4" />
            Download APK (v{updateInfo.latestVersion})
          </button>

          {!isForceUpdate && (
            <button
              type="button"
              onClick={dismissUpdate}
              className="px-4 py-3 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted font-medium text-xs transition"
            >
              Nanti Saja
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Tombol kecil "Cek Update" untuk dipasang di footer atau header
 */
export function CheckUpdateButton({ updateState }: { updateState: AppUpdateState }) {
  const { isChecking, checkForUpdate, hasUpdate, openModal } = updateState;

  if (hasUpdate) {
    return (
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 text-[11px] font-semibold transition"
      >
        <Sparkles className="size-3" />
        <span>Update Tersedia</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => checkForUpdate(true)}
      disabled={isChecking}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/60 transition disabled:opacity-60"
      title="Periksa apakah ada pembaruan aplikasi"
    >
      <RefreshCw className={`size-3 ${isChecking ? "animate-spin" : ""}`} />
      <span>{isChecking ? "Mengecek..." : `v${updateState.currentVersion} (Cek Update)`}</span>
    </button>
  );
}
