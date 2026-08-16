/* ============================================================
   DATA MENU ARGO LORO — ubah di berkas ini saja
   ============================================================

   Urutan kategori di array ini = urutan tampil di halaman,
   dan juga urutan chip navigasinya.

   Format kategori:
     id     dipakai untuk anchor & chip. Huruf kecil, tanpa spasi,
            harus unik.
     nama   judul yang tampil.
     catatan keterangan kecil di samping judul, mis. "Ice / Hot".
            Kosongkan ("") kalau tidak perlu.
     grup   "minuman" | "makanan" — menentukan tab atas.
     items  daftar isinya.

   Format item:
     n      nama menu.
     h      harga dalam rupiah penuh (28000, bukan 28).
            Ditampilkan otomatis jadi "28K".
     fav    true kalau item bertanda logo cangkir di menu cetak.
            Muncul sebagai lencana "Favorit". Hapus kalau bukan.
     ket    keterangan kecil miring di samping nama. Opsional.

   Menambah item : tambahkan satu baris { n: "...", h: ... }
   Ubah harga    : ubah angka h saja.
   Pindah grup   : ubah nilai grup.
   ============================================================ */

/* ============================================================
   SINONIM PENCARIAN
   ============================================================
   Nama menu di sini berbahasa Inggris, tapi pengunjungnya orang
   Indonesia. Tanpa tabel ini, mengetik "kopi" hanya menemukan
   1 item (Kopi Tubruk) dari 22 minuman berbasis kopi.

   Cara kerja: kalau salah satu kata di `cocok` muncul sebagai
   KATA UTUH pada nama item ATAU nama kategorinya, seluruh kata di
   `kata` ditempelkan ke teks pencarian — tidak terlihat di layar.

   `kecuali` (opsional): kalau frasa ini ada, aturan dilewati.
   Dipakai untuk frasa yang membalik makna, seperti "Non Coffee"
   yang mengandung kata "coffee" tapi justru berarti bukan kopi.

   PENTING: pencocokan memakai batas kata, bukan potongan teks.
   Dulu memakai potongan, dan "Platter" (p-LATTE-r) membuat makanan
   pembuka ikut dianggap kopi. Jangan kembalikan ke indexOf biasa.

   Menambah sinonim: tambahkan satu baris. Tidak perlu ubah kode.
   ============================================================ */

