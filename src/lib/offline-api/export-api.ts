/**
 * Local Offline Export API
 * Menghasilkan file JPG/PDF dan menyimpannya langsung ke perangkat Android / Browser tanpa internet.
 */

import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import {
  exportSimulationAsJpg,
  exportSimulationAsPdf,
  createSimulationCanvas,
  SimulationExportData,
} from "@/lib/export-simulation";
import type { ApiResponse, ExportApiInterface, NativeExportResult } from "./types";

class LocalExportApi implements ExportApiInterface {
  async saveAndShare(
    format: "jpg" | "pdf",
    data: SimulationExportData,
    options?: { shareDirectly?: boolean }
  ): Promise<ApiResponse<NativeExportResult>> {
    const isNative = Capacitor.isNativePlatform();

    if (!isNative) {
      // Browser standard fallback
      if (format === "jpg") {
        await exportSimulationAsJpg(data);
      } else {
        await exportSimulationAsPdf(data);
      }
      return {
        success: true,
        data: { shared: false, format },
        message: `File ${format.toUpperCase()} berhasil diunduh`,
        timestamp: Date.now(),
      };
    }

    // Android Native Mode via Capacitor
    try {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const safeClient = data.clientName?.trim().replace(/[^a-zA-Z0-9_-]/g, "_") || "Klien";
      const fileName = `Estimasi_${safeClient}_${dateStr}.${format}`;

      if (format === "jpg") {
        const canvas = createSimulationCanvas(data, 2);
        const base64Data = canvas.toDataURL("image/jpeg", 0.92).replace(/^data:image\/jpeg;base64,/, "");

        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true,
        });

        if (options?.shareDirectly) {
          await Share.share({
            title: `Estimasi Interior - ${data.clientName || "Klien"}`,
            text: `Berikut file rincian estimasi biaya furniture custom.`,
            url: savedFile.uri,
            dialogTitle: "Kirim Estimasi via WhatsApp / Simpan",
          });
        }

        return {
          success: true,
          data: { filePath: savedFile.uri, shared: Boolean(options?.shareDirectly), format: "jpg" },
          message: `Estimasi JPG berhasil disimpan ke Dokumen HP: ${fileName}`,
          timestamp: Date.now(),
        };
      } else {
        // PDF format
        const canvas = createSimulationCanvas(data, 2);
        const imgData = canvas.toDataURL("image/jpeg", 0.92);

        // Dynamically import jspdf
        const { default: jsPDF } = await import("jspdf");
        const pdfWidthMm = 210;
        const pdfHeightMm = (canvas.height * pdfWidthMm) / canvas.width;
        const pdf = new jsPDF({
          orientation: pdfHeightMm > pdfWidthMm ? "portrait" : "landscape",
          unit: "mm",
          format: [pdfWidthMm, pdfHeightMm],
        });

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidthMm, pdfHeightMm, undefined, "FAST");
        const pdfBase64 = pdf.output("datauristring").replace(/^data:application\/pdf;filename=[^;]+;base64,/, "").replace(/^data:application\/pdf;base64,/, "");

        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: pdfBase64,
          directory: Directory.Documents,
          recursive: true,
        });

        if (options?.shareDirectly) {
          await Share.share({
            title: `Estimasi Interior - ${data.clientName || "Klien"}`,
            text: `Berikut file rincian estimasi biaya furniture custom.`,
            url: savedFile.uri,
            dialogTitle: "Kirim Estimasi via WhatsApp / Simpan",
          });
        }

        return {
          success: true,
          data: { filePath: savedFile.uri, shared: Boolean(options?.shareDirectly), format: "pdf" },
          message: `Estimasi PDF berhasil disimpan ke Dokumen HP: ${fileName}`,
          timestamp: Date.now(),
        };
      }
    } catch (err: any) {
      console.error("[LocalExportApi] Native export error:", err);
      // Fallback to standard web export if native filesystem error occurs
      if (format === "jpg") {
        await exportSimulationAsJpg(data);
      } else {
        await exportSimulationAsPdf(data);
      }
      return {
        success: true,
        data: { shared: false, format },
        message: `File ${format.toUpperCase()} berhasil diekspor`,
        timestamp: Date.now(),
      };
    }
  }
}

export const localExportApi = new LocalExportApi();
