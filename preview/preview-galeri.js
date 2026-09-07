(function () {
  "use strict";

  /* MOCKUP galeri publik. Sumber datanya MOCK_ENTRIES di
     data/mock-giveaway.js — tidak ada request jaringan sama sekali.
     Sama seperti versi jadi, halaman ini HANYA menampilkan entry
     berstatus "approved". */

  var grid = document.getElementById("gwGrid");
  if (!grid || typeof MOCK_ENTRIES === "undefined") return;

  var emptyState = document.getElementById("gwGalleryEmpty");

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function el(tag, cls, txt) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (txt) node.textContent = txt;
    return node;
  }

  // "?kosong=1" memperagakan galeri sebelum ada foto yang di-approve.
  var kosong = window.location.search.indexOf("kosong=1") !== -1;

  var tombolIsi = document.getElementById("pvToggleIsi");
  var tombolKosong = document.getElementById("pvToggleKosong");
  if (tombolIsi && tombolKosong) {
    (kosong ? tombolKosong : tombolIsi).className = "is-active";
  }

  function renderFoto(entry) {
    var kartu = el("a", "gwcard");
    kartu.href = "https://www.instagram.com/" + encodeURIComponent(entry.instagram_username) + "/";
    kartu.target = "_blank";
    kartu.rel = "noopener";

    var img = document.createElement("img");
    img.src = entry.foto_url;
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = "Foto peserta giveaway oleh @" + entry.instagram_username;
    kartu.appendChild(img);

    kartu.appendChild(el("span", "gwcard-label", "@" + entry.instagram_username));
    return kartu;
  }

  var disetujui = kosong ? [] : MOCK_ENTRIES.filter(function (e) {
    return e.status === "approved";
  });

  if (!disetujui.length) {
    if (emptyState) emptyState.hidden = false;
    return;
  }

  var frag = document.createDocumentFragment();
  disetujui.forEach(function (entry) {
    frag.appendChild(renderFoto(entry));
  });
  grid.appendChild(frag);
})();
