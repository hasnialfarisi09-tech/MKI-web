import { formatRupiah } from "@/data/pricing-calculator";

export type SimulationExportData = {
  cityName: string;
  provinceName: string;
  region: "DK" | "LK";
  grandTotal: number;
  totalM1: number;
  totalM2: number;
  activeCount: number;
  breakdown: Array<{
    itemName: string;
    optionName: string;
    modelName: string;
    unitPrice: number;
    unit: string;
    measurement: number;
    subtotal: number;
  }>;
};

/**
 * Render quotation onto an off-screen HTML5 Canvas with high DPI
 * Clean & White-label (tanpa brand identitas khusus)
 */
function createSimulationCanvas(data: SimulationExportData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  // Base dimensions (1200px width for crisp readability)
  const width = 1200;
  const padding = 60;
  const contentWidth = width - padding * 2;

  // Calculate dynamic height based on rows
  const headerHeight = 250;
  const metaHeight = 110;
  const tableHeaderHeight = 50;
  const rowHeight = 72;
  const rowsHeight = Math.max(1, data.breakdown.length) * rowHeight;
  const totalBoxHeight = 160;
  const notesHeight = 220;
  const footerHeight = 80;

  const totalHeight =
    headerHeight +
    metaHeight +
    tableHeaderHeight +
    rowsHeight +
    totalBoxHeight +
    notesHeight +
    footerHeight;

  // Scale for retina/high-res rendering (scale = 2 for crisp 2400px width)
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = totalHeight * scale;
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, totalHeight);

  // Decorative top accent bar (Neutral warm amber/ember accent)
  ctx.fillStyle = "#E5571F";
  ctx.fillRect(0, 0, width, 12);

  let currentY = padding + 10;

  // ==================== HEADER (WHITE LABEL) ====================
  // Document Title
  ctx.fillStyle = "#1C1917";
  ctx.font = "bold 30px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("ESTIMASI BIAYA FURNITURE & INTERIOR", padding, currentY + 28);

  // Subtitle
  ctx.fillStyle = "#E5571F";
  ctx.font = "600 14px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("SIMULASI PERKIRAAN BIAYA TRANSPARAN & TERSTANDARISASI", padding, currentY + 52);

  // Right-aligned specification details (Neutral, no company brand)
  ctx.fillStyle = "#57534E";
  ctx.font = "13px 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("Dokumen Simulasi Digital", width - padding, currentY + 18);
  ctx.fillText("Standar Mutu Workshop Presisi", width - padding, currentY + 38);
  ctx.fillText("Material Grade A & Fitting Soft-Close", width - padding, currentY + 58);
  ctx.textAlign = "left";

  currentY += 85;

  // Divider line
  ctx.strokeStyle = "#E7E5E4";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding, currentY);
  ctx.lineTo(width - padding, currentY);
  ctx.stroke();

  currentY += 30;

  // ==================== DOCUMENT TITLE & METADATA ====================
  ctx.fillStyle = "#1C1917";
  ctx.font = "bold 20px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("RINCIAN ESTIMASI BIAYA PER RUANGAN", padding, currentY + 10);

  // Today's date
  const today = new Date();
  const dateFormatted = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  ctx.fillStyle = "#78716C";
  ctx.font = "13px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(`Dibuat pada: ${dateFormatted}`, padding, currentY + 32);

  // Location Badge Box (Right-aligned)
  const regionLabel = data.region === "DK" ? "Dalam Kota (DK)" : "Luar Kota (LK)";
  const locationText = `Wilayah: ${data.cityName}, ${data.provinceName} (${regionLabel})`;

  ctx.fillStyle = "#F5F3EF";
  const badgeWidth = ctx.measureText(locationText).width + 30;
  ctx.beginPath();
  ctx.roundRect(width - padding - badgeWidth, currentY - 5, badgeWidth, 38, 8);
  ctx.fill();

  ctx.fillStyle = "#E5571F";
  ctx.font = "bold 13px 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(locationText, width - padding - 15, currentY + 19);
  ctx.textAlign = "left";

  currentY += 75;

  // ==================== TABLE HEADER ====================
  ctx.fillStyle = "#FAF8F5";
  ctx.beginPath();
  ctx.roundRect(padding, currentY, contentWidth, tableHeaderHeight, 10);
  ctx.fill();
  ctx.strokeStyle = "#E7E5E4";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#1C1917";
  ctx.font = "bold 13px 'Segoe UI', Roboto, sans-serif";

  // Columns: No (50px), Item (380px), Spesifikasi (300px), Ukuran/Vol (140px), Tarif (130px), Subtotal (Right)
  const colNo = padding + 20;
  const colItem = padding + 60;
  const colSpec = padding + 400;
  const colVol = padding + 680;
  const colPrice = padding + 820;
  const colTotal = width - padding - 20;

  ctx.fillText("No", colNo, currentY + 30);
  ctx.fillText("Komponen Furniture", colItem, currentY + 30);
  ctx.fillText("Spesifikasi & Model Bahan", colSpec, currentY + 30);
  ctx.fillText("Ukuran / Volume", colVol, currentY + 30);
  ctx.fillText("Tarif Satuan", colPrice, currentY + 30);
  ctx.textAlign = "right";
  ctx.fillText("Subtotal", colTotal, currentY + 30);
  ctx.textAlign = "left";

  currentY += tableHeaderHeight;

  // ==================== TABLE ROWS ====================
  if (data.breakdown.length === 0) {
    ctx.fillStyle = "#A8A29E";
    ctx.font = "italic 13px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("Belum ada komponen yang dipilih.", padding + 20, currentY + 40);
    currentY += rowHeight;
  } else {
    data.breakdown.forEach((row, index) => {
      // Row background zebra
      if (index % 2 === 1) {
        ctx.fillStyle = "#FAFAF9";
        ctx.fillRect(padding, currentY, contentWidth, rowHeight);
      }

      // Border bottom
      ctx.strokeStyle = "#F0EFEB";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, currentY + rowHeight);
      ctx.lineTo(width - padding, currentY + rowHeight);
      ctx.stroke();

      // Number
      ctx.fillStyle = "#78716C";
      ctx.font = "bold 13px 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(String(index + 1), colNo, currentY + 42);

      // Item Name
      ctx.fillStyle = "#1C1917";
      ctx.font = "600 14px 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(row.itemName, colItem, currentY + 34);

      // Option & Model
      ctx.fillStyle = "#57534E";
      ctx.font = "12px 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(`${row.optionName} — ${row.modelName}`, colSpec, currentY + 34);

      // Measurement
      ctx.fillStyle = "#1C1917";
      ctx.font = "500 13px 'Segoe UI', Roboto, sans-serif";
      const dimStr =
        row.unit === "M1"
          ? `${row.measurement} m1`
          : row.unit === "M2"
            ? `${row.measurement} m²`
            : `${row.measurement} unit`;
      ctx.fillText(dimStr, colVol, currentY + 34);

      // Unit Price
      ctx.fillStyle = "#57534E";
      ctx.font = "12px 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(formatRupiah(row.unitPrice), colPrice, currentY + 34);

      // Subtotal
      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 14px 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(formatRupiah(row.subtotal), colTotal, currentY + 34);
      ctx.textAlign = "left";

      currentY += rowHeight;
    });
  }

  currentY += 20;

  // ==================== TOTAL SUMMARY BOX ====================
  ctx.fillStyle = "#FAF8F5";
  ctx.beginPath();
  ctx.roundRect(padding, currentY, contentWidth, totalBoxHeight, 14);
  ctx.fill();
  ctx.strokeStyle = "#E7E5E4";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Metrics (Left side of total box)
  ctx.fillStyle = "#57534E";
  ctx.font = "13px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Total Komponen Aktif:", padding + 28, currentY + 45);
  ctx.fillText("Total Volume Meter Lari (M1):", padding + 28, currentY + 75);
  ctx.fillText("Total Luas Meter Persegi (M2):", padding + 28, currentY + 105);

  ctx.fillStyle = "#1C1917";
  ctx.font = "bold 13px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(`${data.activeCount} Item`, padding + 240, currentY + 45);
  ctx.fillText(`${data.totalM1} m1`, padding + 240, currentY + 75);
  ctx.fillText(`${data.totalM2} m²`, padding + 240, currentY + 105);

  // Grand Total (Right side of total box)
  ctx.textAlign = "right";
  ctx.fillStyle = "#78716C";
  ctx.font = "bold 12px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("TOTAL ESTIMASI BIAYA SEMENTARA", width - padding - 28, currentY + 45);

  ctx.fillStyle = "#E5571F";
  ctx.font = "bold 32px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(formatRupiah(data.grandTotal), width - padding - 28, currentY + 85);

  ctx.fillStyle = "#A8A29E";
  ctx.font = "italic 11px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(
    "*Harga final disesuaikan setelah survey pengukuran aktual & konfirmasi detail desain",
    width - padding - 28,
    currentY + 115
  );
  ctx.textAlign = "left";

  currentY += totalBoxHeight + 25;

  // ==================== WORKSHOP STANDARDS & GUARANTEES ====================
  ctx.fillStyle = "#FAF9F6";
  ctx.beginPath();
  ctx.roundRect(padding, currentY, contentWidth, notesHeight, 12);
  ctx.fill();
  ctx.strokeStyle = "#E7E5E4";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#1C1917";
  ctx.font = "bold 14px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Standar Mutu & Jaminan Workshop Resmi:", padding + 24, currentY + 34);

  ctx.fillStyle = "#57534E";
  ctx.font = "13px 'Segoe UI', Roboto, sans-serif";
  const notes = [
    "✓ Garansi struktur 1 tahun, engsel slow-motion & rel laci presisi standar workshop resmi.",
    "✓ Gratis konsultasi layout & survey pengukuran aktual ke lokasi tanpa komitmen awal.",
    "✓ Sudah termasuk visualisasi desain 3D & pemasangan langsung oleh tim teknis workshop berpengalaman.",
    "✓ Bahan multiplek/blockboard berkualitas grade A dengan finishing HPL/Duco tahan lembap.",
  ];

  notes.forEach((note, idx) => {
    ctx.fillText(note, padding + 24, currentY + 65 + idx * 24);
  });

  currentY += notesHeight + 20;

  // ==================== FOOTER (WHITE LABEL) ====================
  ctx.strokeStyle = "#E7E5E4";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, currentY);
  ctx.lineTo(width - padding, currentY);
  ctx.stroke();

  currentY += 24;

  ctx.fillStyle = "#A8A29E";
  ctx.font = "12px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(
    "Dokumen estimasi ini dibuat secara digital dan transparan berdasarkan spesifikasi pilihan komponen.",
    padding,
    currentY
  );

  ctx.textAlign = "right";
  ctx.fillText("Estimasi Biaya Furniture & Interior Custom © 2026", width - padding, currentY);
  ctx.textAlign = "left";

  return canvas;
}

/**
 * Export simulation as a high-resolution JPG image file
 */
export async function exportSimulationAsJpg(
  data: SimulationExportData
): Promise<void> {
  const canvas = createSimulationCanvas(data);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Gagal membuat gambar JPG"));
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const safeCity = data.cityName.replace(/\s+/g, "-");
        a.href = url;
        a.download = `Estimasi-Biaya-Interior-${safeCity}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      },
      "image/jpeg",
      0.95
    );
  });
}

/**
 * Export simulation as an official PDF document file
 */
export async function exportSimulationAsPdf(
  data: SimulationExportData
): Promise<void> {
  const canvas = createSimulationCanvas(data);
  const { jsPDF } = await import("jspdf");

  // Create PDF matching canvas aspect ratio and pixel dimensions
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width / 2, canvas.height / 2],
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  pdf.addImage(imgData, "JPEG", 0, 0, canvas.width / 2, canvas.height / 2);

  const safeCity = data.cityName.replace(/\s+/g, "-");
  pdf.save(`Estimasi-Biaya-Interior-${safeCity}.pdf`);
}
