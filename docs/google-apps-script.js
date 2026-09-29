/**
 * ============================================================
 * MKI Interior - Google Apps Script API
 * ============================================================
 * 
 * CARA DEPLOY:
 * 1. Buka Google Sheets kamu
 * 2. Klik menu "Extensions" → "Apps Script"
 * 3. Hapus kode yang ada, paste seluruh kode ini
 * 4. Klik "Deploy" → "New deployment"
 * 5. Pilih type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone" (agar app bisa akses tanpa login)
 * 8. Klik "Deploy" → copy URL yang muncul
 * 9. Simpan URL itu ke file .env.local di project Next.js
 * ============================================================
 */

const SHEET_NAMES = {
  PRICING: "Pricing",
  LOCATIONS: "Locations",
  APP_VERSION: "AppVersion",
};

/**
 * Handle GET request - router utama
 */
function doGet(e) {
  const params = e.parameter;
  const action = params.action || "pricing";

  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    let data;

    switch (action) {
      case "pricing":
        data = getPricingData();
        break;
      case "locations":
        data = getLocationsData();
        break;
      case "app_version":
        data = getAppVersionData();
        break;
      case "all":
        data = {
          pricing: getPricingData(),
          locations: getLocationsData(),
          appVersion: getAppVersionData(),
        };
        break;
      default:
        data = { error: "Unknown action: " + action };
    }

    output.setContent(
      JSON.stringify({
        success: true,
        data: data,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (err) {
    output.setContent(
      JSON.stringify({
        success: false,
        error: err.message,
      })
    );
  }

  return output;
}

/**
 * Ambil data pricing dari sheet "Pricing"
 * 
 * Struktur kolom sheet "Pricing":
 * A: itemId | B: itemName | C: category | D: defaultUnit | E: description
 * F: defaultSelected | G: defaultQty | H: defaultLength | I: defaultHeight
 * J: optionId | K: optionName | L: model | M: unit | N: priceDK | O: priceLK | P: optionDesc
 */
function getPricingData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.PRICING);

  if (!sheet) throw new Error('Sheet "Pricing" tidak ditemukan!');

  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1); // skip header row

  const itemsMap = {};

  rows.forEach(function(row) {
    if (!row[0]) return; // skip empty rows

    const itemId = String(row[0]).trim();
    const optionId = row[9] ? String(row[9]).trim() : "";

    if (!itemsMap[itemId]) {
      itemsMap[itemId] = {
        id: itemId,
        name: String(row[1]).trim(),
        category: String(row[2]).trim(),
        defaultUnit: String(row[3]).trim(),
        description: String(row[4]).trim(),
        defaultSelected: String(row[5]).toLowerCase() === "true" || row[5] === true,
        defaultQty: row[6] ? Number(row[6]) : undefined,
        defaultLength: row[7] ? Number(row[7]) : undefined,
        defaultHeight: row[8] ? Number(row[8]) : undefined,
        options: [],
      };
    }

    if (optionId) {
      itemsMap[itemId].options.push({
        id: optionId,
        name: String(row[10]).trim(),
        model: String(row[11]).trim(),
        unit: String(row[12]).trim(),
        priceDK: Number(row[13]),
        priceLK: Number(row[14]),
        description: row[15] ? String(row[15]).trim() : undefined,
      });
    }
  });

  return Object.values(itemsMap);
}

/**
 * Ambil data lokasi dari sheet "Locations"
 * 
 * Struktur kolom sheet "Locations":
 * A: provinceId | B: provinceName | C: cityId | D: cityName | E: isDK
 */
function getLocationsData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.LOCATIONS);

  if (!sheet) throw new Error('Sheet "Locations" tidak ditemukan!');

  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1); // skip header

  const provincesMap = {};

  rows.forEach(function(row) {
    if (!row[0]) return;

    const provinceId = String(row[0]).trim();

    if (!provincesMap[provinceId]) {
      provincesMap[provinceId] = {
        id: provinceId,
        name: String(row[1]).trim(),
        cities: [],
      };
    }

    if (row[2]) {
      provincesMap[provinceId].cities.push({
        id: String(row[2]).trim(),
        name: String(row[3]).trim(),
        isDK: String(row[4]).toLowerCase() === "true" || row[4] === true,
      });
    }
  });

  return Object.values(provincesMap);
}

/**
 * Ambil data versi aplikasi dari sheet "AppVersion"
 * 
 * Struktur sheet "AppVersion" (Key - Value):
 * Baris 1: latestVersion | 1.1.0
 * Baris 2: minVersion    | 1.0.0 (jika versi app < minVersion, wajib update)
 * Baris 3: downloadUrl   | https://link-ke-file-apk.com
 * Baris 4: changelog     | Perubahan tata letak, tombol baru, dan performa kalkulasi lebih cepat
 * Baris 5: forceUpdate   | FALSE (atau TRUE jika wajib update)
 * Baris 6: releaseDate   | 2026-09-30
 */
function getAppVersionData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.APP_VERSION);

  // Jika tab "AppVersion" belum dibuat pengguna di Google Sheets, return null secara aman
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  if (!data || data.length === 0) return null;

  const config = {};
  for (let i = 0; i < data.length; i++) {
    const key = String(data[i][0] || "").trim();
    const val = data[i][1];
    if (key) {
      config[key] = val;
    }
  }

  // Jika baris kosong atau tidak ada latestVersion
  if (!config.latestVersion) return null;

  return {
    latestVersion: String(config.latestVersion).trim(),
    minVersion: config.minVersion ? String(config.minVersion).trim() : "1.0.0",
    downloadUrl: String(config.downloadUrl || "").trim(),
    changelog: String(config.changelog || "").trim(),
    forceUpdate: String(config.forceUpdate).toLowerCase() === "true" || config.forceUpdate === true,
    releaseDate: config.releaseDate ? String(config.releaseDate).trim() : "",
  };
}

/** Fungsi test - jalankan manual di editor untuk cek */
function testAPI() {
  const pricing = getPricingData();
  const locations = getLocationsData();
  const appVersion = getAppVersionData();
  Logger.log("Pricing items: " + pricing.length);
  Logger.log("Provinces: " + locations.length);
  Logger.log("App Version: " + JSON.stringify(appVersion));
  Logger.log("First item: " + JSON.stringify(pricing[0]));
}