var SINONIM = [
  /* --- minuman --- */
  { cocok: ["coffee", "espresso", "latte", "cappucino", "mocha", "machiato",
            "affogato", "manual brewing", "tubruk", "v60", "vietnamdrip",
            "black series", "long black"],
    kecuali: ["non coffee"], kata: "kopi coffee" },
  // Dipisah: "susu" saja tidak boleh membuat sesuatu jadi kopi —
  // kalau digabung, Susu Jahe ikut muncul saat mencari "kopi".
  { cocok: ["latte", "cappucino"],
    kecuali: ["non coffee"], kata: "kopi susu milk" },
  { cocok: ["susu", "milk"], kata: "susu milk" },
  { cocok: ["tea", "teh"], kata: "teh tea" },
  { cocok: ["juice"], kata: "jus juice" },
  { cocok: ["smoothie", "frappe", "blend", "ice", "mojito", "mocktail"],
    kata: "es dingin cold iced" },
  { cocok: ["hot", "wedang", "jahe", "bandrek", "uwuh"],
    kata: "panas hangat wedangan" },
  { cocok: ["chocolate", "choco", "mocha", "nuttela", "biscoff", "oreo"],
    kata: "cokelat coklat" },
  { cocok: ["jahe"], kata: "ginger" },
  { cocok: ["matcha"], kata: "teh hijau green tea" },
  { cocok: ["taro"], kata: "talas" },
  { cocok: ["red velvet"], kata: "merah" },
  { cocok: ["peanut", "nut", "hazzelnut", "nuttela"], kata: "kacang" },
  { cocok: ["caramel", "butterscotch"], kata: "karamel manis" },
  { cocok: ["vanilla"], kata: "vanila" },

  /* --- buah --- */
  { cocok: ["strawberry"], kata: "stroberi strawberi buah" },
  { cocok: ["avocado"], kata: "alpukat buah" },
  { cocok: ["orange"], kata: "jeruk buah" },
  { cocok: ["watermelon"], kata: "semangka buah" },
  { cocok: ["melon"], kata: "buah" },
  { cocok: ["banana"], kata: "pisang buah" },
  { cocok: ["lychee"], kata: "leci buah" },
  { cocok: ["lemon", "lime", "lemonade"], kata: "jeruk asam" },
  { cocok: ["peach"], kata: "persik buah" },
  { cocok: ["fruit punch", "berry"], kata: "buah" },

  /* --- makanan --- */
  { cocok: ["chicken", "ayam", "karage", "katsu", "geprek"], kata: "ayam chicken" },
  { cocok: ["beef", "iga", "gyudon", "buntut", "sapi"], kata: "sapi daging beef" },
  { cocok: ["fish", "ikan"], kata: "ikan fish" },
  { cocok: ["udang", "ebi"], kata: "udang seafood" },
  { cocok: ["cumi", "seafood"], kata: "seafood laut" },
  { cocok: ["rice bowl", "nasi"], kata: "nasi rice" },
  { cocok: ["mie", "noodle"], kata: "mie mi noodle" },
  { cocok: ["pasta", "aglio", "bolognese", "carbonara"], kata: "pasta mie italia" },
  { cocok: ["pizza"], kata: "pizza" },
  { cocok: ["cheese", "keju"], kata: "keju cheese" },
  { cocok: ["sambal", "geprek", "lada", "tomyum"], kata: "pedas spicy" },
  { cocok: ["french fries", "potato"], kata: "kentang potato" },
  { cocok: ["starter", "tempe", "tahu", "singkong", "otak-otak", "risol",
            "enoki", "onion", "platter"], kata: "camilan snack gorengan pembuka" },
  { cocok: ["dimsum", "siomay", "lumpia", "ekado", "furai"], kata: "dimsum" },
  { cocok: ["soup"], kata: "sup soto kuah berkuah" },
  { cocok: ["ice cream", "banana split"], kata: "es krim dessert manis pencuci mulut" },
  { cocok: ["mushroom"], kata: "jamur" },
  { cocok: ["pepperoni"], kata: "sosis daging" },
  { cocok: ["egg"], kata: "telur" },
  { cocok: ["special menu"], kata: "utama berat main course" }
];

