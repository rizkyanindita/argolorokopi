(function () {
  "use strict";

  /* MOCKUP alat kurasi tim socmed.

     Semua aksi (setujui / tolak / tandai dipakai / ubah kategori) hanya
     mengubah salinan data di memori lalu menggambar ulang daftarnya.
     Tidak ada penyimpanan, jadi begitu halaman dimuat ulang semuanya
     kembali ke kondisi awal di data/mock-giveaway.js. Itu memang
     disengaja — ini alat peraga, bukan alat kerja beneran.

     Satu-satunya yang benar-benar berfungsi: tombol "Salin kredit"
     (menulis ke clipboard) dan "Unduh asli" (mengunduh berkas lokal). */

  var grid = document.getElementById("kGrid");
  if (!grid || typeof MOCK_ENTRIES === "undefined") return;

  var emptyState = document.getElementById("kEmpty");
  var hasilEl = document.getElementById("kHasil");
  var toastEl = document.getElementById("kToast");
  var chipsKategoriEl = document.getElementById("kchipsKategori");

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Salinan data supaya array aslinya tidak ikut berubah.
  var entries = MOCK_ENTRIES.map(function (e) {
    return {
      id: e.id, nama: e.nama, instagram_username: e.instagram_username,
      foto_url: e.foto_url, tanggal: e.tanggal, orientasi: e.orientasi,
      status: e.status, kategori: e.kategori, sudah_dipakai: e.sudah_dipakai
    };
  });

  var filter = { status: "semua", orientasi: "semua", dipakai: "semua", kategori: "semua", tanggal: "semua" };

  var LABEL_STATUS = {
    pending: "Menunggu review",
    approved: "Disetujui",
    rejected: "Ditolak"
  };

  function el(tag, cls, txt) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (txt) node.textContent = txt;
    return node;
  }

  function labelKategori(id) {
    var found = null;
    MOCK_KATEGORI.forEach(function (k) { if (k.id === id) found = k.label; });
    return found || id;
  }

  function formatTanggal(ymd) {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta"
      }).format(new Date(ymd + "T12:00:00+07:00"));
    } catch (e) {
      return ymd;
    }
  }

  // Versi panjang untuk dropdown filter: "Minggu, 6 September 2026".
  function formatTanggalPanjang(ymd) {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
        timeZone: "Asia/Jakarta"
      }).format(new Date(ymd + "T12:00:00+07:00"));
    } catch (e) {
      return ymd;
    }
  }

  var toastTimer = null;
  function toast(pesan) {
    if (!toastEl) return;
    toastEl.textContent = pesan;
    toastEl.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toastEl.hidden = true; }, 2000);
  }

  // ===== Chip kategori (dari data, bukan hardcode di HTML) =====
  if (chipsKategoriEl) {
    var semuaKat = el("button", "kchip is-active", "Semua");
    semuaKat.type = "button";
    semuaKat.setAttribute("data-value", "semua");
    chipsKategoriEl.appendChild(semuaKat);

    MOCK_KATEGORI.forEach(function (k) {
      var b = el("button", "kchip", k.label);
      b.type = "button";
      b.setAttribute("data-value", k.id);
      chipsKategoriEl.appendChild(b);
    });
  }

  // ===== Dropdown tanggal — isinya dari tanggal yang benar-benar ada =====
  var tanggalSelect = document.getElementById("kTanggal");
  if (tanggalSelect) {
    var unik = [];
    entries.forEach(function (e) {
      if (unik.indexOf(e.tanggal) === -1) unik.push(e.tanggal);
    });
    unik.sort().reverse(); // terbaru di atas

    var opsiSemua = document.createElement("option");
    opsiSemua.value = "semua";
    opsiSemua.textContent = "Semua tanggal";
    tanggalSelect.appendChild(opsiSemua);

    unik.forEach(function (t) {
      var o = document.createElement("option");
      o.value = t;
      o.textContent = formatTanggalPanjang(t);
      tanggalSelect.appendChild(o);
    });

    tanggalSelect.addEventListener("change", function () {
      filter.tanggal = tanggalSelect.value;
      render();
    });
  }

  // ===== Filter =====
  Array.prototype.slice.call(document.querySelectorAll(".kfilter-group")).forEach(function (group) {
    var jenis = group.getAttribute("data-filter");
    group.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".kchip") : null;
      if (!btn || !group.contains(btn)) return;

      filter[jenis] = btn.getAttribute("data-value");
      Array.prototype.slice.call(group.querySelectorAll(".kchip")).forEach(function (b) {
        b.className = b === btn ? "kchip is-active" : "kchip";
      });
      render();
    });
  });

  function cocok(entry) {
    /* Foto yang ditolak hilang dari SEMUA tampilan, kecuali kalau filter
       status-nya memang sengaja disetel ke "Ditolak". Jadi antrean kerja
       tim tetap bersih, tapi keputusannya masih bisa ditinjau ulang dan
       dibatalkan — tidak ada data yang benar-benar lenyap. */
    if (entry.status === "rejected" && filter.status !== "rejected") return false;

    if (filter.status !== "semua" && entry.status !== filter.status) return false;
    if (filter.orientasi !== "semua" && entry.orientasi !== filter.orientasi) return false;
    if (filter.dipakai === "belum" && entry.sudah_dipakai) return false;
    if (filter.dipakai === "sudah" && !entry.sudah_dipakai) return false;
    if (filter.kategori !== "semua" && entry.kategori !== filter.kategori) return false;
    if (filter.tanggal !== "semua" && entry.tanggal !== filter.tanggal) return false;
    return true;
  }

  /* Dipanggil setelah sebuah kartu diubah. Kalau entry-nya tidak lagi
     lolos filter yang sedang aktif (ditolak, atau disetujui saat sedang
     memfilter "menunggu review"), kartunya dianimasikan keluar dulu baru
     daftarnya digambar ulang — jadi jelas terlihat kartunya pergi. */
  function perbarui(entry, kartu) {
    if (cocok(entry)) { render(); return; }
    kartu.className = "kcard is-hapus";
    window.setTimeout(render, 240);
  }

  // Link profil Instagram: tanpa "@" dan tanpa garis miring di akhir.
  // Dipakai dua tempat — tautan nama di kartu dan tombol salin — supaya
  // keduanya tidak pernah beda bentuk.
  function urlInstagram(username) {
    var bersih = (username || "").replace(/^@+/, "");
    return "https://www.instagram.com/" + encodeURIComponent(bersih);
  }

  // ===== Salin link IG — ini benar-benar berfungsi =====
  function salinLink(teks, labelToast) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(teks).then(function () {
        toast(labelToast);
      }, function () {
        salinCaraLama(teks, labelToast);
      });
      return;
    }
    salinCaraLama(teks, labelToast);
  }

  function salinCaraLama(teks, labelToast) {
    var ta = document.createElement("textarea");
    ta.value = teks;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      toast(labelToast);
    } catch (err) {
      toast("Gagal menyalin, salin manual: " + teks);
    }
    document.body.removeChild(ta);
  }

  // ===== Kartu foto =====
  function renderKartu(entry) {
    var kartu = el("article", "kcard");

    // -- Thumbnail --
    var media = el("div", "kcard-media");
    var img = document.createElement("img");
    img.src = entry.foto_url;
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = "Foto dari @" + entry.instagram_username;
    media.appendChild(img);

    // Dua badge atas dibungkus satu baris flex supaya tidak saling
    // menimpa di kartu sempit.
    var badges = el("div", "kcard-badges");
    badges.appendChild(el("span", "kbadge kbadge-orientasi",
      entry.orientasi === "portrait" ? "↕ Portrait" : "↔ Landscape"));
    badges.appendChild(el("span", "kbadge kbadge-status kstatus-" + entry.status,
      LABEL_STATUS[entry.status]));
    media.appendChild(badges);
    if (entry.sudah_dipakai) {
      media.appendChild(el("span", "kbadge kbadge-dipakai", "✓ Sudah dipakai"));
    }
    kartu.appendChild(media);

    // -- Meta --
    var body = el("div", "kcard-body");
    var who = el("div", "kcard-who");
    var ig = el("a", "kcard-ig", "@" + entry.instagram_username);
    ig.href = urlInstagram(entry.instagram_username);
    ig.target = "_blank";
    ig.rel = "noopener";
    who.appendChild(ig);
    who.appendChild(el("span", "kcard-nama", entry.nama));
    body.appendChild(who);
    body.appendChild(el("span", "kcard-tanggal", formatTanggal(entry.tanggal)));
    kartu.appendChild(body);

    // -- Aksi utama --
    var aksi = el("div", "kaksi");

    var btnSetuju = el("button", "kbtn kbtn-ok" + (entry.status === "approved" ? " is-on" : ""), "✓ Setujui");
    btnSetuju.type = "button";
    btnSetuju.addEventListener("click", function () {
      entry.status = entry.status === "approved" ? "pending" : "approved";
      toast(entry.status === "approved"
        ? "@" + entry.instagram_username + " disetujui"
        : "Status dikembalikan ke menunggu review");
      perbarui(entry, kartu);
    });

    var btnTolak = el("button", "kbtn kbtn-no" + (entry.status === "rejected" ? " is-on" : ""),
      entry.status === "rejected" ? "↩ Kembalikan" : "✕ Tolak");
    btnTolak.type = "button";
    btnTolak.addEventListener("click", function () {
      if (entry.status === "rejected") {
        // Sedang dilihat lewat filter "Ditolak" — kembalikan ke antrean.
        entry.status = "pending";
        toast("@" + entry.instagram_username + " dikembalikan ke antrean review");
      } else {
        entry.status = "rejected";
        toast("@" + entry.instagram_username + " ditolak — kartunya dibuang dari daftar");
      }
      perbarui(entry, kartu);
    });

    aksi.appendChild(btnSetuju);
    aksi.appendChild(btnTolak);
    kartu.appendChild(aksi);

    // -- Aksi sekunder --
    var aksi2 = el("div", "kaksi");

    var btnDipakai = el("button", "kbtn" + (entry.sudah_dipakai ? " is-on" : ""),
      entry.sudah_dipakai ? "📌 Sudah dipakai" : "📌 Tandai dipakai");
    btnDipakai.type = "button";
    btnDipakai.addEventListener("click", function () {
      entry.sudah_dipakai = !entry.sudah_dipakai;
      toast(entry.sudah_dipakai ? "Ditandai sudah dipakai" : "Tanda dipakai dilepas");
      perbarui(entry, kartu);
    });
    aksi2.appendChild(btnDipakai);
    kartu.appendChild(aksi2);

    var aksi3 = el("div", "kaksi");

    var btnUnduh = el("a", "kbtn", "⬇ Unduh asli");
    btnUnduh.href = entry.foto_url;
    btnUnduh.setAttribute("download", entry.instagram_username + "-" + entry.id + ".webp");
    aksi3.appendChild(btnUnduh);

    var btnKredit = el("button", "kbtn", "🔗 Salin link IG");
    btnKredit.type = "button";
    btnKredit.addEventListener("click", function () {
      salinLink(urlInstagram(entry.instagram_username),
        "Link IG @" + entry.instagram_username + " disalin");
    });
    aksi3.appendChild(btnKredit);
    kartu.appendChild(aksi3);

    // -- Tag kategori --
    var tagWrap = el("div", "ktags");
    tagWrap.appendChild(el("span", "ktags-label", "Kategori:"));
    MOCK_KATEGORI.forEach(function (k) {
      var t = el("button", "ktag" + (entry.kategori === k.id ? " is-on" : ""), k.label);
      t.type = "button";
      t.addEventListener("click", function () {
        entry.kategori = k.id;
        toast("Kategori diubah jadi " + k.label);
        perbarui(entry, kartu);
      });
      tagWrap.appendChild(t);
    });
    kartu.appendChild(tagWrap);

    return kartu;
  }

  // ===== Hitungan di atas =====
  function renderStats() {
    var pending = 0, approved = 0, stok = 0;
    entries.forEach(function (e) {
      if (e.status === "pending") pending++;
      if (e.status === "approved") {
        approved++;
        if (!e.sudah_dipakai) stok++;
      }
    });
    document.getElementById("statTotal").textContent = entries.length;
    document.getElementById("statPending").textContent = pending;
    document.getElementById("statApproved").textContent = approved;
    document.getElementById("statStok").textContent = stok;
  }

  function render() {
    renderStats();

    var tampil = entries.filter(cocok);
    grid.innerHTML = "";

    if (hasilEl) {
      hasilEl.textContent = tampil.length === entries.length
        ? "Menampilkan semua " + entries.length + " foto"
        : "Menampilkan " + tampil.length + " dari " + entries.length + " foto";
    }

    if (!tampil.length) {
      if (emptyState) emptyState.hidden = false;
      return;
    }
    if (emptyState) emptyState.hidden = true;

    var frag = document.createDocumentFragment();
    tampil.forEach(function (entry) {
      frag.appendChild(renderKartu(entry));
    });
    grid.appendChild(frag);
  }

  render();
})();
