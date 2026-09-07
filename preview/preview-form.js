(function () {
  "use strict";

  /* MOCKUP form peserta. Tidak ada Supabase, tidak ada fetch, tidak ada
     upload. Submit hanya menunda 1,5 detik lalu menukar tampilan form
     jadi state sukses, supaya alurnya terasa nyata saat didemokan.
     Isi teks & tanggal diambil dari MOCK_INFO di data/mock-giveaway.js. */

  if (typeof MOCK_INFO === "undefined") return;

  var JEDA_PALSU = 1500; // ms — lama "loading" pura-pura

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function formatTanggalID(ymd) {
    try {
      var d = new Date(ymd + "T12:00:00+07:00");
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta"
      }).format(d);
    } catch (e) {
      return ymd;
    }
  }

  function sisaHari() {
    var batas = new Date(MOCK_INFO.deadline + "T23:59:59+07:00");
    return Math.ceil((batas - new Date()) / 86400000);
  }

  // ===== Isi teks dari MOCK_INFO =====
  var judulEl = document.getElementById("gwJudul");
  var nominalEl = document.getElementById("gwHadiahNominal");
  var detailEl = document.getElementById("gwHadiahDetail");
  var urgencyEl = document.getElementById("gwUrgency");
  var deadlineEl = document.getElementById("gwDeadlineTanggal");
  var pengumumanEl = document.getElementById("gwPengumumanTanggal");

  if (judulEl) judulEl.textContent = MOCK_INFO.judul;
  if (nominalEl) nominalEl.textContent = MOCK_INFO.hadiahNominal;
  if (detailEl) detailEl.textContent = MOCK_INFO.hadiahDetail;
  if (deadlineEl) deadlineEl.textContent = formatTanggalID(MOCK_INFO.deadline);
  if (pengumumanEl) pengumumanEl.textContent = formatTanggalID(MOCK_INFO.pengumuman);

  if (urgencyEl) {
    var sisa = sisaHari();
    if (sisa === 1) {
      urgencyEl.textContent = "⏳ Hari ini hari terakhir!";
      urgencyEl.hidden = false;
    } else if (sisa > 1) {
      urgencyEl.textContent = "⏳ Ditutup " + formatTanggalID(MOCK_INFO.deadline) +
        " · sisa " + sisa + " hari";
      urgencyEl.hidden = false;
    }
  }

  // ===== Elemen form =====
  var form = document.getElementById("gwForm");
  if (!form) return;

  var namaInput = document.getElementById("gwNama");
  var waInput = document.getElementById("gwWa");
  var igInput = document.getElementById("gwIg");
  var fotoInput = document.getElementById("gwFoto");
  var uploadBtn = document.getElementById("gwUploadBtn");
  var previewBox = document.getElementById("gwPreview");
  var previewImg = document.getElementById("gwPreviewImg");
  var previewRemove = document.getElementById("gwPreviewRemove");
  var consentInput = document.getElementById("gwConsent");
  var errorBox = document.getElementById("gwError");
  var submitBtn = document.getElementById("gwSubmit");
  var successBox = document.getElementById("gwSuccess");
  var shareWaLink = document.getElementById("gwShareWa");
  var resetBtn = document.getElementById("gwReset");

  var previewUrl = null;
  var adaFoto = false;
  var sedangSubmit = false;

  function tampilkanError(pesan) {
    if (!errorBox) return;
    errorBox.textContent = pesan;
    errorBox.hidden = false;
  }

  function sembunyikanError() {
    if (!errorBox) return;
    errorBox.hidden = true;
    errorBox.textContent = "";
  }

  // Buang "@" kalau pengunjung terlanjur mengetiknya.
  if (igInput) {
    igInput.addEventListener("input", function () {
      if (igInput.value.indexOf("@") === -1) return;
      igInput.value = igInput.value.replace(/@/g, "");
    });
  }

  /* Kotak nomor sudah berlabel +62, jadi isinya harus nomor lokal saja.
     Tiga kebiasaan yang paling sering dipakai orang dibersihkan otomatis
     supaya tidak jadi nomor dobel seperti "+62081…":
       "0812…"    -> "812…"   (0 di depan)
       "62812…"   -> "812…"   (kode negara diketik ulang)
       "0812-3456" -> "8123456" (spasi & strip)                        */
  function rapikanNomor(v) {
    var d = (v || "").replace(/\D/g, "");
    if (d.indexOf("62") === 0) d = d.slice(2);
    d = d.replace(/^0+/, "");
    return d;
  }

  if (waInput) {
    waInput.addEventListener("input", function () {
      var bersih = rapikanNomor(waInput.value);
      if (bersih !== waInput.value) waInput.value = bersih;
    });
  }

  // ===== Chip kategori (dari MOCK_KATEGORI, bukan hardcode) =====
  var katWrap = document.getElementById("gwKategori");
  if (katWrap && typeof MOCK_KATEGORI !== "undefined") {
    MOCK_KATEGORI.forEach(function (k) {
      var label = document.createElement("label");
      label.className = "gwkat-chip";

      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "kategori";
      radio.value = k.id;

      var teks = document.createElement("span");
      teks.textContent = k.label;

      label.appendChild(radio);
      label.appendChild(teks);
      katWrap.appendChild(label);
    });
  }

  function kategoriTerpilih() {
    var dipilih = katWrap ? katWrap.querySelector("input[name=kategori]:checked") : null;
    return dipilih ? dipilih.value : "";
  }

  function resetFoto() {
    adaFoto = false;
    if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
    if (fotoInput) fotoInput.value = "";
    if (previewBox) previewBox.hidden = true;
    if (uploadBtn) uploadBtn.hidden = false;
  }

  if (fotoInput) {
    fotoInput.addEventListener("change", function () {
      var file = fotoInput.files && fotoInput.files[0];
      sembunyikanError();
      if (!file) { resetFoto(); return; }

      if (file.size > 5 * 1024 * 1024) {
        tampilkanError("Ukuran foto maksimal 5MB. Pilih foto lain ya.");
        resetFoto();
        return;
      }

      // Hanya dibaca lokal untuk pratinjau — tidak diunggah ke mana pun.
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = URL.createObjectURL(file);
      if (previewImg) previewImg.src = previewUrl;
      if (previewBox) previewBox.hidden = false;
      if (uploadBtn) uploadBtn.hidden = true;
      adaFoto = true;
    });
  }

  if (previewRemove) {
    previewRemove.addEventListener("click", resetFoto);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sedangSubmit) return;
    sembunyikanError();

    var nama = (namaInput.value || "").trim();
    var wa = rapikanNomor(waInput.value);
    var ig = (igInput.value || "").trim().replace(/^@+/, "");

    if (!nama) { tampilkanError("Nama wajib diisi."); namaInput.focus(); return; }
    // Kotaknya sudah +62, jadi yang diketik harus nomor lokal yang
    // diawali 8 — misal 81234567890.
    if (!/^8[1-9][0-9]{6,10}$/.test(wa)) {
      tampilkanError("Nomor WhatsApp tidak valid. Ketik tanpa 0 di depan, contoh: 81234567890.");
      waInput.focus();
      return;
    }
    if (!ig) { tampilkanError("Username Instagram wajib diisi."); igInput.focus(); return; }
    if (!kategoriTerpilih()) { tampilkanError("Pilih dulu kategori fotonya."); return; }
    if (!adaFoto) { tampilkanError("Upload foto kamu dulu ya."); return; }
    if (!consentInput.checked) {
      tampilkanError("Centang dulu persetujuan repost foto sebelum kirim.");
      return;
    }

    // ---- Loading palsu, lalu sukses palsu ----
    sedangSubmit = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Mengunggah…";

    window.setTimeout(function () {
      sedangSubmit = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Kirim";

      form.hidden = true;
      if (successBox) successBox.hidden = false;

      if (shareWaLink) {
        var pesan = "Aku baru ikutan " + MOCK_INFO.judul + "! Yuk ikutan juga: " +
          window.location.origin + "/preview/giveaway/";
        shareWaLink.href = "https://wa.me/?text=" + encodeURIComponent(pesan);
      }

      if (successBox) {
        window.scrollTo({ top: successBox.offsetTop - 80, behavior: "smooth" });
      }
    }, JEDA_PALSU);
  });

  // Tombol khusus mockup: balikkan ke form kosong supaya demo bisa
  // diulang berkali-kali tanpa reload.
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      form.reset();
      resetFoto();
      sembunyikanError();
      if (successBox) successBox.hidden = true;
      form.hidden = false;
      window.scrollTo({ top: form.offsetTop - 80, behavior: "smooth" });
    });
  }
})();
