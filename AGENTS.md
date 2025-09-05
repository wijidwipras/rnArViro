# Repository Guidelines

## Tujuan Agen Saat Ini
- Slicing UI: fokus memecah desain menjadi komponen UI reusable, konsisten dengan tema UI Kitten/Eva, dan capai kesesuaian visual (pixel-perfect) di semua layar.
- Fokus Android: optimalkan alur build, pengujian manual di perangkat/emulator, dan kompatibilitas AR (ARCore) terlebih dahulu.

## Struktur Proyek & Organisasi Modul
- Sumber: `src/` dengan folder fitur: `components/`, `screens/`, `navigation/`, `hooks/`, `services/`, `api/`, `utils/`, `state/`, `styles/`, `theme/`, `assets/` (font/gambar/animasi).
- Titik masuk: `index.js` (registri) dan `App.tsx` (providers + navigasi).
- Test: `__tests__/` (Jest). Contoh: `__tests__/App.test.tsx`.
- Proyek native: `android/`, `ios/`. Metro: `metro.config.js` (mendukung `glb/gltf`). Aset contoh: `cube.glb`.

## Build, Test, and Development
- `npm install`: Instal dependensi (Node >= 18).
- `npm run start`: Jalankan Metro bundler.
- `npm run android`: Build & deploy ke emulator/perangkat Android.
- `npm test`: Jalankan Jest. `npm run lint`: ESLint.
Tips Android: pastikan Android SDK/ADB siap; untuk AR, pasang layanan ARCore jika diperlukan.

## Gaya Kode & Konvensi Penamaan
- TypeScript: `.ts`/`.tsx`; indentasi 2 spasi, tanda petik tunggal, koma di akhir (konfigurasi Prettier).
- Linting: mewarisi `@react-native` via `.eslintrc.js`; perbaiki dengan `npx eslint . --fix`.
- Komponen/Layar: berkas PascalCase (mis., `NextScreen.tsx`).
- Hooks: `useX.ts` (ekspor camelCase). Konstanta: UPPER_SNAKE_CASE. Utilitas: lowerCamelCase.
- Komponen menggunakan fungsi + hooks; aset diimpor via `require(...)` dan model 3D dioptimasi.

## Panduan Pengujian
- Fokus saat ini: verifikasi manual di Android (emulator/perangkat) pada alur utama.
- Prioritas: stabilitas Android, konsistensi visual, dan aksesibilitas dasar (kontras, ukuran sentuh, label).

## Panduan Commit & Pull Request
- Gaya commit: `[type] pesan imperatif singkat` (mis. `[add] splash screen and lottie`, `[setup] project`).
- Jagalah commit fokus; referensikan issue di body (mis. `Fixes #123`).
- PR sertakan: ringkasan jelas, screenshot/rekaman untuk perubahan UI, langkah verifikasi, tautan issue. Pastikan CI sehat; jalankan `npm run lint` sebelum meminta review.

## Gambaran Arsitektur & Tips
- UI: UI Kitten (`@ui-kitten/components`) + tema Eva; tema/pemetaan kustom di `src/theme/`.
- Navigasi: `@react-navigation/native` dengan stack di `src/navigation/`.
- Aset: font di `src/assets/fonts` (konfigurasi di `react-native.config.js`). Hindari meng-commit rahasia; simpan konfigurasi lingkungan di luar sumber.
- Icon: `react-native-heroicons`. Lottie: `lottie-react-native`.
- AR: `@viro-community/react-viro` aktif; dukungan `glb/gltf` via `metro.config.js`.
