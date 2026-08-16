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
