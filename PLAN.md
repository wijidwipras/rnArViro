% Rencana Migrasi UI (creativeSpaceLab → rnArViro)

Dokumen ini menjabarkan langkah terstruktur untuk memindahkan layar (Splash → Login → MainTabs/Home) dan styling (tema, mapping font, aset) dari project `creativeSpaceLab` ke `rnArViro`. Fitur AR akan tetap menggunakan implementasi AR dari `rnArViro` (via `@viro-community/react-viro`).

## Tujuan
- Menambahkan alur onboarding dan home dari `creativeSpaceLab` ke `rnArViro` tanpa mengubah fitur AR yang sudah ada.
- Menyatukan tema UI Kitten, font, dan aset agar tampilan konsisten.

## Ruang Lingkup
- Pindahkan layar:
  - `SplashScreen`, `LoginScreen`, `MainTabs` (berisi `HomeScreen`, `HelpScreen`, `ProfileScreen`) dan `NextScreen` (placeholder).
- Pindahkan styling & aset terkait:
  - UI Kitten theme: `src/theme/customTheme.ts`, `src/theme/customMapping.ts`.
  - Komponen: `src/components/common/ShadowButton.tsx`.
  - Aset gambar, lottie, dan font yang digunakan layar-layar di atas.
- Integrasi navigasi: tambahkan stack navigator dengan start di Splash → Login → MainTabs.
- Integrasi AR: tambahkan route `AR` yang menunjuk ke `ArSceneScreen` (dari `rnArViro`) dan hubungkan dari Home (card “Explore in AR”).

Out of scope:
- Tidak memindahkan layar AR dari `creativeSpaceLab` (ExploreInAr/ARExperiment).
- Tidak mengubah logika AR `rnArViro` selain penambahan route di navigator.

## Dependensi yang Ditambahkan (di rnArViro)
- Navigasi:
  - `@react-navigation/native`
  - `@react-navigation/stack`
  - `react-native-screens`
  - `react-native-safe-area-context`
  - `react-native-gesture-handler`
- UI & styling:
  - `@ui-kitten/components`
  - `@eva-design/eva`
  - `react-native-linear-gradient`
  - `lottie-react-native`
  - `react-native-heroicons`
  - `react-native-svg`

Catatan kompatibilitas:
- `rnArViro` menggunakan React Native 0.73.9. Gunakan versi paket yang kompatibel dengan RN 0.73.x (bila versi di `creativeSpaceLab` tidak cocok, pilih minor terdekat yang mendukung RN 0.73).

## Aset yang Dipindahkan
- Gambar: `logo-criti-space.png`, `kananatas.png`, `kiritengah.png`, `explore-in-ar(.png| -bg.png)`, `problem-challenge(-bg).png`, `geogebra-lab(-bg).png`, `my-progress(-bg).png`.
- Lottie: `cube2.json`.
- Font: `PlusJakartaSans-{Regular,Medium,SemiBold,Bold}.ttf`.

## Struktur Folder Baru (rnArViro)
- `src/theme/` → `customTheme.ts`, `customMapping.ts`
- `src/components/common/` → `ShadowButton.tsx`
- `src/screens/` → `SplashScreen.tsx`, `LoginScreen.tsx`, `HomeScreen.tsx`, `HelpScreen.tsx`, `ProfileScreen.tsx`, `NextScreen.tsx`, `MainTabs.tsx`
- `src/assets/images/` → seluruh gambar yang diperlukan
- `src/assets/lottie/` → `cube2.json` (opsional: tetap di images jika ingin)
- `src/assets/fonts/` → file TTF
- `src/config/env.ts` → util versi app (opsional; atau baca langsung dari `package.json`)

## Langkah Migrasi
1) Install dependensi tambahan
- Tambahkan paket navigasi dan UI Kitten beserta peer deps (lihat daftar di atas).
- iOS: setelah install, jalankan `cd ios && pod install`.

2) Pindahkan file & aset
- Salin file layar, komponen, tema, dan aset dari `creativeSpaceLab` ke struktur folder `rnArViro` di atas.
- Salin `react-native.config.js` (atau gabungkan) untuk deklarasi assets fonts: `assets: ['./src/assets/fonts']`.

