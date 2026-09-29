/**
 * Script: Generate Android app icons dari satu source image
 * Jalankan: node scripts/generate-icons.mjs <path-to-icon>
 * Contoh: node scripts/generate-icons.mjs docs/icon-source.png
 */

import sharp from "sharp";
import { mkdirSync, copyFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RES_DIR = join(ROOT, "android/app/src/main/res");

const SOURCE = process.argv[2];
if (!SOURCE) {
  console.error("Usage: node scripts/generate-icons.mjs <path-to-source-icon>");
  process.exit(1);
}

if (!existsSync(SOURCE)) {
  console.error(`File tidak ditemukan: ${SOURCE}`);
  process.exit(1);
}

// Android mipmap icon sizes
const SIZES = [
  { dir: "mipmap-mdpi",    size: 48  },
  { dir: "mipmap-hdpi",    size: 72  },
  { dir: "mipmap-xhdpi",   size: 96  },
  { dir: "mipmap-xxhdpi",  size: 144 },
  { dir: "mipmap-xxxhdpi", size: 192 },
];

// Next.js web icon (src/app/icon.png) — 512x512
const WEB_ICON = join(ROOT, "src/app/icon.png");

async function generateIcons() {
  console.log(`📱 Generating Android icons dari: ${SOURCE}`);

  for (const { dir, size } of SIZES) {
    const outDir = join(RES_DIR, dir);
    mkdirSync(outDir, { recursive: true });

    // ic_launcher.png (standard)
    await sharp(SOURCE)
      .resize(size, size, { fit: "cover", position: "centre" })
      .png()
      .toFile(join(outDir, "ic_launcher.png"));

    // ic_launcher_round.png (circular)
    const circle = Buffer.from(
      `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}"/></svg>`
    );
    await sharp(SOURCE)
      .resize(size, size, { fit: "cover", position: "centre" })
      .composite([{ input: circle, blend: "dest-in" }])
      .png()
      .toFile(join(outDir, "ic_launcher_round.png"));

    // ic_launcher_foreground.png (adaptive icon foreground — sedikit lebih kecil agar ada padding)
    const fgSize = Math.round(size * 0.6);
    const padded = Math.round((size - fgSize) / 2);
    await sharp(SOURCE)
      .resize(fgSize, fgSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: padded, bottom: padded, left: padded, right: padded, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(join(outDir, "ic_launcher_foreground.png"));

    console.log(`  ✅ ${dir} (${size}x${size})`);
  }

  // Web icon 512x512
  await sharp(SOURCE)
    .resize(512, 512, { fit: "cover", position: "centre" })
    .png()
    .toFile(WEB_ICON);
  console.log(`  ✅ src/app/icon.png (512x512)`);

  console.log("\n🎉 Semua icon berhasil di-generate!");
}

generateIcons().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
