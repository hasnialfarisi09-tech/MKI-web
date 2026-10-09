# Informasi Keystore & Rilis Google Play

Dokumen ini berisi informasi kredensial Keystore rilis resmi untuk aplikasi **Estimasi Biaya** (`id.mki.kalkulatorinterior`).

> ⚠️ **PENTING**:
> Simpan file `mki-release-key.jks` dan kredensial ini di tempat yang aman (misalnya backup di Google Drive / Password Manager).
> Jika file keystore atau password ini hilang, Anda **tidak akan bisa mengupdate aplikasi** di Google Play Store untuk versi-versi berikutnya!

---

### 🔑 Kredensial Keystore Rilis

* **File Keystore**: `android/app/mki-release-key.jks`
* **Keystore Password**: `mkiPassword2026!`
* **Key Alias**: `mki-release-key`
* **Key Password**: `mkiPassword2026!`
* **Masa Berlaku**: 10.000 hari (hingga **23 Februari 2054**)
* **Algorithm**: RSA 2048-bit (SHA384withRSA)

---

### 🛡️ Sertifikat Fingerprints (SHA-1 & SHA-256)
Berguna jika Google Play Console atau API eksternal (Google Cloud / Firebase) meminta fingerprint sertifikat signing:

* **SHA-1**:
  ```text
  12:8E:F1:A9:4D:16:BA:92:1A:E9:CF:27:14:B5:84:23:16:89:A4:7D
  ```

* **SHA-256**:
  ```text
  76:F7:C3:40:1F:1E:06:6E:7A:E1:79:1A:DD:74:F0:1A:BC:2C:2A:BF:99:3E:01:FE:FB:F1:69:22:FF:D2:2A:D1
  ```

---

### 📦 Lokasi File Output Android App Bundle (.aab)

File `.aab` yang siap di-upload ke Google Play Console berada di:
* `android/app/build/outputs/bundle/release/app-release.aab`
* atau salinan dengan nama versi:
  `android/app/build/outputs/bundle/release/Estimasi-Biaya-v1.5.0.aab`

---

### 🚀 Cara Build Ulang AAB di Masa Depan

Cukup jalankan satu perintah berikut di terminal:
```bash
npm run bundle:android
```
Perintah ini otomatis:
1. Mem-build web statis Next.js (`npm run build`).
2. Menyelaraskan aset ke Capacitor Android (`npx cap sync android`).
3. Mengompilasi dan menandatangani file `.aab` rilis menggunakan Release Keystore.
