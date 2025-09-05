# Rencana Fitur: AR Scale Input (Media Pembelajaran)

Dokumen ini memfokuskan penambahan kontrol ukuran (scale) objek 3D di mode AR melalui sebuah input UI. Target: pengguna dapat mengubah skala model secara presisi dengan kontrol numerik dan tombol +/- (selain pinch yang sudah ada).

## Tujuan
- Pengguna dapat mengatur skala objek AR via input dengan rentang aman.
- Perubahan skala terlihat real-time pada objek 3D yang ditempatkan.
- Prioritas Android: performa stabil dan UX jelas pada perangkat/emulator.
 - Penempatan objek 3D berbasis image marker (bukan plane detection).

## Hasil Akhir (Deliverables)
- Overlay UI di `ArSceneScreen` berisi: tombol `-`, `Input` numerik, tombol `+`.
- Alur data satu arah: nilai `scale` disimpan di `ArSceneScreen`, diteruskan ke AR Scene via `viroAppProps`.
- `ArScene` membaca `scale` dari `viroAppProps` dan menerapkannya ke `Viro3DObject`.
- Validasi manual Android dan catatan aksesibilitas/durability (min/max, step).
- Lokasi model: `D:\Code\rnArViro\src\assets\models` (di kode: `src/assets/models`).
- Header AR transparan: tombol back bulat ber-icon + judul fitur di pojok kanan.
- Image Marker AR: registrasi target (`ViroARTrackingTargets`) dan render objek hanya saat marker terdeteksi (`ViroARImageMarker`).

## Arsitektur & Alur Data
- Sumber state: `ArSceneScreen` menyimpan `scale` (default 0.4, min 0.1, max 3.0, step 0.1).
- Propagasi: `ViroARSceneNavigator` diberi `viroAppProps={{ wallMode, scale, scaleNonce }}`.
- Konsumsi: `ArScene` membaca `sceneNavigator.viroAppProps.scale` dan menyinkronkan state lokal `scale` saat berubah.
- Konflik gesture: pinch tetap didukung opsional. Jika input berubah, nilai input menjadi sumber kebenaran terbaru (menimpa hasil pinch saat ada update dari UI).

## Detail Implementasi
1) UI Overlay (React Native + UI Kitten)
- Tambahkan kontainer overlay di `ArSceneScreen` di bawah toggle `Wall Mode`.
- Komponen: `Button` ("-"), `Input` bertipe numeric (keyboardType), `Button` ("+").
- Aturan nilai: clamp ke [0.1, 3.0], pembulatan ke 1 desimal saat input manual.
- Aksesibilitas: label tombol, ukuran touch ≥ 44dp, kontras.

1b) Header AR Transparan (Top‑Right)
- Sembunyikan header bawaan navigator (`headerShown: false`) pada route AR.
- Tambahkan overlay header absolut di `ArSceneScreen`: `position: 'absolute', top: <safe area>, right: 16`.
- Back button bulat: `TouchableOpacity` berukuran 40–48dp, `borderRadius: 24`, background `rgba(0,0,0,0.35)`, icon `ArrowLeftIcon` (white) dari `react-native-heroicons`.
- Judul fitur (mis. "AR Viewer") di sebelah kiri tombol atau sejajar kanan, warna putih, semi‑bold.
- Interaksi: `onPress={() => navigation.goBack()}`; aksesibilitas: `accessibilityRole="button"`, `accessibilityLabel="Kembali"`.
- Pastikan z-index di atas `ViroARSceneNavigator` dan nyaman dibaca di latar kamera terang/gelap.

2b) Marker AR (Image Target)
- Struktur aset marker: `src/assets/markers/<nama_marker>.png` (disarankan kontras tinggi, pola unik).
- Registrasi target di `ArScene`:
  `ViroARTrackingTargets.createTargets({ markerA: { source: require('src/assets/markers/markerA.png'), orientation: 'Up', physicalWidth: 0.1 } })`.
- Gunakan `ViroARImageMarker target="markerA"` sebagai parent dari `ViroNode`/`Viro3DObject`. Anak akan dirender ketika marker terdeteksi dan akan mengikuti marker.
- Nonaktifkan reticle/tap-to-place saat marker mode; tampilkan teks "Arahkan kamera ke marker" sampai terdeteksi.
- Skala: `physicalWidth` (meter) mempengaruhi skala relatif; kontrol `scale` dari UI diterapkan pada node anak di dalam marker.

