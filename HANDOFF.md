# Argo Loro — Status Pekerjaan

Terakhir diperbarui: 16 Agustus 2026

Microsite untuk link bio Instagram **Argo Loro — coffee & eatery**, Selo, Boyolali.
Situs statis murni: HTML + CSS + JS vanilla. **Tanpa framework, tanpa build step** —
ini keputusan sadar, alasannya di bagian "Keputusan arsitektur" di bawah.

---

## ✅ Halaman menu sudah diverifikasi (16 Agustus 2026)

Diuji di browser pada viewport 390×844. Hasil:

| Fitur | Hasil |
|---|---|
| Bug "blink" chip | **Teratasi** — chip aktif tercatat hanya `["Ice Cream"]` selama scroll |
| Tab Minuman / Makanan | 11 vs 8 kategori, `scrollY` reset ke 0 saat berpindah |
| Pencarian | latte→11, pizza→3, wedang→4, zzz→0 + empty state; lintas grup |
| Panel semua kategori | 19 kategori; pilih dari grup lain ikut memindahkan tab |
| Error konsol | nol |

**Penyebab bug blink** (supaya tidak terulang): `window.scrollTo` yang halus membuat
halaman melintasi setiap kategori di antaranya, dan tiap lintasan memicu
IntersectionObserver. Perbaikannya di `menu.js` — variabel `terkunci` mematikan
observer selama scroll hasil klik, dilepas 120 ms setelah scroll benar-benar diam.
**Jangan hapus kunci itu.**

Cara menguji ulang:
```bash
cd /Users/64664/argoloro && python3 -m http.server 8934
# lalu buka http://localhost:8934/menu.html
```

---

## Yang sudah selesai & terverifikasi

### Beranda (`index.html`)
- Hero foto tunggal `hero-1.jpg` (statis, bukan carousel) — foto ini yang jadi hook
- Status buka/tutup **real-time zona WIB**, dihitung ulang tiap menit
- Blok aksi: Reservasi WhatsApp (primary) + Rute / Menu / Argo Vila
- Bento grid asimetris berisi 2 foto + 4 kartu info
- Agenda dari data JS (`FEATURED_EVENT` + `EVENTS` di `script.js`)
- Peta Google pakai **fasad** — iframe baru dimuat saat tombol diklik

### Performa (terukur, bukan perkiraan)

| Jaringan | LCP awal | LCP sekarang |
|---|---|---|
| 3G lemah (400 Kbps) | 11.752 ms | **4.012 ms** |
| 3G biasa (780 Kbps) | 6.208 ms | **2.400 ms** |
| 4G lemah (1,6 Mbps) | 8.184 ms | **1.244 ms** |

Transfer awal: 1.515 KB → **227 KB**

Penyebab lambat yang ditemukan, urut dari terbesar:
1. **iframe Google Maps** menarik ±165 KB JS pihak ketiga. `loading="lazy"` **tidak**
   menahannya. → diganti fasad klik-untuk-muat.
2. **Gambar bento** ikut terunduh di awal meski `lazy`. → diganti `data-srcset` manual
   yang baru aktif **setelah foto hero selesai**.
3. Format & ukuran gambar → AVIF/WebP + `srcset` 640/800/960/1080.
4. Font → prioritas diturunkan pakai `media="print"` + `onload`.

Catatan penting: foto-foto ini **mahal dikompresi** karena daun pakis =
ribuan helai kecil berkontras tinggi. Format saja tidak cukup, ukuran piksel
yang menentukan.

### Pencarian menu — sinonim Bahasa Indonesia

Nama menu berbahasa Inggris, pengunjung berbahasa Indonesia. Sebelum diperbaiki,
mengetik **"kopi" hanya menemukan 1 item** dari 22 minuman berbasis kopi.

Tiga perbaikan di `menu.js` + tabel `SINONIM` di `menu-data.js`:

1. **Tabel sinonim** — kalau kata di `cocok` muncul pada nama item atau kategorinya,
   kata di `kata` ditempelkan ke teks pencarian (tak terlihat di layar).
   Menambah sinonim cukup menambah satu baris, tanpa menyentuh kode.
2. **Diakritik dibuang** (`normalize("NFD")`) — "cafe latte" kini menemukan "Café Latte".
3. **Pencocokan per kata, bukan substring utuh** — "es kopi" dan "ayam pedas" berhasil.
   Dengan substring utuh keduanya selalu nihil karena kata-katanya tidak pernah
   berdampingan persis.

Hasil (diuji di produksi, mobile + desktop, semua lolos):
`kopi` 1→32 · `ayam pedas`→3 tepat · `teh`→7 · `nasi`→15 · `favorit`→51

#### ⚠️ Jangan hapus `.page-menu [hidden]` di style.css

Atribut `hidden` hanya bekerja lewat stylesheet bawaan browser
(`[hidden] { display: none }`), dan **aturan CSS penulis mana pun yang menyetel
`display` akan mengalahkannya.** `.menu-item { display: flex }` sempat membuat
pencarian menghitung "1 menu cocok" tapi tetap menampilkan seluruh 15 item.

