# Argo Loro — panduan kerja

Microsite link-bio Instagram untuk **Argo Loro — coffee & eatery**, Selo, Boyolali.

Status pekerjaan lengkap, angka performa, dan daftar tugas ada di:

@HANDOFF.md

---

## Batasan keras — jangan dilanggar tanpa alasan baru

**Situs statis murni: HTML + CSS + JS vanilla. Tanpa framework, tanpa build step.**
Ini keputusan sadar, bukan kelalaian. React/Next menambah ±80–90 KB first-load JS
= +1,8 detik di jaringan 400 Kbps, untuk halaman yang isinya daftar harga statis.
Jangan usulkan framework, bundler, TypeScript, atau `npm install` apa pun.

Pemicu untuk meninjau ulang: halaman tembus 5+, atau ada pesan online / keranjang.
Kalau saatnya tiba, pilih **Astro** (0 KB JS default) — bukan Next.js.

**Turunan dari batasan itu:**
- Semua CSS di `style.css` (beranda + menu jadi satu berkas, disengaja —
  menghemat satu request penuh untuk pengunjung menu)
- Satu project Vercel untuk semua halaman, supaya cache CSS & font berlaku lintas halaman
- Tanpa foto per-item di menu — 111 foto akan membatalkan seluruh kerja optimasi

## Peta berkas — edit di tempat yang benar

| Mau ubah | Edit berkas |
|---|---|
| Harga / nama / kategori menu | `menu-data.js` — **hanya di sini** |
| Agenda & jam buka | `script.js` (`FEATURED_EVENT`, `EVENTS`, `SHOW_PAST_EVENTS`) |
| Tampilan (beranda **dan** menu) | `style.css` |
| Perilaku halaman menu | `menu.js` (render, tab, chip, pencarian, scroll-spy) |

`menu-data.js` berisi `var MENU = [...]` — array kategori, tiap kategori punya
`id` / `nama` / `catatan` / `grup` (`"minuman"` \| `"makanan"`) / `items`.
Tiap item: `n` (nama) dan `h` (harga rupiah penuh, mis. `28000` → tampil `28K`).

## Menguji

Tidak ada test runner. Verifikasi = buka di browser.

```bash
cd /Users/64664/argoloro && python3 -m http.server 8934
# http://localhost:8934/menu.html
```

Karena tidak ada build step, **tidak ada yang menangkap syntax error** selain
browser. Setelah mengubah berkas `.js`, jalankan `node --check <berkas>`.
Satu koma salah di `menu-data.js` = halaman menu kosong total.

## Gambar

Foto pakis **mahal dikompresi** (ribuan helai kecil berkontras tinggi) — format
saja tidak cukup, ukuran piksel yang menentukan. Varian ada di `images/opt/`.
Perantara harus PNG lossless: JPEG→JPEG menambah artefak *dan* hasilnya lebih besar.
Skrip regenerasi lengkap ada di HANDOFF.md bagian "Cara membuat ulang varian gambar".

## Yang sedang menghambat

1. **Deploy terkunci** — `ssoProtection: enabled` di https://argoloro.vercel.app,
   semua request 302 ke login Vercel. Pengunjung Instagram belum bisa membuka.
2. **4 fitur halaman menu belum pernah diuji di browser** — perbaikan bug blink pada
   chip, tab Minuman/Makanan, pencarian, panel semua kategori.

## Bahasa

Tulis dokumentasi, komentar kode, dan balasan dalam **Bahasa Indonesia** —
seluruh berkas project ini sudah konsisten begitu.
