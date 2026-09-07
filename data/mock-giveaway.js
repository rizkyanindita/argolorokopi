/* ============================================================
   DATA DUMMY MOCKUP GIVEAWAY — satu-satunya berkas yang perlu
   diedit untuk mengganti isi ketiga halaman /preview/.

   INI DATA PALSU. Tidak ada backend, tidak ada database, tidak ada
   upload sungguhan. Semua perubahan status/kategori di halaman
   kurasi hanya hidup di memori browser dan hilang saat halaman
   dimuat ulang — memang begitu maunya, ini alat peraga.

   Pola berkas ini sama dengan menu-data.js (var + array objek),
   supaya orang yang sudah pernah mengedit menu langsung paham.

   Path foto sengaja ABSOLUT dari root ("/preview/mock-photos/…"),
   bukan relatif, karena berkas ini dipakai tiga halaman yang
   kedalaman foldernya berbeda-beda.
   ============================================================ */

/* Info hadiah & tanggal untuk halaman form. */
var MOCK_INFO = {
  judul: "Giveaway Argo Loro",
  hadiahNominal: "Rp200.000",
  hadiahDetail: "Voucher makan gratis · 3 pemenang",
  deadline: "2026-09-30",
  pengumuman: "2026-10-03",
  instagram: "argoloro_kopi"
};

/* Tiap entry:
     id                  string unik
     nama                nama peserta
     instagram_username  tanpa "@"
     foto_url            path foto
     tanggal             "YYYY-MM-DD", tanggal foto masuk
     orientasi           "portrait" | "landscape"
     status              "pending" | "approved" | "rejected"
     kategori            "view" | "menu" | "suasana" | "momen"
     sudah_dipakai       true kalau sudah pernah di-repost              */
var MOCK_ENTRIES = [
  { id: "e01", nama: "Rizky Anindita",   instagram_username: "rizky.anindita",  foto_url: "/preview/mock-photos/p01.webp", tanggal: "2026-09-06", orientasi: "portrait",  status: "approved", kategori: "view",    sudah_dipakai: true  },
  { id: "e02", nama: "Dwi Lestari",      instagram_username: "dwilestari_",     foto_url: "/preview/mock-photos/l01.webp", tanggal: "2026-09-06", orientasi: "landscape", status: "approved", kategori: "view",    sudah_dipakai: false },
  { id: "e03", nama: "Bagas Pratama",    instagram_username: "bagaspratama",    foto_url: "/preview/mock-photos/p02.webp", tanggal: "2026-09-05", orientasi: "portrait",  status: "pending",  kategori: "momen",   sudah_dipakai: false },
  { id: "e04", nama: "Nadia Rahmawati",  instagram_username: "nadiarahma",      foto_url: "/preview/mock-photos/l02.webp", tanggal: "2026-09-05", orientasi: "landscape", status: "approved", kategori: "suasana", sudah_dipakai: false },
  { id: "e05", nama: "Fajar Nugroho",    instagram_username: "fajar.ngopi",     foto_url: "/preview/mock-photos/p03.webp", tanggal: "2026-09-05", orientasi: "portrait",  status: "approved", kategori: "menu",    sudah_dipakai: true  },
  { id: "e06", nama: "Sinta Maharani",   instagram_username: "sintamhrni",      foto_url: "/preview/mock-photos/l03.webp", tanggal: "2026-09-04", orientasi: "landscape", status: "pending",  kategori: "view",    sudah_dipakai: false },
  { id: "e07", nama: "Yoga Saputra",     instagram_username: "yogasptra",       foto_url: "/preview/mock-photos/p04.webp", tanggal: "2026-09-04", orientasi: "portrait",  status: "approved", kategori: "momen",   sudah_dipakai: false },
  { id: "e08", nama: "Alya Kusuma",      instagram_username: "alyakusuma.id",   foto_url: "/preview/mock-photos/l04.webp", tanggal: "2026-09-04", orientasi: "landscape", status: "approved", kategori: "suasana", sudah_dipakai: false },
  { id: "e09", nama: "Rendra Wijaya",    instagram_username: "rendrawijaya",    foto_url: "/preview/mock-photos/p05.webp", tanggal: "2026-09-03", orientasi: "portrait",  status: "rejected", kategori: "momen",   sudah_dipakai: false },
  { id: "e10", nama: "Putri Andini",     instagram_username: "putriandini",     foto_url: "/preview/mock-photos/l05.webp", tanggal: "2026-09-03", orientasi: "landscape", status: "approved", kategori: "view",    sudah_dipakai: true  },
  { id: "e11", nama: "Ilham Ramadhan",   instagram_username: "ilhamrmdhn",      foto_url: "/preview/mock-photos/p06.webp", tanggal: "2026-09-03", orientasi: "portrait",  status: "approved", kategori: "menu",    sudah_dipakai: false },
  { id: "e12", nama: "Kirana Dewi",      instagram_username: "kiranadewi_",     foto_url: "/preview/mock-photos/l06.webp", tanggal: "2026-09-02", orientasi: "landscape", status: "pending",  kategori: "suasana", sudah_dipakai: false },
  { id: "e13", nama: "Arif Setiawan",    instagram_username: "arifsetia",       foto_url: "/preview/mock-photos/p07.webp", tanggal: "2026-09-02", orientasi: "portrait",  status: "approved", kategori: "view",    sudah_dipakai: false },
  { id: "e14", nama: "Melati Cahyani",   instagram_username: "melaticahyani",   foto_url: "/preview/mock-photos/l07.webp", tanggal: "2026-09-02", orientasi: "landscape", status: "approved", kategori: "menu",    sudah_dipakai: false },
  { id: "e15", nama: "Galih Prakoso",    instagram_username: "galihprakoso",    foto_url: "/preview/mock-photos/p08.webp", tanggal: "2026-09-01", orientasi: "portrait",  status: "pending",  kategori: "view",    sudah_dipakai: false },
  { id: "e16", nama: "Ayu Wulandari",    instagram_username: "ayuwulan.d",      foto_url: "/preview/mock-photos/l08.webp", tanggal: "2026-09-01", orientasi: "landscape", status: "approved", kategori: "suasana", sudah_dipakai: false },
  { id: "e17", nama: "Bayu Anggara",     instagram_username: "bayuanggara",     foto_url: "/preview/mock-photos/p09.webp", tanggal: "2026-08-31", orientasi: "portrait",  status: "approved", kategori: "momen",   sudah_dipakai: false },
  { id: "e18", nama: "Intan Permata",    instagram_username: "intanpermata",    foto_url: "/preview/mock-photos/l09.webp", tanggal: "2026-08-31", orientasi: "landscape", status: "rejected", kategori: "momen",   sudah_dipakai: false },
  { id: "e19", nama: "Danu Kurniawan",   instagram_username: "danukurnia",      foto_url: "/preview/mock-photos/p10.webp", tanggal: "2026-08-30", orientasi: "portrait",  status: "approved", kategori: "menu",    sudah_dipakai: false },
  { id: "e20", nama: "Sekar Ayu",        instagram_username: "sekarayu.id",     foto_url: "/preview/mock-photos/p11.webp", tanggal: "2026-08-30", orientasi: "portrait",  status: "pending",  kategori: "suasana", sudah_dipakai: false }
];

/* Label kategori yang tampil di layar. Tambah kategori = tambah satu
   baris di sini, tombol filter & tag di halaman kurasi ikut otomatis. */
var MOCK_KATEGORI = [
  { id: "view",    label: "View" },
  { id: "menu",    label: "Menu" },
  { id: "suasana", label: "Suasana" },
  { id: "momen",   label: "Momen" }
];
