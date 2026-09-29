/**
 * Script: Export pricing-calculator.ts → CSV files
 * Menggunakan tsx (TypeScript execute) untuk membaca data langsung
 * Jalankan: node scripts/export-to-csv.mjs
 */

import { execSync } from "child_process";
import { mkdirSync, writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ─── Konversi value ke CSV-safe string ───────────────────────────────────────
function csvVal(v) {
  if (v === undefined || v === null) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsvLine(arr) {
  return arr.map(csvVal).join(",");
}

// ─── Generate Pricing CSV ─────────────────────────────────────────────────────
function generatePricingCsv(items) {
  const headers = [
    "itemId", "itemName", "category", "defaultUnit", "description",
    "defaultSelected", "defaultQty", "defaultLength", "defaultHeight",
    "optionId", "optionName", "model", "unit", "priceDK", "priceLK", "optionDesc",
  ];

  const rows = [toCsvLine(headers)];

  for (const item of items) {
    const itemBase = [
      item.id, item.name, item.category, item.defaultUnit, item.description,
      item.defaultSelected ? "TRUE" : "FALSE",
      item.defaultQty ?? "", item.defaultLength ?? "", item.defaultHeight ?? "",
    ];

    const options = item.options || [];

    if (options.length === 0) {
      rows.push(toCsvLine([...itemBase, "", "", "", "", "", "", ""]));
      continue;
    }

    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const optCols = [opt.id, opt.name, opt.model, opt.unit, opt.priceDK, opt.priceLK, opt.description ?? ""];
      if (i === 0) {
        rows.push(toCsvLine([...itemBase, ...optCols]));
      } else {
        rows.push(toCsvLine([item.id, "", "", "", "", "", "", "", "", ...optCols]));
      }
    }
  }

  return rows.join("\n");
}

// ─── Generate Locations CSV ───────────────────────────────────────────────────
function generateLocationsCsv(provinces) {
  const headers = ["provinceId", "provinceName", "cityId", "cityName", "isDK"];
  const rows = [toCsvLine(headers)];

  for (const prov of provinces) {
    const cities = prov.cities || [];
    if (cities.length === 0) {
      rows.push(toCsvLine([prov.id, prov.name, "", "", ""]));
      continue;
    }
    for (const city of cities) {
      rows.push(toCsvLine([prov.id, prov.name, city.id, city.name, city.isDK ? "TRUE" : "FALSE"]));
    }
  }

  return rows.join("\n");
}

// ─── Main: jalankan extractor via tsx ────────────────────────────────────────
async function main() {
  console.log("📊 Mengekstrak data dari pricing-calculator.ts...");

  // Tulis script extractor sementara
  const extractorPath = join(ROOT, "scripts/_extractor.ts");
  writeFileSync(extractorPath, `
import {
  KITCHEN_ITEMS,
  ELECTRONIC_ITEMS,
  ACCESSORIES_ITEMS,
  OTHER_CATEGORIES,
  PROVINCES_DATA,
} from "../src/data/pricing-calculator";

const allItems = [
  ...KITCHEN_ITEMS,
  ...ELECTRONIC_ITEMS,
  ...ACCESSORIES_ITEMS,
  ...OTHER_CATEGORIES,
];

const output = {
  items: allItems,
  provinces: PROVINCES_DATA,
};

process.stdout.write(JSON.stringify(output));
`);

  let jsonOutput;
  try {
    // Coba dengan tsx (biasanya sudah ada di node_modules)
    jsonOutput = execSync(`npx tsx scripts/_extractor.ts`, {
      cwd: ROOT,
      encoding: "utf-8",
      timeout: 30000,
    });
  } catch (e) {
    // Fallback ke ts-node jika tsx tidak ada
    try {
      jsonOutput = execSync(`npx ts-node --esm scripts/_extractor.ts`, {
        cwd: ROOT,
        encoding: "utf-8",
        timeout: 30000,
      });
    } catch (e2) {
      throw new Error(
        "Tidak bisa menjalankan tsx atau ts-node. Coba: npm install -D tsx\n" + e2.message
      );
    }
  }

  // Hapus extractor temp
  try {
    execSync(`del scripts\\_extractor.ts`, { cwd: ROOT });
  } catch {}

  const data = JSON.parse(jsonOutput);

  console.log(`✅ ${data.items.length} furniture items`);
  console.log(`✅ ${data.provinces.length} provinsi`);

  // Buat output dir
  const outDir = join(ROOT, "docs/sheets-data");
  mkdirSync(outDir, { recursive: true });

  // Generate CSV
  const pricingCsv = generatePricingCsv(data.items);
  const locationsCsv = generateLocationsCsv(data.provinces);

  writeFileSync(join(outDir, "pricing.csv"), pricingCsv, "utf-8");
  writeFileSync(join(outDir, "locations.csv"), locationsCsv, "utf-8");

  const pr = pricingCsv.split("\n").length - 1;
  const lr = locationsCsv.split("\n").length - 1;

  console.log(`\n✅ CSV berhasil dibuat!`);
  console.log(`   📄 docs/sheets-data/pricing.csv   → ${pr} baris data`);
  console.log(`   📄 docs/sheets-data/locations.csv → ${lr} baris data`);
  console.log(`\n📌 Langkah selanjutnya:`);
  console.log(`   Import kedua file ini ke Google Sheets`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
