# Rencana Media Pembelajaran Geometri (AR)

Tujuan: membuat pengalaman belajar geometri yang interaktif di AR, dengan objek 3D yang dapat di-resize, otomatis mengikuti layar saat dibuka (reticle/ghost object), dan berpindah/snap ke bidang datar saat terdeteksi.

## Sasaran & Kriteria Sukses

- Dapat memperbesar/memperkecil objek dengan gestur pinch (rentang aman 0.1–3x).
- Saat aplikasi dibuka, objek “mengikuti” pusat layar (reticle) untuk memberi konteks skala & posisi.
- Ketika bidang datar terdeteksi, objek otomatis dipindah/snap ke bidang tersebut (atau dengan tap, sesuai mode).
- Pengalaman nyaman: instruksi jelas, performa stabil (>= 30 FPS), dan skala objek konsisten dengan satuan meter.

## Cerita Pengguna (User Stories)

- Sebagai siswa, saya melihat bentuk geometri muncul di depan saya dan mengikuti arah pandang saya sebelum ditempatkan.
- Sebagai siswa, saya bisa memperbesar/memperkecil bentuk agar mudah diamati detail sisi, rusuk, dan titik sudut.
- Sebagai siswa, ketika kamera menemukan meja/lantai, objek otomatis berpindah dan “menempel” di permukaan tersebut agar stabil.
- Sebagai guru, saya bisa menambahkan instruksi dan label (nama sisi, rusuk, sudut) untuk mendukung penjelasan.

## Fitur Inti

- Resize: pinch untuk skala dinamis dengan clamp (0.1–3.0), skala uniform XYZ.
- Auto-follow on open: hit-test titik tengah layar (reticle) berkala; selama belum ada bidang stabil, objek mengikuti hasil hit-test (estimated plane / depth) agar terasa “mengambang” di depan.
- Auto-snap to plane: saat terdeteksi horizontal plane (meja/lantai), objek berpindah ke posisi hit-test terakhir di plane dan “terkunci” di sana; opsi: tetap boleh tap-to-place untuk kontrol manual.

## Alur UX Sederhana

1. Buka aplikasi → status “Tracking” dicek → tampilkan reticle + teks singkat petunjuk.
2. Selama belum ada plane stabil, objek mengikuti pusat layar (smooth).
3. Plane terdeteksi → objek snap ke plane (atau menunggu tap, tergantung mode).
4. Siswa pinch untuk memperbesar/memperkecil; dapat menampilkan label sisi/rusuk/sudut on-demand.

## Pendekatan Teknis (React Native + @viro-community/react-viro)

- Scene: `ViroARSceneNavigator` → `ViroARScene`.
- Hit-test: gunakan `performARHitTestWithPoint(x, y)` dengan `x,y` titik tengah layar untuk auto-follow.
- Deteksi plane: filter hasil hit-test dengan tipe plane (mis. `ExistingPlaneUsingGeometry`, `ExistingPlaneUsingExtent`, `EstimatedHorizontalPlane`).
- Horizontal-only snap: hindari dinding/plane vertikal dengan heuristik orientasi dari `rotation` (derajat). Anggap horizontal bila |rotX| dan |rotZ| < ~25°. Jika tidak ada plane horizontal, teruskan follow dan jangan snap dulu.
- State:
  - `following`: true saat mengikuti pusat layar; false setelah snap.
  - `placed`: true saat objek sudah di posisi final (snap/tap).
  - `scale`: angka tunggal untuk uniform scaling (default 0.4, clamp 0.1–3.0).
- Gestur: `onPinch` pada `Viro3DObject` untuk mengubah `scale` (gunakan `baseScaleRef * scaleFactor`).
- Mode penempatan:
  - Otomatis (default): snap saat plane stabil pertama terdeteksi.
  - Manual: tap-to-place di bidang (pertahankan kode `performARHitTestWithPoint` pada `onClick`).
  - Opsi “Wall mode”: dapat diaktifkan kemudian untuk mengizinkan plane vertikal (default nonaktif agar tidak menempel di dinding).