3) Link font
- Jalankan `npx react-native-asset` agar font tersalin ke `android/app/src/main/assets/fonts` dan terdaftar di iOS.
- Verifikasi Info.plist/Build Phases iOS bila diperlukan.

4) Setup UI Kitten provider
- Bungkus root app `App.tsx` dengan:
  - `ApplicationProvider` dari `@ui-kitten/components` menggunakan `eva.light` yang digabung dengan `customTheme`.
  - `customMapping` untuk font mapping.

5) Tambah navigator
- Buat `AppNavigator.tsx` (atau edit `App.tsx`) untuk menggunakan `NavigationContainer` + `createStackNavigator`.
- Rute:
  - `Splash` → `SplashScreen`
  - `Login` → `LoginScreen`
  - `MainTabs` → `MainTabs` (hide header)
  - `Next` → `NextScreen`
  - `AR` → `ArSceneScreen` (dari `rnArViro`), tetap tersedia dari Home

6) Integrasi Home → AR
- Di `HomeScreen`, ubah handler card “Explore in AR” agar `navigation.navigate('AR')` (menggunakan `ArSceneScreen` bawaan `rnArViro`).
- Hapus referensi ke `ExploreInAr`/`ARExperiment` (tidak dipindahkan).

7) Komponen pendukung
- Salin `ShadowButton.tsx` dan pastikan impor `@ui-kitten/components` tersedia.
- Pastikan `react-native-linear-gradient` terpasang untuk header gradient di Home.

8) Lottie
- Pastikan `lottie-react-native` terinstall.
- iOS: jalankan `pod install` lagi bila ada perubahan native.

9) Konfigurasi Android/iOS tambahan
- Android: `react-native-screens` biasanya aktif otomatis di RN 0.73, namun pastikan tidak ada konflik.
- iOS: verifikasi Pods untuk `react-native-svg`, `lottie-react-native`.

10) Verifikasi build
- Jalankan `npm start` → `npm run android` / `npm run ios`.
- Cek alur: Splash → Login → MainTabs(Home) → buka AR (ArSceneScreen).

## Perubahan Kode Inti (ringkas)
- `App.tsx`:
  - Bungkus dengan `ApplicationProvider` (UI Kitten) + `customTheme` dan `customMapping`.
  - Render `AppNavigator` (Stack) alih-alih langsung `ArSceneScreen`.
- `HomeScreen.tsx`:
  - Ubah onPress card “Explore in AR” menjadi `navigation.navigate('AR')`.
- Tambah `react-native.config.js` untuk fonts (jika belum ada).

## Checklist Uji
- Splash menampilkan animasi lottie dan tombol “Mulai”.
- Navigasi Splash → Login → MainTabs berjalan.
- UI Kitten theme dan font PlusJakartaSans aktif (cek heading/body).
- Home menampilkan grid kartu dan membuka `ArSceneScreen` saat memilih “Explore in AR”.
- AR (rnArViro) tetap berfungsi (hit-test, place/follow/pinch).

## Risiko & Mitigasi
- Versi paket tidak cocok dengan RN 0.73 → gunakan versi minor yang kompatibel, atau lock seperti di repo template RN 0.73.
- Font tidak ter-link → jalankan `npx react-native-asset` dan rebuild; verifikasi iOS target membership.
- Konflik gesture/navigation → pastikan `react-native-gesture-handler` di-install dan import paling atas (jika diperlukan).
- Lottie gagal build iOS → pastikan Pods terinstall dan versi cocok.

## Rollback
- Perubahan terbatas pada penambahan file dan pembaruan `App.tsx`/navigator.
- Simpan branch sebelum migrasi. Jika terjadi isu besar, kembalikan `App.tsx` untuk merender `ArSceneScreen` langsung dan nonaktifkan navigator sementara.

## Catatan Tambahan
- `src/config/env.ts` opsional untuk menampilkan versi app di Splash. Alternatif: baca `require('../package.json').version` langsung saat render.
- Bila ingin Bottom Tabs berbasis `@react-navigation/bottom-tabs`, dapat menggantikan `MainTabs` (UI Kitten BottomNavigation) kemudian.

