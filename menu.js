(function () {
  "use strict";

  var mount = document.getElementById("menuMount");
  var chipsScroll = document.getElementById("chipsScroll");
  if (!mount || !chipsScroll || typeof MENU === "undefined") return;

  var nav = document.getElementById("menunav");
  var segmented = document.getElementById("segmented");
  var searchInput = document.getElementById("menuSearch");
  var searchClear = document.getElementById("searchClear");
  var searchStatus = document.getElementById("searchStatus");
  var emptyState = document.getElementById("menuEmpty");
  var catSheet = document.getElementById("catSheet");
  var catSheetBody = document.getElementById("catSheetBody");

  var grupAktif = "minuman";
  var query = "";
  var chips = {};
  var sections = {};

  // 28000 -> "28K". Sama dengan gaya menu cetak, jadi tamu yang sudah
  // melihat menu fisik langsung mengenali angkanya.
  function harga(n) { return Math.round(n / 1000) + "K"; }

  function el(tag, cls, txt) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (txt) node.textContent = txt;
    return node;
  }

  function norm(s) { return (s || "").toLowerCase().trim(); }

  // Tinggi blok navigasi diukur dari DOM, bukan ditulis tetap di CSS.
  // Kalau nanti ada baris baru ditambahkan, offsetnya ikut sendiri.
  function navH() { return nav ? nav.getBoundingClientRect().height : 0; }

  /* ================= Render ================= */
  MENU.forEach(function (kat) {
    var sec = el("section", "menu-kat");
    sec.id = "kat-" + kat.id;
    sec.setAttribute("data-grup", kat.grup);

    var head = el("div", "menu-kat-head");
    head.appendChild(el("h3", null, kat.nama));
    if (kat.catatan) head.appendChild(el("span", "menu-kat-note", kat.catatan));
    sec.appendChild(head);

    var list = el("ul", "menu-list");

    kat.items.forEach(function (item) {
      var li = el("li", "menu-item");
      li.setAttribute("data-cari", norm(item.n + " " + kat.nama + " " + (item.ket || "")));

      var kiri = el("span", "menu-item-name");
      kiri.appendChild(document.createTextNode(item.n));
      if (item.ket) kiri.appendChild(el("small", "menu-item-ket", item.ket));
      if (item.fav) kiri.appendChild(el("span", "menu-fav", "Favorit"));

      li.appendChild(kiri);
      li.appendChild(el("span", "menu-dot"));
      li.appendChild(el("span", "menu-item-price", harga(item.h)));
      list.appendChild(li);
    });

    sec.appendChild(list);
    mount.appendChild(sec);
    sections[kat.id] = sec;
  });

  /* ================= Chip & panel kategori ================= */
  MENU.forEach(function (kat) {
    var a = el("button", "chip", kat.nama);
    a.type = "button";
    a.setAttribute("data-kat", kat.id);
    a.setAttribute("data-grup", kat.grup);
    chipsScroll.appendChild(a);
    chips[kat.id] = a;

    var b = el("button", "catsheet-item", kat.nama);
    b.type = "button";
    b.setAttribute("data-kat", kat.id);
    b.appendChild(el("span", "catsheet-count", String(kat.items.length)));
    catSheetBody.appendChild(b);
  });

  document.getElementById("countMinuman").textContent =
    MENU.filter(function (k) { return k.grup === "minuman"; })
        .reduce(function (a, k) { return a + k.items.length; }, 0);
  document.getElementById("countMakanan").textContent =
    MENU.filter(function (k) { return k.grup === "makanan"; })
        .reduce(function (a, k) { return a + k.items.length; }, 0);

  /* ================= State ================= */
  function terapkan() {
    var q = norm(query);
    var cocok = 0;

    MENU.forEach(function (kat) {
      var sec = sections[kat.id];
      var tampilKat = 0;

      Array.prototype.forEach.call(sec.querySelectorAll(".menu-item"), function (li) {
        var ok = !q || li.getAttribute("data-cari").indexOf(q) !== -1;
        li.hidden = !ok;
        if (ok) tampilKat++;
      });

      // Saat mencari, batas grup diabaikan — orang mengetik "pizza"
      // tanpa peduli itu masuk minuman atau makanan.
      var dalamGrup = q ? true : kat.grup === grupAktif;
      sec.hidden = !dalamGrup || tampilKat === 0;
      if (!sec.hidden) cocok += tampilKat;

      if (chips[kat.id]) {
        chips[kat.id].hidden = q ? true : kat.grup !== grupAktif;
      }
    });

    if (q) {
      searchStatus.hidden = false;
      searchStatus.textContent = cocok + " menu cocok dengan “" + query.trim() + "”";
    } else {
      searchStatus.hidden = true;
    }

    emptyState.hidden = cocok !== 0;
    searchClear.hidden = !q;
    if (nav) nav.classList.toggle("is-searching", !!q);

    if (!q) sorotPertama();
  }

  function setAktif(id) {
    Object.keys(chips).forEach(function (k) {
      chips[k].classList.toggle("is-active", k === id);
    });

    var a = chips[id];
    if (!a || a.hidden) return;

    // Geser baris chip agar yang aktif terlihat. Dihitung manual —
    // scrollIntoView akan ikut menggulung halaman.
    var target = a.offsetLeft - (chipsScroll.clientWidth / 2) + (a.offsetWidth / 2);
    chipsScroll.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }

  function sorotPertama() {
    var pertama = MENU.filter(function (k) { return k.grup === grupAktif; })[0];
    if (pertama) setAktif(pertama.id);
  }

  /* ================= Scroll-spy =================
     KUNCI PENTING: selama scroll hasil klik chip masih berjalan,
     observer diabaikan. Tanpa ini, halaman melintasi setiap kategori
     di antaranya dan chip aktif berkedip melewati semuanya. */
  var terkunci = false;
  var timerLepas = null;
  var timerDiam = null;

  function kunci() {
    terkunci = true;
    window.clearTimeout(timerLepas);
    timerLepas = window.setTimeout(function () { terkunci = false; }, 1200);
  }

  window.addEventListener("scroll", function () {
    if (!terkunci) return;
    // Scroll dianggap selesai kalau 120ms tidak ada gerakan lagi.
    window.clearTimeout(timerDiam);
    timerDiam = window.setTimeout(function () {
      terkunci = false;
      window.clearTimeout(timerLepas);
    }, 120);
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    var terlihat = {};
    var urutan = MENU.map(function (k) { return "kat-" + k.id; });

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) { terlihat[e.target.id] = e.isIntersecting; });
        if (terkunci || query) return;

        for (var i = 0; i < urutan.length; i++) {
          if (terlihat[urutan[i]] && !sections[urutan[i].replace("kat-", "")].hidden) {
            setAktif(urutan[i].replace("kat-", ""));
            break;
          }
        }
      },
      { rootMargin: "-" + (navH() + 8) + "px 0px -55% 0px", threshold: 0 }
    );

    Object.keys(sections).forEach(function (k) { spy.observe(sections[k]); });
  }

  function lompatKe(id) {
    var sec = sections[id];
    if (!sec || sec.hidden) return;
    kunci();
    setAktif(id);
    var atas = sec.getBoundingClientRect().top + window.pageYOffset - navH() - 4;
    window.scrollTo({ top: Math.max(0, atas), behavior: "smooth" });
  }

  /* ================= Interaksi ================= */
  chipsScroll.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".chip");
    if (a) lompatKe(a.getAttribute("data-kat"));
  });

  segmented.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".seg");
    if (!b) return;

    grupAktif = b.getAttribute("data-grup");
    Array.prototype.forEach.call(segmented.querySelectorAll(".seg"), function (s) {
      var on = s === b;
      s.classList.toggle("is-active", on);
      s.setAttribute("aria-selected", on ? "true" : "false");
    });

    // Ganti grup selalu kembali ke atas daftar — tanpa ini pengunjung
    // mendarat di tengah kategori yang baru saja disembunyikan.
    kunci();
    terapkan();
    chipsScroll.scrollTo({ left: 0, behavior: "auto" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  var timerCari = null;
  searchInput.addEventListener("input", function () {
    window.clearTimeout(timerCari);
    timerCari = window.setTimeout(function () {
      query = searchInput.value;
      terapkan();
    }, 120);
  });

  searchClear.addEventListener("click", function () {
    searchInput.value = "";
    query = "";
    terapkan();
    searchInput.focus();
  });

  /* ================= Panel semua kategori ================= */
  function bukaSheet() {
    catSheet.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function tutupSheet() {
    catSheet.hidden = true;
    document.body.style.overflow = "";
  }

  document.getElementById("chipsAll").addEventListener("click", bukaSheet);
  document.getElementById("catSheetClose").addEventListener("click", tutupSheet);

  catSheet.addEventListener("click", function (e) {
    if (e.target === catSheet) return tutupSheet();

    var b = e.target.closest && e.target.closest(".catsheet-item");
    if (!b) return;

    var id = b.getAttribute("data-kat");
    var kat = MENU.filter(function (k) { return k.id === id; })[0];
    if (!kat) return;

    // Memilih kategori dari grup lain ikut memindahkan tab atasnya.
    if (kat.grup !== grupAktif) {
      var seg = segmented.querySelector('[data-grup="' + kat.grup + '"]');
      if (seg) seg.click();
      grupAktif = kat.grup;
    }
    if (query) { searchInput.value = ""; query = ""; }

    terapkan();
    tutupSheet();
    window.setTimeout(function () { lompatKe(id); }, 60);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !catSheet.hidden) tutupSheet();
  });

  terapkan();
})();
