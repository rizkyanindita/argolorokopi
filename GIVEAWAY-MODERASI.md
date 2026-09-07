# Cara Approve Foto Giveaway

Panduan ini untuk tim socmed — tidak perlu bisa coding untuk melakukan ini.

## Langkah-langkah

1. Buka **supabase.com** di browser, login pakai akun yang sudah dikasih akses
   (minta invite ke admin kalau belum punya).
2. Pilih project **Argo Loro**.
3. Di menu sebelah kiri, klik **Table Editor**.
4. Pilih tabel **giveaway_entries**.
5. Kamu akan lihat daftar semua orang yang daftar giveaway, dengan kolom:
   - `nama` — nama peserta
   - `nomor_wa` — nomor WhatsApp (buat dihubungi kalau menang, jangan disebar)
   - `instagram_username` — username IG peserta
   - `foto_url` — klik untuk buka fotonya di tab baru dan cek isinya
   - `status` — ini yang perlu diubah
6. Cek foto tiap peserta (klik link di `foto_url`). Kalau fotonya pantas dan
   sesuai syarat giveaway:
   - Klik dua kali di cell kolom **status** pada baris itu
   - Ganti tulisan `pending` jadi `approved`, tekan Enter
   - Foto itu otomatis langsung muncul di halaman galeri publik
     (argoloro.vercel.app/giveaway/galeri) — tidak perlu deploy apa-apa.
7. Kalau fotonya tidak pantas / tidak sesuai syarat:
   - Ganti `status` jadi `rejected`
   - Foto itu tidak akan pernah muncul di galeri publik

## Penting

- **Nomor WhatsApp peserta tidak pernah muncul di halaman publik**, siapa pun
  yang statusnya approved sekalipun. Kolom itu cuma kelihatan di sini, di
  dashboard Supabase, oleh tim yang login. Aman dipakai untuk hubungi pemenang.
- Status default semua entry baru adalah `pending` — foto baru **tidak akan**
  tampil di galeri sampai ada yang mengubahnya jadi `approved`. Jadi cek
  halaman ini secara berkala, terutama menjelang tanggal pengumuman.
- Kalau salah approve, tinggal ganti lagi statusnya — perubahan langsung
  berlaku, tidak ada proses tambahan.
- Boleh urutkan/filter tabel lewat dashboard (klik ikon filter di atas kolom)
  buat lihat yang `pending` saja dulu, biar tidak bolak-balik cek yang sudah
  diproses.