var MENU = [

  /* ==================== MINUMAN ==================== */

  {
    id: "kopi", nama: "Coffee", catatan: "Ice / Hot", grup: "minuman",
    items: [
      { n: "Espresso", h: 17000 },
      { n: "Cappucino", h: 28000 },
      { n: "Café Latte", h: 28000 },
      { n: "Affogato", h: 28000 },
      { n: "Mont Blanc", h: 28000, fav: true },
      { n: "Caramel Latte", h: 30000 },
      { n: "Hazzelnut Latte", h: 30000 },
      { n: "Vanilla Latte", h: 30000 },
      { n: "Caffe Mocha", h: 30000 },
      { n: "Caramel Machiato", h: 30000 },
      { n: "Banana Latte", h: 32000, fav: true },
      { n: "Dirty Latte", h: 32000, fav: true },
      { n: "Butterscotch Latte", h: 35000, fav: true },
      { n: "Peanut Latte", h: 37000, fav: true }
    ]
  },
  {
    id: "nonkopi", nama: "Non Coffee", catatan: "Hot / Ice", grup: "minuman",
    items: [
      { n: "Red Velvet", h: 29000 },
      { n: "Taro", h: 29000 },
      { n: "Chocolate", h: 29000, fav: true },
      { n: "Matcha", h: 45000, fav: true, ket: "Suiho Ceremonial" }
    ]
  },
  {
    id: "mocktails", nama: "Mocktails", catatan: "", grup: "minuman",
    items: [
      { n: "Lemonade Coffee", h: 26000 },
      { n: "Lime Mojito", h: 26000 },
      { n: "Strawberry Mojito", h: 28000, fav: true },
      { n: "Strawberry Blue Mojito", h: 28000 },
      { n: "Blue Lime Mojito", h: 28000, fav: true }
    ]
  },
  {
    id: "manual", nama: "Manual Brewing", catatan: "", grup: "minuman",
    items: [
      { n: "Vietnamdrip Coffee", h: 25000, fav: true },
      { n: "Kopi Tubruk", h: 28000 },
      { n: "V60", h: 32000, fav: true }
    ]
  },
  {
    id: "black", nama: "Black Series", catatan: "", grup: "minuman",
    items: [
      { n: "Long Black", h: 26000 },
      { n: "Black Lychee", h: 27000 },
      { n: "Black Strawberry", h: 27000 },
      { n: "Black Peach", h: 27000, fav: true },
      { n: "Black Lemon", h: 27000, fav: true }
    ]
  },
  {
    id: "teh", nama: "Tea", catatan: "Hot / Ice", grup: "minuman",
    items: [
      { n: "Clasic Tea", h: 18000 },
      { n: "Strawberry Tea", h: 25000, fav: true },
      { n: "Lychee Tea", h: 25000, fav: true },
      { n: "Lemon Tea", h: 25000 },
      { n: "Peach Tea", h: 25000 },
      { n: "Teh Tarik Penang", h: 25000 }
    ]
  },
  {
    id: "signature", nama: "Signature", catatan: "", grup: "minuman",
    items: [
      { n: "Argo Fruit Punch", h: 26000 },
      { n: "Argo Brown Latte", h: 28000, fav: true },
      { n: "Berry Coffee Breez", h: 28000 },
      { n: "Argo Biscoff (Blend)", h: 35000 }
    ]
  },
  {
    id: "wedangan", nama: "Wedangan", catatan: "", grup: "minuman",
    items: [
      { n: "Wedang Jahe", h: 25000 },
      { n: "Wedang Uwuh", h: 25000, fav: true },
      { n: "Wedang Bandrek Selo", h: 25000 },
      { n: "Susu Jahe", h: 25000, fav: true }
    ]
  },
  {
    id: "juice", nama: "Juice & Smoothies", catatan: "", grup: "minuman",
    items: [
      { n: "Orange Juice", h: 26000, fav: true },
      { n: "Melon Juice", h: 26000 },
      { n: "Watermelon", h: 26000, fav: true },
      { n: "Strawberry Juice", h: 26000 },
      { n: "Avocado Juice", h: 28000 },
      { n: "Banana Smoothie", h: 28000, fav: true },
      { n: "Strawberry Smoothie", h: 32000, fav: true },
      { n: "Avocado Choco", h: 35000 }
    ]
  },
  {
    id: "frappe", nama: "Blend & Frappe", catatan: "", grup: "minuman",
    items: [
      { n: "Cookies & Cream Frappe", h: 35000, fav: true },
      { n: "Red Velvet (Blend)", h: 35000 },
      { n: "Taro (Blend)", h: 35000 },
      { n: "Nuttela Frappe", h: 35000, fav: true },
      { n: "Nut Frappe", h: 36000 },
      { n: "Salted Caramel Frappe", h: 38000, fav: true },
      { n: "Nut Choco Frappe", h: 38000 },
      { n: "Caramel Choco Frappe", h: 38000, fav: true }
    ]
  },
  {
    id: "icecream", nama: "Ice Cream", catatan: "", grup: "minuman",
    items: [
      { n: "Biscoff Vanilla Ice Cream", h: 20000 },
      { n: "Choco Oreo Ice Cream", h: 20000, fav: true },
      { n: "Banana Split", h: 25000 }
    ]
  },

  /* ==================== MAKANAN ==================== */

  {
    id: "starter", nama: "Starter", catatan: "", grup: "makanan",
    items: [
      { n: "Tempe Mendoan", h: 18000 },
      { n: "Otak-Otak", h: 18000 },
      { n: "French Fries", h: 18000 },
      { n: "Potato Wedges", h: 18000 },
      { n: "Tahu Walik Merbabu", h: 20000, fav: true },
      { n: "Singkong Crispy", h: 24000, fav: true },
      { n: "Risol Mayo", h: 26000 },
      { n: "Enoki Cruncy", h: 26000, fav: true },
      { n: "Pisang Lumer", h: 26000 },
      { n: "Onion Ring", h: 28000 },
      { n: "Banana Fritter", h: 30000, fav: true },
      { n: "Mix Platter", h: 36000, fav: true },
      { n: "Enoki Beef Rool", h: 38000 },
      { n: "Selo Platter", h: 40000, fav: true },
      { n: "Fish and Chips", h: 55000 }
    ]
  },
  {
    id: "special", nama: "Special Menu", catatan: "Belum termasuk nasi", grup: "makanan",
    items: [
      { n: "Ayam Goreng Sambal Hijau", h: 32000, fav: true },
      { n: "Ayam Goreng Lengkuas", h: 32000 },
      { n: "Soup Tomyum", h: 50000 },
      { n: "Iga Sapi Lada Hitam", h: 50000 },
      { n: "Soup Iga Gunung", h: 55000, fav: true },
      { n: "Soup Buntut", h: 60000, fav: true }
    ]
  },
  {
    id: "dimsum", nama: "Dimsum", catatan: "", grup: "makanan",
    items: [
      { n: "Ebi Furai", h: 26000 },
      { n: "Ekado", h: 26000 },
      { n: "Siomay", h: 28000, fav: true },
      { n: "Lumpia Udang", h: 28000, fav: true },
      { n: "Mix Dimsum", h: 28000, fav: true }
    ]
  },
  {
    id: "ricebowl", nama: "Rice Bowl", catatan: "", grup: "makanan",
    items: [
      { n: "Chicken Katsu Teriyaki", h: 32000, fav: true },
      { n: "Chicken Salted Egg", h: 32000 },
      { n: "Cumi Lada Garam", h: 32000 },
      { n: "Ayam Sambal Matah", h: 32000, fav: true },
      { n: "Chicken Karage", h: 35000 },
      { n: "Gyudon", h: 40000 }
    ]
  },
  {
    id: "mie", nama: "Mie", catatan: "", grup: "makanan",
    items: [
      { n: "Mie Goreng Original", h: 26000 },
      { n: "Mie Goreng Geprek", h: 28000, fav: true },
      { n: "Mie Kuah Ayam Bawang", h: 28000 },
      { n: "Mie Kuah Tomyum", h: 30000 },
      { n: "Mie Goreng Bangladesh", h: 36000, fav: true },
      { n: "Mie Kuah Keju", h: 38000, fav: true }
    ]
  },
  {
    id: "pasta", nama: "Pasta", catatan: "", grup: "makanan",
    items: [
      { n: "Pasta Aglio Olio", h: 38000, fav: true },
      { n: "Pasta Bolognese", h: 38000 },
      { n: "Pasta Carbonara", h: 38000, fav: true }
    ]
  },
  {
    id: "nasigoreng", nama: "Nasi Goreng", catatan: "", grup: "makanan",
    items: [
      { n: "Nasi Goreng Jawa", h: 32000, fav: true },
      { n: "Nasi Goreng Hongkong", h: 32000 },
      { n: "Nasi Goreng Seafood", h: 36000, fav: true }
    ]
  },
  {
    id: "pizza", nama: "Home Made Pizza", catatan: "", grup: "makanan",
    items: [
      { n: "Pepperoni Pizza", h: 55000, fav: true },
      { n: "Mushroom Pizza", h: 55000, fav: true },
      { n: "Lava Cheese Pizza", h: 60000, fav: true }
    ]
  }
];