## Tugas Tahapan (Milestones)

1. Dasar AR & izin kamera [Selesai di app saat ini]
2. Resize: implementasi `onPinch` dengan clamp dan smoothing
3. Auto-follow: loop hit-test pusat layar; perbarui posisi objek saat `following = true`
4. Deteksi plane & auto-snap: kunci posisi saat plane stabil; hentikan follow
5. Opsi tap-to-place: jika mode manual diaktifkan, pindahkan objek ke titik tap
6. UI instruksi: teks singkat, indikator tracking (Normal/Limited), reticle
7. Label edukatif: tampil/sembunyikan nama sisi, rusuk, sudut; highlight interaktif
8. Optimasi & uji: performa, lighting, ukuran aset, pengalaman siswa

## Rekomendasi Konten Geometri (Media Pembelajaran)

- Bentuk dasar: kubus, balok, prisma segitiga, limas, tabung, kerucut, bola.
- Material kontras: warna berbeda per sisi untuk memudahkan identifikasi; opsi wireframe/transparan.
- Label interaktif: tombol untuk menampilkan nama sisi (A, B, C…), rusuk (AB, BC…), sudut (∠ABC), serta jumlah masing-masing.
- Aktivitas:
  - “Cari dan sebutkan”: siswa menyentuh sisi/rusuk/sudut yang diminta.
  - “Ukur & bandingkan”: perbesar objek sampai rusuk ≈ 10 cm di dunia nyata; diskusikan skala.
  - “Transformasi”: perbesar/kecilkan untuk memahami invarian (mis. rasio sisi, bentuk sudut tetap).
- Pencahayaan: `ViroAmbientLight` + `ViroDirectionalLight` agar PBR & tepi bentuk jelas.

## Prompt/Narasi Edukatif (contoh dalam aplikasi)

- “Arahkan ponsel ke permukaan datar. Objek geometri akan mengikuti pusat layar.”
- “Begitu permukaan terdeteksi, objek akan ditempatkan di meja. Cubit untuk memperbesar atau memperkecil.”
- “Sentuh tombol ‘Label’ untuk menampilkan nama sisi, rusuk, dan sudut.”
- “Tantangan: sebutkan berapa banyak sisi, rusuk, dan titik sudut pada bangun ini!”
- “Ukur dengan mata: kira-kira panjang rusuknya berapa sentimeter saat ini?”

## Pedoman Aset

- Satuan meter: siapkan model dengan skala realistis (mis. kubus 0.2 m = 20 cm).
- Topologi bersih: normals & pivots tepat (pivot di pusat alas untuk bentuk yang berdiri di plane).
- Ukuran file: GLB < 2–5 MB; hindari tekstur raksasa; gunakan kompresi.

## Pengujian

- Tracking: kondisi cahaya rendah/tinggi; permukaan gelap/terang; jarak 30–100 cm.
- Performa: uji pada perangkat kelas menengah; pantau jank saat pinch & follow.
- Ketahanan: cepat beralih antara follow → snap → pinch tanpa glitch.

## Risiko & Mitigasi

- Plane sulit terdeteksi di meja/lantai polos → sarankan alas bermotif/koran; tambahkan reticle & instruksi.
- Tersnap ke dinding (vertical plane) → aktifkan filter horizontal-only; sediakan toggle “Wall mode” bila materi membutuhkan pemasangan di dinding.
- Skala membingungkan → tampilkan indikator skala (mis. “x1.5”) saat pinch.
- Pencahayaan buruk → instruksi singkat untuk pindah ke area lebih terang.

## Langkah Berikutnya

- Implementasi loop auto-follow (hit-test titik tengah) dan kondisi snap.
- Tambah UI toggle: Mode Otomatis (snap) vs Tap-to-place (manual).
- Tambahkan label edukatif dan satu set model bangun ruang.
