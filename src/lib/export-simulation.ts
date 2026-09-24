import { formatRupiah } from "@/data/pricing-calculator";

export type SimulationExportData = {
  cityName: string;
  provinceName: string;
  region: "DK" | "LK";
  accountName?: string;
  clientName?: string;
  clientAddress?: string;
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
  primaryColor?: string;
  secondaryColor?: string;
};

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
}

/**
 * Render quotation onto an off-screen HTML5 Canvas with high DPI
 * Rasio Portrait Mobile (9:16 - Base 1080 x 1920 px)
 * Clean & White-label (Identitas akun pengguna sebagai H1 & Footer)
 */
export function createSimulationCanvas(
  data: SimulationExportData,
  scale: number = 2
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  // Primary & Secondary Brand Colors (Customizable by user)
  const primaryColor = data.primaryColor?.trim() || "#E5571F";
  const secondaryColor = data.secondaryColor?.trim() || "#1C1917";

  // Base dimensions (1080px width for standard mobile/document export)
  const width = 1080;
  const padding = 48;
  const contentWidth = width - padding * 2; // 984px

  const hasAccountName = Boolean(data.accountName && data.accountName.trim());
  const hasClientName = Boolean(data.clientName && data.clientName.trim());
  const hasClientAddress = Boolean(data.clientAddress && data.clientAddress.trim());
  const hasClientInfo = hasClientName || hasClientAddress;

  // Calculate dynamic content heights with enlarged typography
  const headerHeight = 116;
  const metaHeight = hasClientInfo ? 152 : 80;
  const tableHeaderHeight = 56;
  const rowHeight = 88;
  const rowsHeight = Math.max(1, data.breakdown.length) * rowHeight;
  const totalBoxHeight = 180;

  const standardsHeight = 225;
  const workflowHeight = 185;
  const footerAreaHeight = 74;

  const totalContentHeight =
    padding +
    10 +
    headerHeight +
    metaHeight +
    tableHeaderHeight +
    rowsHeight +
    24 +
    totalBoxHeight +
    24 +
    standardsHeight +
    24 +
    workflowHeight +
    32 +
    footerAreaHeight;

  const totalHeight = Math.ceil(totalContentHeight);

  // Scale for retina/high-res rendering (scale = 2 for ultra-crisp display, scale = 1 or 1.2 for fast preview)
  canvas.width = width * scale;
  canvas.height = totalHeight * scale;
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, totalHeight);

  // Decorative top accent bar (Primary color accent)
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, 14);

  let currentY = padding + 8;

  // ==================== HEADER (IDENTITAS H1 / NAMA AKUN) ====================
  const h1Title = hasAccountName
    ? data.accountName!.trim().toUpperCase()
    : "ESTIMASI BIAYA FURNITURE & INTERIOR";

  const h1Subtitle = hasAccountName
    ? "ESTIMASI BIAYA FURNITURE & INTERIOR CUSTOM"
    : "SIMULASI PERKIRAAN BIAYA TRANSPARAN & TERSTANDARISASI";

  ctx.fillStyle = secondaryColor;
  ctx.font =
    h1Title.length > 28
      ? "bold 30px 'Segoe UI', Roboto, sans-serif"
      : "bold 36px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(h1Title, padding, currentY + 34);

  // Subtitle
  ctx.fillStyle = primaryColor;
  ctx.font = "600 17px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(h1Subtitle, padding, currentY + 64);

  // Right-aligned specification details
  ctx.fillStyle = "#57534E";
  ctx.font = "500 15.5px 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("Dokumen Simulasi Digital", width - padding, currentY + 18);
  ctx.fillText("Standar Mutu Workshop Presisi", width - padding, currentY + 42);
  ctx.fillText("Material Grade A & Soft-Close", width - padding, currentY + 66);
  ctx.textAlign = "left";

  currentY += 90;

  // Divider line
  ctx.strokeStyle = "#E7E5E4";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding, currentY);
  ctx.lineTo(width - padding, currentY);
  ctx.stroke();

  currentY += 26;

  // ==================== DOCUMENT TITLE & METADATA ====================
  ctx.fillStyle = secondaryColor;
  ctx.font = "bold 24px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("RINCIAN ESTIMASI BIAYA PER RUANGAN", padding, currentY + 10);

  // Today's date
  const today = new Date();
  const dateFormatted = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  const locationText = `Wilayah: ${data.cityName}, ${data.provinceName}`;

  if (hasClientInfo) {
    // Client & Project Information Box
    const boxY = currentY + 28;
    const boxHeight = 98;
    ctx.fillStyle = "#FAF8F5";
    ctx.beginPath();
    ctx.roundRect(padding, boxY, contentWidth, boxHeight, 12);
    ctx.fill();
    ctx.strokeStyle = "#E7E5E4";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Left Column: Client Name & Address
    ctx.fillStyle = "#78716C";
    ctx.font = "bold 14px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("NAMA KLIEN:", padding + 20, boxY + 32);
    ctx.fillText("ALAMAT KLIEN:", padding + 20, boxY + 66);

    ctx.fillStyle = secondaryColor;
    ctx.font = "bold 18px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(data.clientName?.trim() || "-", padding + 140, boxY + 32);

    ctx.fillStyle = "#44403C";
    ctx.font = "500 16px 'Segoe UI', Roboto, sans-serif";
    const rawAddress = data.clientAddress?.trim() || "-";
    const displayAddress =
      rawAddress.length > 46 ? `${rawAddress.slice(0, 43)}...` : rawAddress;
    ctx.fillText(displayAddress, padding + 140, boxY + 66);

    // Right Column: Location & Date
    const rightColX = padding + 540;
    ctx.fillStyle = "#78716C";
    ctx.font = "bold 14px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("WILAYAH:", rightColX, boxY + 32);
    ctx.fillText("TANGGAL:", rightColX, boxY + 66);

    ctx.fillStyle = primaryColor;
    ctx.font = "bold 17px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(locationText.replace("Wilayah: ", ""), rightColX + 90, boxY + 32);

    ctx.fillStyle = "#57534E";
    ctx.font = "500 16px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(dateFormatted, rightColX + 90, boxY + 66);

    currentY += 152;
  } else {
    // Compact metadata when no client info
    ctx.fillStyle = "#78716C";
    ctx.font = "500 16.5px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(`Dibuat pada: ${dateFormatted}`, padding, currentY + 38);

    // Location Badge Box (Right-aligned)
    ctx.font = "bold 16.5px 'Segoe UI', Roboto, sans-serif";
    const badgeTextWidth = ctx.measureText(locationText).width;
    const badgeWidth = badgeTextWidth + 32;
    ctx.fillStyle = hexToRgba(primaryColor, 0.08);
    ctx.beginPath();
    ctx.roundRect(width - padding - badgeWidth, currentY + 14, badgeWidth, 42, 10);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(primaryColor, 0.28);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = primaryColor;
    ctx.textAlign = "right";
    ctx.fillText(locationText, width - padding - 16, currentY + 41);
    ctx.textAlign = "left";

    currentY += 80;
  }

  // ==================== TABLE HEADER ====================
  ctx.fillStyle = "#FAF8F5";
  ctx.beginPath();
  ctx.roundRect(padding, currentY, contentWidth, tableHeaderHeight, 12);
  ctx.fill();
  ctx.strokeStyle = "#E7E5E4";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = secondaryColor;
  ctx.font = "bold 16px 'Segoe UI', Roboto, sans-serif";

  // Dedicated non-overlapping column grid across 984px:
  // No (60), Item (100), Spec (400), Vol (650), Price (755), Total (1014 Right)
  const colNo = 60;
  const colItem = 100;
  const colSpec = 400;
  const colVol = 650;
  const colPrice = 755;
  const colTotal = width - padding - 18; // 1014 (Subtotal right-aligned)

  const maxItemWidth = colSpec - colItem - 16; // 284px
  const maxSpecWidth = colVol - colSpec - 16;  // 234px

  ctx.fillText("No", colNo, currentY + 35);
  ctx.fillText("Komponen Furniture", colItem, currentY + 35);
  ctx.fillText("Spesifikasi & Model Bahan", colSpec, currentY + 35);
  ctx.fillText("Ukuran / Vol", colVol, currentY + 35);
  ctx.fillText("Tarif Satuan", colPrice, currentY + 35);
  ctx.textAlign = "right";
  ctx.fillText("Subtotal", colTotal, currentY + 35);
  ctx.textAlign = "left";

  currentY += tableHeaderHeight;

  // ==================== TABLE ROWS ====================
  if (data.breakdown.length === 0) {
    ctx.fillStyle = "#A8A29E";
    ctx.font = "italic 16px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("Belum ada komponen yang dipilih.", padding + 24, currentY + 48);
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
      ctx.font = "bold 16px 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(String(index + 1), colNo, currentY + 49);

      // Smart Item Name & Layout Splitting
      ctx.font = "bold 18px 'Segoe UI', Roboto, sans-serif";
      let itemLine1 = row.itemName;
      let itemLine2: string | null = null;
      let isLayoutBadge = false;

      const layoutMatch = row.itemName.match(/^(.*?)\s*(\((?:Shape L|Shape U|Lurus)\))$/i);
      if (layoutMatch) {
        itemLine1 = layoutMatch[1].trim();
        itemLine2 = layoutMatch[2].trim();
        isLayoutBadge = true;
      } else if (ctx.measureText(row.itemName).width > maxItemWidth) {
        const words = row.itemName.split(" ");
        itemLine1 = "";
        let line2Words: string[] = [];
        for (let i = 0; i < words.length; i++) {
          const testStr = itemLine1 ? `${itemLine1} ${words[i]}` : words[i];
          if (ctx.measureText(testStr).width <= maxItemWidth) {
            itemLine1 = testStr;
          } else {
            line2Words = words.slice(i);
            break;
          }
        }
        itemLine2 = line2Words.join(" ") || null;
      }

      // Safe truncate if still exceeds maxItemWidth
      if (ctx.measureText(itemLine1).width > maxItemWidth) {
        while (ctx.measureText(itemLine1 + "...").width > maxItemWidth && itemLine1.length > 5) {
          itemLine1 = itemLine1.slice(0, -1);
        }
        itemLine1 += "...";
      }
      if (itemLine2 && ctx.measureText(itemLine2).width > maxItemWidth) {
        while (ctx.measureText(itemLine2 + "...").width > maxItemWidth && itemLine2.length > 5) {
          itemLine2 = itemLine2.slice(0, -1);
        }
        itemLine2 += "...";
      }

      // Render Item Name
      if (itemLine2) {
        ctx.fillStyle = secondaryColor;
        ctx.font = "bold 17.5px 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(itemLine1, colItem, currentY + 36);

        if (isLayoutBadge) {
          ctx.fillStyle = primaryColor;
          ctx.font = "bold 15px 'Segoe UI', Roboto, sans-serif";
          ctx.fillText(`Layout: ${itemLine2.replace(/[()]/g, "")}`, colItem, currentY + 62);
        } else {
          ctx.fillStyle = "#57534E";
          ctx.font = "500 15px 'Segoe UI', Roboto, sans-serif";
          ctx.fillText(itemLine2, colItem, currentY + 62);
        }
      } else {
        ctx.fillStyle = secondaryColor;
        ctx.font = "bold 18px 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(itemLine1, colItem, currentY + 49);
      }

      // Smart Spec & Model Splitting
      ctx.font = "500 16px 'Segoe UI', Roboto, sans-serif";
      const combinedSpec = `${row.optionName} — ${row.modelName}`;
      let specLine1 = combinedSpec;
      let specLine2: string | null = null;

      if (ctx.measureText(combinedSpec).width > maxSpecWidth) {
        specLine1 = row.optionName;
        specLine2 = row.modelName;

        if (ctx.measureText(specLine1).width > maxSpecWidth) {
          while (ctx.measureText(specLine1 + "...").width > maxSpecWidth && specLine1.length > 5) {
            specLine1 = specLine1.slice(0, -1);
          }
          specLine1 += "...";
        }
        if (ctx.measureText(specLine2).width > maxSpecWidth) {
          while (ctx.measureText(specLine2 + "...").width > maxSpecWidth && specLine2.length > 5) {
            specLine2 = specLine2.slice(0, -1);
          }
          specLine2 += "...";
        }
      }

      // Render Spec & Model
      if (specLine2) {
        ctx.fillStyle = "#44403C";
        ctx.font = "600 16px 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(specLine1, colSpec, currentY + 36);

        ctx.fillStyle = "#78716C";
        ctx.font = "500 14.5px 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(specLine2, colSpec, currentY + 62);
      } else {
        ctx.fillStyle = "#57534E";
        ctx.font = "500 16px 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(specLine1, colSpec, currentY + 49);
      }

      // Measurement
      ctx.fillStyle = secondaryColor;
      ctx.font = "bold 17px 'Segoe UI', Roboto, sans-serif";
      const dimStr =
        row.unit === "M1"
          ? `${row.measurement} m1`
          : row.unit === "M2"
            ? `${row.measurement} m²`
            : `${row.measurement} QTY`;
      ctx.fillText(dimStr, colVol, currentY + 49);

      // Unit Price
      ctx.fillStyle = "#57534E";
      ctx.font = "500 16px 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(formatRupiah(row.unitPrice), colPrice, currentY + 49);

      // Subtotal
      ctx.fillStyle = secondaryColor;
      ctx.font = "bold 19px 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(formatRupiah(row.subtotal), colTotal, currentY + 49);
      ctx.textAlign = "left";

      currentY += rowHeight;
    });
  }

  currentY += 24;

  // ==================== TOTAL SUMMARY BOX ====================
  ctx.fillStyle = "#FAF8F5";
  ctx.beginPath();
  ctx.roundRect(padding, currentY, contentWidth, totalBoxHeight, 16);
  ctx.fill();
  ctx.strokeStyle = "#E7E5E4";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Metrics (Left side of total box)
  ctx.fillStyle = "#57534E";
  ctx.font = "500 17px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Total Komponen Aktif:", padding + 24, currentY + 50);
  ctx.fillText("Total Volume Meter Lari (M1):", padding + 24, currentY + 90);
  ctx.fillText("Total Luas Meter Persegi (M2):", padding + 24, currentY + 130);

  ctx.fillStyle = secondaryColor;
  ctx.font = "bold 18.5px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(`${data.activeCount} Item`, padding + 270, currentY + 50);
  ctx.fillText(`${data.totalM1} m1`, padding + 270, currentY + 90);
  ctx.fillText(`${data.totalM2} m²`, padding + 270, currentY + 130);

  // Grand Total (Right side of total box, right-aligned)
  const rightBoxX = width - padding - 24;
  ctx.textAlign = "right";
  ctx.fillStyle = "#78716C";
  ctx.font = "bold 15px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("TOTAL ESTIMASI BIAYA SEMENTARA", rightBoxX, currentY + 46);

  ctx.fillStyle = primaryColor;
  ctx.font = "bold 44px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(formatRupiah(data.grandTotal), rightBoxX, currentY + 96);

  ctx.fillStyle = "#A8A29E";
  ctx.font = "italic 13.5px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(
    "*Harga final disesuaikan setelah pengukuran aktual & konfirmasi detail desain",
    rightBoxX,
    currentY + 134
  );
  ctx.textAlign = "left";

  currentY += totalBoxHeight + 24;

  // ==================== WORKSHOP STANDARDS ====================
  ctx.fillStyle = "#FAF9F6";
  ctx.beginPath();
  ctx.roundRect(padding, currentY, contentWidth, standardsHeight, 14);
  ctx.fill();
  ctx.strokeStyle = "#E7E5E4";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = secondaryColor;
  ctx.font = "bold 18px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Standar Mutu & Spesifikasi Produksi Workshop:", padding + 24, currentY + 38);

  ctx.fillStyle = "#57534E";
  ctx.font = "500 16.5px 'Segoe UI', Roboto, sans-serif";
  const notes = [
    "✓ Aksesoris engsel soft-close & rel laci presisi standar workshop terstandarisasi.",
    "✓ Bahan multiplek/blockboard berkualitas grade A dengan finishing HPL tahan lembap.",
    "✓ Sudah termasuk visualisasi desain 3D & pemasangan langsung oleh tim teknis workshop.",
    "✓ Standar mutu pengerjaan rapi, presisi, dan kokoh untuk kebutuhan interior jangka panjang.",
  ];

  notes.forEach((note, idx) => {
    ctx.fillText(note, padding + 24, currentY + 74 + idx * 35);
  });

  currentY += standardsHeight + 24;

  // ==================== WORKFLOW / TAHAPAN PENGERJAAN ====================
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.roundRect(padding, currentY, contentWidth, workflowHeight, 14);
  ctx.fill();
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = secondaryColor;
  ctx.font = "bold 18px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Alur & Tahapan Realisasi Furniture Custom:", padding + 24, currentY + 38);

  const steps = [
    { num: "01", title: "Simulasi & Konsultasi", desc: "Estimasi biaya transparan awal" },
    { num: "02", title: "Survey Lokasi Aktual", desc: "Pengukuran presisi & cek bidang" },
    { num: "03", title: "Gambar Kerja 3D", desc: "Approval visual & pemilihan material" },
    { num: "04", title: "Fabrikasi & Instalasi", desc: "Pengerjaan workshop & pemasangan" },
  ];

  const stepColWidth = (contentWidth - 48) / 4;
  steps.forEach((step, idx) => {
    const stepX = padding + 24 + idx * stepColWidth;

    // Step badge
    ctx.fillStyle = hexToRgba(primaryColor, 0.08);
    ctx.beginPath();
    ctx.roundRect(stepX, currentY + 52, 38, 26, 6);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(primaryColor, 0.28);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = primaryColor;
    ctx.font = "bold 13.5px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(step.num, stepX + 11, currentY + 70);

    // Step text
    ctx.fillStyle = secondaryColor;
    ctx.font = "bold 15.5px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(step.title, stepX, currentY + 104);

    ctx.fillStyle = "#64748B";
    ctx.font = "500 13.5px 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(step.desc, stepX, currentY + 128);
  });

  currentY += workflowHeight + 32;

  // ==================== FOOTER (NAMA AKUN & BRANDING USER) ====================
  ctx.strokeStyle = "#E7E5E4";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, currentY);
  ctx.lineTo(width - padding, currentY);
  ctx.stroke();

  ctx.fillStyle = "#A8A29E";
  ctx.font = "500 15px 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(
    "Dokumen estimasi digital & transparan • Berdasarkan spesifikasi pilihan",
    padding,
    currentY + 30
  );

  const footerBrand = hasAccountName
    ? data.accountName!.trim()
    : "Estimasi Biaya Furniture & Interior Custom © 2026";

  ctx.fillStyle = secondaryColor;
  ctx.font = "bold 16.5px 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(footerBrand, width - padding, currentY + 30);
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
        const safeClient = data.clientName?.trim()
          ? `-${data.clientName.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}`
          : data.accountName?.trim()
          ? `-${data.accountName.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}`
          : "";
        const safeCity = data.cityName.replace(/\s+/g, "-");
        a.href = url;
        a.download = `Estimasi-Biaya${safeClient}-${safeCity}.jpg`;
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

  const safeClient = data.clientName?.trim()
    ? `-${data.clientName.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}`
    : data.accountName?.trim()
    ? `-${data.accountName.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}`
    : "";
  const safeCity = data.cityName.replace(/\s+/g, "-");
  pdf.save(`Estimasi-Biaya${safeClient}-${safeCity}.pdf`);
}

/**
 * Generate a preview Data URL (JPEG format) for fast real-time previewing in UI
 */
export function generateSimulationPreview(
  data: SimulationExportData,
  scale: number = 1.2
): string {
  const canvas = createSimulationCanvas(data, scale);
  return canvas.toDataURL("image/jpeg", 0.9);
}