Penjaga `.page-menu [hidden] { display: none }` berspesifisitas 0,2,0 sehingga
menang atas aturan kelas tunggal, tanpa perlu `!important`. Berlaku untuk semua
elemen di halaman menu, jadi aturan `display` baru tidak akan menimbulkan bug
yang sama diam-diam.

**Pelajaran untuk pengujian:** jangan pernah mengukur `:not([hidden])` — itu
membaca DOM, bukan yang terlihat. Pakai `getComputedStyle(el).display !== 'none'`
plus cek `getBoundingClientRect()`. Uji versi lama lolos padahal halamannya rusak.

#### Pencocokan harus per KATA, bukan potongan teks

Tiga bug muncul dari pencocokan potongan (`indexOf`), semuanya lolos uji awal
karena uji itu hanya memeriksa jumlah **minimum** dan tidak pernah memeriksa
kecocokan **palsu**:

| Gejala | Sebab |
|---|---|
| `kopi` memunculkan Red Velvet, Taro, Chocolate, Matcha | `"Non Coffee"` mengandung kata `coffee` |
| `kopi` memunculkan Mix Platter & Selo Platter | `"Platter"` mengandung `latte` (p-**latte**-r) |
| `kopi` memunculkan Susu Jahe | satu aturan menggabung `susu` dengan `latte` |

Tiga perbaikan di `menu.js` — **jangan dikembalikan ke `indexOf` biasa**:

1. Sinonim dicocokkan sebagai kata utuh (`adaKata`, regex batas non-alfanumerik).
2. Field `kecuali` untuk frasa yang membalik makna, dipakai `["non coffee"]`.
3. Query pengguna dicocokkan dari **awal kata**, bukan tengah kata. Ketik
   sebagian tetap jalan (`choco`→Chocolate, `moji`→Mojito) tapi `latte` tidak
   lagi menemukan `Platter`.

Hasil akhir `kopi` = 25 item: 14 Coffee + 3 Manual Brewing + 5 Black Series +
Lemonade Coffee + Argo Brown Latte + Berry Coffee Breez. Tidak ada yang nyasar.

**Matcha sengaja muncul saat mencari "teh"/"tea"** — matcha adalah teh hijau.
Kalau tidak diinginkan, hapus `green tea` dari aturan matcha di `menu-data.js`.

Uji regresi ada di `ketat.js` (scratchpad): memeriksa daftar `harus` **dan**
`jangan` untuk tiap query. Selalu pakai pola itu, bukan jumlah minimum.

### Halaman menu (`menu.html`)
- **111 item, 19 kategori** dari ketiga foto menu cetak
- Data di `menu-data.js` — satu-satunya berkas yang perlu diedit untuk ubah harga
- CSS digabung ke `style.css` (bukan berkas terpisah) supaya pengunjung dari
  beranda tidak perlu request CSS kedua

---

## Belum selesai / perlu keputusan

### 1. Deploy ✅ SUDAH PUBLIK (16 Agustus 2026)
- URL: **https://argoloro.vercel.app** — siap ditempel di bio Instagram
- Project: `prj_QKjixWfqCezE23b9ATFnis7yEQrn`
- Team: `team_wdAaKb35RRhb5BF9O5FAUn2k`
- Akun: `rizkyanindita`
- `ssoProtection` dimatikan. Diverifikasi dari konteks browser bersih tanpa
  cookie: `/` dan `/menu.html` keduanya `200`, tidak ada redirect ke login.
- **LCP produksi di 3G lemah: 3.424 ms** (lebih cepat dari lokal karena CDN Vercel).

Cara deploy ulang setelah mengubah berkas:
```bash
npx vercel@latest deploy --prod --yes
```
Vercel CLI belum terpasang global — `npx` sudah cukup. Akun sudah terautentikasi.

**Setelah deploy, muat ulang paksa** (`Cmd+Shift+R` / `Ctrl+Shift+R`) sebelum
menilai hasilnya. Tab yang sudah terbuka tetap memakai CSS & JS lama — mengetik
di kotak pencarian tidak mengunduh ulang berkasnya. Ini sempat membuat perbaikan
yang sudah live terlihat seolah masih rusak.

Catatan: deploy **tidak** otomatis. Setiap kali mengubah harga di `menu-data.js`,
jalankan perintah di atas, lalu pastikan perubahannya benar-benar live:
```bash
curl -sL https://argoloro.vercel.app/menu-data.js | grep "nama menu yang diubah"
```

### 2. Harga perlu dicocokkan ulang
Dibaca dari foto menu. Yang mencurigakan: `Nut Frappe 36K` diapit dua item `38K`.

### 3. Agenda
- Event **4 Juni 2026 sudah lewat** (hari ini 16 Agustus 2026). Masih tampil sesuai
  permintaan. Ubah `SHOW_PAST_EVENTS = false` di `script.js` untuk menyaring otomatis.
