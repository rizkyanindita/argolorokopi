---
description: Buat ulang varian AVIF/WebP di images/opt/ setelah foto hero diganti
---

Buat ulang varian gambar teroptimasi. Jalankan ini hanya kalau foto sumber di
`images/` memang berubah.

Prasyarat: `sips` (bawaan macOS), `avifenc`, `cwebp`. Cek dulu ketersediaannya
dengan `command -v avifenc cwebp` — kalau tidak ada, hentikan dan beri tahu
pengguna cara memasang (`brew install libavif webp`).

```bash
cd /Users/64664/argoloro
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

Setelah selesai, laporkan ukuran berkas hasilnya (`ls -lh images/opt/`) supaya
pengguna bisa menilai apakah kompresinya masuk akal. Foto pakis di project ini
mahal dikompresi — kalau hasilnya jauh lebih besar dari varian lama, sebutkan.

Kalau `hero-1.jpg` yang diganti, placeholder gradien hero di `style.css` juga
perlu disampel ulang:

```bash
ffmpeg -v quiet -i images/hero-1.jpg -vf scale=1:6 -f rawvideo -pix_fmt rgb24 - \
  | od -An -tu1 -v | tr -s ' ' '\n' | grep -v '^$' | paste - - - \
  | awk '{printf "#%02X%02X%02X\n", $1,$2,$3}'
```

$ARGUMENTS
