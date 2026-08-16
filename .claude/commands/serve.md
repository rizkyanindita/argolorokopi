---
description: Jalankan server uji lokal di port 8934 dan pastikan halaman merespons
---

Jalankan server uji lokal untuk project ini dan pastikan benar-benar hidup.

1. Kalau port 8934 sudah dipakai, matikan dulu prosesnya:
   `lsof -ti:8934 -sTCP:LISTEN | xargs -r kill`
2. Jalankan `python3 -m http.server 8934` di latar belakang dari `/Users/64664/argoloro`.
3. Verifikasi dengan `curl -s -o /dev/null -w "%{http_code}"` untuk `/index.html`
   **dan** `/menu.html` — keduanya harus `200`. Jangan lapor berhasil sebelum
   kode status terlihat.
4. Sebutkan URL-nya ke pengguna:
   - http://localhost:8934/
   - http://localhost:8934/menu.html

Ingat dari HANDOFF.md: empat fitur halaman menu (perbaikan bug blink pada chip,
tab Minuman/Makanan, pencarian, panel semua kategori) belum pernah diverifikasi
di browser. Kalau pengguna belum menyebut tugas lain, tawarkan untuk menguji itu.

$ARGUMENTS