2) State & Sinkronisasi
- Tambah `const [scale, setScale] = useState(0.4)` di `ArSceneScreen`.
- Kirim ke navigator: `viroAppProps={{ wallMode, scale, scaleNonce }}`; `scaleNonce` di‑increment tiap perubahan agar memicu re‑render scene bila diperlukan.
- Di `ArScene`: baca `const ext = sceneRef.current?.props?.sceneNavigator?.viroAppProps;` lalu gunakan `useEffect` untuk `if (typeof ext?.scale === 'number') setScale(ext.scale)` sehingga state lokal mengikuti input.
- Pinch: tetap aktif; opsional tambahkan flag `inputLocksPinch` untuk menonaktifkan pinch jika dibutuhkan (fase berikutnya).

3) Penerapan pada Objek 3D
- Pastikan properti `scale` pada `Viro3DObject` menggunakan nilai dari state lokal yang tersinkron.
- Pastikan clamp tetap diterapkan di handler pinch dan input untuk konsistensi.

4) Tipe & Validasi
- Definisikan tipe `ViroAppProps` minimal: `{ wallMode?: boolean; scale?: number; scaleNonce?: number }` (inline atau util tipe kecil di `src/types/vr.ts`).
- Tidak menambah dependensi eksternal (hindari slider komunitas untuk saat ini).

## Rencana Kerja (Urutan)
0. Pindahkan model GLB ke `src/assets/models` dan perbarui `require(...)` di `ArScene`.
1. Tambah state `scale` + UI overlay di `ArSceneScreen` (Button/Input +/-).
2. Tambah header AR transparan (overlay) dengan tombol back bulat + judul di pojok kanan.
3. Thread nilai ke `ViroARSceneNavigator.viroAppProps` (+ `scaleNonce`).
4. Sinkronisasi di `ArScene` (read viroAppProps → set local `scale`).
5. Samakan clamp/step di pinch handler dan input.
6. Uji manual di Android (emulator + perangkat fisik) dan catat hasil.

Tambahan (Marker Mode)
- Tambah aset marker ke `src/assets/markers` dan tentukan `physicalWidth` (mis. 0.1 m = 10 cm cetak).
- Registrasi `ViroARTrackingTargets` dan bungkus objek dalam `ViroARImageMarker`.
- Matikan alur plane/reticle/following saat marker aktif; hanya render saat marker terdeteksi.

## Uji Manual (Android‑first)
- Buka layar AR, tunggu reticle muncul, ketuk untuk place model.
- Tekan `+` beberapa kali: objek membesar; verifikasi tidak > 3.0x.
- Tekan `-` beberapa kali: objek mengecil; verifikasi tidak < 0.1x.
- Edit angka langsung di `Input` (mis. `1.2`) lalu submit/blur: objek menyesuaikan persis.
- Coba pinch setelah set via input: perubahan halus; kemudian tekan `+` lagi memastikan input menimpa ke nilai yang tepat.
- Pantau log untuk `onError` model; amati stabilitas FPS & tracking.
- Verifikasi header transparan tampil di atas kamera, back button mudah diketuk dan `goBack()` bekerja, judul terbaca di latar terang/gelap.
- Pastikan model termuat dari `src/assets/models` tanpa error path.
 - Cetak/tampilkan marker (disarankan lebar fisik 10 cm = `physicalWidth: 0.1`). Arahkan kamera ke marker; objek muncul/lenyap sesuai status deteksi dan mengikuti marker saat digerakkan.

## Risiko & Mitigasi
- Sinkronisasi props→scene tidak memicu render: gunakan `scaleNonce` untuk memaksa update dan efek `useEffect` yang membaca `sceneRef.current?.props`.
- Konflik pinch vs input: tetapkan prioritas input; opsi mematikan pinch via flag jika diperlukan.
- Keyboard overlap: gunakan overlay tetap di bawah; hindari TextInput fokus lama, atau gunakan submit/blur.
 - Deteksi marker rentan pada pencahayaan buruk/glare: gunakan marker kontras tinggi, hindari refleksi, dan uji beberapa ukuran.
 - Penyesuaian ukuran dunia: jika ukuran terasa tidak realistis, kalibrasi `physicalWidth` marker dan sediakan preset skala.

## Peningkatan Lanjutan (Opsional)
- Ganti Input numerik dengan slider kustom; atau tambah paket `@react-native-community/slider` jika diperlukan.
- Persist preferensi skala terakhir (AsyncStorage).
- Preset skala (0.25x, 0.5x, 1x, 2x) sebagai tombol cepat.
- Unit edukatif: tampilkan ukuran estimasi dalam cm/m berdasarkan model.

## Out of Scope (Saat Ini)
- Shader kustom, morph target, atau pengeditan mesh runtime.
- UI onboarding baru dan navigasi selain kontrol skala di layar AR.

## Catatan Android
- Pastikan ARCore/Google Play Services for AR terpasang di perangkat uji.
- Jaga polycount dan ukuran tekstur model GLB (<~3–5 MB) untuk performa baik.
- Gunakan status bar konten terang (light‑content) atau sembunyikan status bar agar header kontras.