- Event kedua **tidak punya nama** — sementara tanggalnya jadi judul. Dugaan: ini juga
  "Coffee Beats" (lineup sama-sama DJ + akustik). Perlu konfirmasi.

### 4. Argo Vila
Masih tombol overlay "belum tersedia". Rekomendasi: buat halaman `/vila.html`
di project yang sama dulu, **jangan** project terpisah. Pisahkan nanti kalau
sudah terbukti perlu identitas sendiri.

### 5. Handle Instagram
Dipakai `argoloro_kopi` di semua tempat. Berkas asli sempat pakai `argolorokopi`.
Belum dikonfirmasi mana yang benar.

### 6. Logo
`brandmark` sudah dihapus atas permintaan. Kalau mau dipasang lagi, ada file
logo asli di menu cetak halaman 3 (wordmark "ARGO LORO / coffee & eatery"
dengan siluet orang membawa cangkir).

---

## Struktur berkas

```
index.html        beranda
menu.html         halaman menu
style.css         SEMUA gaya (beranda + menu jadi satu, disengaja)
script.js         beranda: status jam, agenda, lazy image, fasad peta
menu-data.js      >>> DATA MENU — edit di sini untuk ubah harga <<<
menu.js           menu: render, tab, chip, pencarian, scroll-spy
images/
  hero-1.jpg      dipakai (fallback + og:image)
  hero-2.jpg      sumber saja, tidak dirujuk (ada di .vercelignore)
  hero-3.jpg      sumber saja, tidak dirujuk (ada di .vercelignore)
  menuargolawu*.png  foto menu cetak (sumber data)
  opt/            18 varian AVIF/WebP hasil konversi
.vercelignore
.backup-before-redesign/   versi asli sebelum redesign + 2 gambar tak terpakai
```

---

## Cara membuat ulang varian gambar

Kalau foto diganti, jalankan ini (butuh `sips`, `avifenc`, `cwebp`):

```bash
TMP=$(mktemp -d)
gen() {
  src=$1; base=$2; shift 2
  for w in "$@"; do
    # PNG lossless sebagai perantara — JPEG->JPEG menambah artefak
    # dan hasilnya justru LEBIH BESAR dari aslinya
    sips -s format png --resampleWidth $w "images/$src" --out "$TMP/i.png" >/dev/null 2>&1
    avifenc -q 50 -s 6 "$TMP/i.png" "images/opt/${base}-${w}.avif" >/dev/null 2>&1
    cwebp -q 74 -m 6 -quiet "$TMP/i.png" -o "images/opt/${base}-${w}.webp"
  done
}
gen hero-1.jpg hero-1 640 800 960 1080
gen hero-2.jpg hero-2 640 960
gen hero-3.jpg hero-3 640 960 1280
rm -rf "$TMP"
```

Placeholder gradien hero disampel dari fotonya:
```bash
ffmpeg -v quiet -i images/hero-1.jpg -vf scale=1:6 -f rawvideo -pix_fmt rgb24 - \
  | od -An -tu1 -v | tr -s ' ' '\n' | grep -v '^$' | paste - - - \
  | awk '{printf "#%02X%02X%02X\n", $1,$2,$3}'
```

---

## Keputusan arsitektur (jangan diubah tanpa alasan baru)

**Tanpa framework.** React/Next menambah ±80–90 KB first-load JS = +1,8 detik di
400 Kbps, untuk halaman yang isinya daftar harga statis. Tidak ada state, tidak ada
backend, tidak ada routing dinamis. Build step juga jadi utang: dalam 2 tahun
`npm install` bisa gagal.
Pemicu untuk meninjau ulang: halaman tembus 5+, atau ada pesan online / keranjang.
Kalau saatnya tiba, pilih **Astro** (0 KB JS default), bukan Next.js.

**Satu project untuk semua halaman.** Domain sama = cache CSS & font berlaku.
Halaman kedua terasa instan.

**CSS digabung di `style.css`.** Menambah ±5 KB untuk pengunjung beranda, tapi
menghemat satu request penuh untuk pengunjung menu — dan mayoritas datang dari beranda.

**Palet dari foto, bukan tebakan.** Terracotta `#C9461F` dll. disampel dari pintu,
dinding, dan pakis di foto asli. Cocok dengan menu cetak.

**Tanpa foto per-item di menu.** 111 foto akan membatalkan seluruh kerja optimasi.

---

## Catatan kerja

- `bypassPermissions` sudah benar di `.claude/settings.json`, tapi sesi yang dimulai
  **sebelum** berkas itu ada tidak akan membacanya. Yang berlaku seketika:
  tekan `Shift+Tab` sampai mode berubah jadi *bypass permissions*.
- Project ini **adalah** git repo (`/Users/64664/argoloro`) tapi belum pernah di-commit.
  Belum ada remote GitHub.
- Server uji lokal: `python3 -m http.server 8934`
