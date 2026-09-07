(function () {
  "use strict";

  /* ============================================================
     INFO GIVEAWAY — ubah di sini saja, tidak perlu sentuh HTML
     ============================================================
     deadline / pengumuman: "YYYY-MM-DD", dibaca sebagai akhir hari
     WIB (23.59 Asia/Jakarta) supaya batas waktunya benar buat semua
     pengunjung, apa pun zona waktu HP mereka. */
  var GIVEAWAY_INFO = {
    judul: "Giveaway Argo Loro",
    /* hadiahNominal dipajang paling besar di kartu hadiah — ini hook
       halamannya, jadi isi angkanya saja ("Rp200.000", "2 Tiket Konser").
       Penjelasannya taruh di hadiahDetail. */
    hadiahNominal: "Rp200.000",
    hadiahDetail: "Voucher makan gratis · 3 pemenang",
    deadline: "2026-09-30",
    pengumuman: "2026-10-03",
    instagram: "argoloro_kopi"
  };

  var BUCKET = "giveaway-photos";
  var TABLE = "giveaway_entries";
  var MAX_UKURAN = 5 * 1024 * 1024; // 5MB
  var TIPE_DITERIMA = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

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

  function batasWaktu() {
    return new Date(GIVEAWAY_INFO.deadline + "T23:59:59+07:00");
  }

  function deadlineSudahLewat() {
    return new Date() > batasWaktu();
  }

  // Dibulatkan ke atas: selama masih ada sisa waktu hari ini, hasilnya 1
  // ("hari terakhir"), bukan 0.
  function sisaHari() {
    return Math.ceil((batasWaktu() - new Date()) / 86400000);
  }

  // ===== Render info statis (hero + kartu deadline) =====
  var judulEl = document.getElementById("gwJudul");
  var nominalEl = document.getElementById("gwHadiahNominal");
  var detailEl = document.getElementById("gwHadiahDetail");
  var urgencyEl = document.getElementById("gwUrgency");
  var deadlineEl = document.getElementById("gwDeadlineTanggal");
  var pengumumanEl = document.getElementById("gwPengumumanTanggal");

  if (judulEl) judulEl.textContent = GIVEAWAY_INFO.judul;
  if (nominalEl) nominalEl.textContent = GIVEAWAY_INFO.hadiahNominal;
  if (detailEl) detailEl.textContent = GIVEAWAY_INFO.hadiahDetail;
  if (deadlineEl) deadlineEl.textContent = formatTanggalID(GIVEAWAY_INFO.deadline);
  if (pengumumanEl) pengumumanEl.textContent = formatTanggalID(GIVEAWAY_INFO.pengumuman);

  if (urgencyEl) {
    var sisa = sisaHari();
    if (sisa === 1) {
      urgencyEl.textContent = "⏳ Hari ini hari terakhir!";
      urgencyEl.hidden = false;
    } else if (sisa > 1) {
      urgencyEl.textContent = "⏳ Ditutup " + formatTanggalID(GIVEAWAY_INFO.deadline) +
        " · sisa " + sisa + " hari";
      urgencyEl.hidden = false;
    }
  }

  var form = document.getElementById("gwForm");
  var closedBox = document.getElementById("gwClosed");
  if (!form) return;

  if (deadlineSudahLewat()) {
    form.hidden = true;
    if (closedBox) closedBox.hidden = false;
    return;
  }

  // ===== Elemen form =====
  var namaInput = document.getElementById("gwNama");
  var waInput = document.getElementById("gwWa");
  var igInput = document.getElementById("gwIg");
  var fotoInput = document.getElementById("gwFoto");
  var uploadBtn = document.getElementById("gwUploadBtn");
  var previewBox = document.getElementById("gwPreview");
  var previewImg = document.getElementById("gwPreviewImg");
  var previewRemove = document.getElementById("gwPreviewRemove");
  var consentInput = document.getElementById("gwConsent");
  var honeypot = document.getElementById("gwWebsite");
  var errorBox = document.getElementById("gwError");
  var submitBtn = document.getElementById("gwSubmit");
  var successBox = document.getElementById("gwSuccess");
  var shareWaLink = document.getElementById("gwShareWa");

  var fileTerpilih = null;      // File asli, buat validasi ulang
  var fileUntukUpload = null;   // File hasil kompresi (atau asli kalau kompresi gagal)
  var previewUrl = null;
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

  // ===== Instagram: buang @ di depan kalau user ketik pakai @ =====
  if (igInput) {
    igInput.addEventListener("input", function () {
      if (igInput.value.indexOf("@") === -1) return;
      igInput.value = igInput.value.replace(/@/g, "");
    });
  }

  // ===== Validasi nomor WhatsApp Indonesia (08xx atau +62xx) =====
  function nomorWaValid(v) {
    var t = (v || "").replace(/[\s-]/g, "");
    return /^(?:\+?62|0)8[1-9][0-9]{6,10}$/.test(t);
  }

  // ===== Kompresi foto di client, dijalankan di background begitu
  // file dipilih supaya submit tidak menunggu kompresi mulai dari nol. =====
  function kompresGambar(file) {
    return new Promise(function (resolve) {
      // Safari bisa decode HEIC lewat <img>, browser lain umumnya tidak —
      // kalau img.onerror kena di bawah, fallback-nya upload file asli.
      var img = new Image();
      var url = URL.createObjectURL(file);

      img.onload = function () {
        URL.revokeObjectURL(url);
        var w = img.naturalWidth, h = img.naturalHeight;
        if (!w || !h) { resolve(file); return; }

        var MAKS_SISI = 1600;
        var skala = Math.min(1, MAKS_SISI / Math.max(w, h));
        var cw = Math.round(w * skala), ch = Math.round(h * skala);

        var canvas = document.createElement("canvas");
        canvas.width = cw;
        canvas.height = ch;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, cw, ch);

        canvas.toBlob(function (blob) {
          if (!blob) { resolve(file); return; }
          var namaBaru = (file.name || "foto").replace(/\.[^.]+$/, "") + ".jpg";
          var hasil = new File([blob], namaBaru, { type: "image/jpeg" });
          resolve(hasil.size < file.size ? hasil : file);
        }, "image/jpeg", 0.82);
      };

      img.onerror = function () {
        URL.revokeObjectURL(url);
        resolve(file); // Format tidak bisa didekode browser ini — pakai file asli.
      };

      img.src = url;
    });
  }

  function resetFoto() {
    fileTerpilih = null;
    fileUntukUpload = null;
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

      if (file.size > MAX_UKURAN) {
        tampilkanError("Ukuran foto maksimal 5MB. Pilih foto lain ya.");
        resetFoto();
        return;
      }
      var tipeOk = TIPE_DITERIMA.indexOf(file.type) !== -1 ||
                   /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name || "");
      if (!tipeOk) {
        tampilkanError("Format foto harus JPG, PNG, WebP, atau HEIC.");
        resetFoto();
        return;
      }

      fileTerpilih = file;
      fileUntukUpload = file; // sementara, diganti kalau kompresi berhasil

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = URL.createObjectURL(file);
      if (previewImg) previewImg.src = previewUrl;
      if (previewBox) previewBox.hidden = false;
      if (uploadBtn) uploadBtn.hidden = true;

      kompresGambar(file).then(function (hasil) {
        // Kalau user sudah ganti foto lagi sebelum kompresi selesai, buang hasil ini.
        if (fileTerpilih === file) fileUntukUpload = hasil;
      });
    });
  }

  if (previewRemove) {
    previewRemove.addEventListener("click", function () {
      resetFoto();
    });
  }

  // ===== Submit =====
  function acakId() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  function setSedangSubmit(v) {
    sedangSubmit = v;
    if (submitBtn) {
      submitBtn.disabled = v;
      submitBtn.textContent = v ? "Mengunggah…" : "Kirim";
    }
  }

  function getSupabaseClient() {
    if (typeof window.supabase === "undefined" ||
        !window.GIVEAWAY_SUPABASE_URL || !window.GIVEAWAY_SUPABASE_ANON_KEY ||
        window.GIVEAWAY_SUPABASE_URL.indexOf("xxxxxxxxxxxx") !== -1) {
      return null;
    }
    if (!window._gwSupabaseClient) {
      window._gwSupabaseClient = window.supabase.createClient(
        window.GIVEAWAY_SUPABASE_URL, window.GIVEAWAY_SUPABASE_ANON_KEY
      );
    }
    return window._gwSupabaseClient;
  }

  function tampilkanSukses() {
    form.hidden = true;
    if (successBox) successBox.hidden = false;
    if (shareWaLink) {
      var pesan = "Aku baru ikutan " + GIVEAWAY_INFO.judul +
        "! Yuk ikutan juga: " + window.location.origin + "/giveaway";
      shareWaLink.href = "https://wa.me/?text=" + encodeURIComponent(pesan);
    }
    window.scrollTo({ top: successBox ? successBox.offsetTop - 20 : 0, behavior: "smooth" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sedangSubmit) return;
    sembunyikanError();

    // Honeypot terisi = kemungkinan besar bot. Diamkan saja, jangan
    // kasih tahu botnya kalau ketahuan — tampilkan sukses palsu.
    if (honeypot && honeypot.value.trim() !== "") {
      tampilkanSukses();
      return;
    }

    var nama = (namaInput.value || "").trim();
    var wa = (waInput.value || "").trim();
    var ig = (igInput.value || "").trim().replace(/^@+/, "");

    if (!nama) { tampilkanError("Nama wajib diisi."); namaInput.focus(); return; }
    if (!nomorWaValid(wa)) {
      tampilkanError("Nomor WhatsApp tidak valid. Pakai format 08xx atau +62xx.");
      waInput.focus();
      return;
    }
    if (!ig) { tampilkanError("Username Instagram wajib diisi."); igInput.focus(); return; }
    if (!fileTerpilih) { tampilkanError("Upload foto kamu dulu ya."); return; }
    if (!consentInput.checked) {
      tampilkanError("Centang dulu persetujuan repost foto sebelum kirim.");
      return;
    }

    var client = getSupabaseClient();
    if (!client) {
      tampilkanError("Fitur pendaftaran belum aktif, hubungi admin Argo Loro.");
      return;
    }

    setSedangSubmit(true);

    var file = fileUntukUpload || fileTerpilih;
    var ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    var path = acakId() + "." + ext;

    client.storage.from(BUCKET).upload(path, file, { contentType: file.type })
      .then(function (res) {
        if (res.error) throw res.error;
        var publicUrl = client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
        return client.from(TABLE).insert({
          nama: nama,
          nomor_wa: wa,
          instagram_username: ig,
          foto_url: publicUrl,
          consent_repost: true,
          status: "pending"
        });
      })
      .then(function (res) {
        if (res.error) throw res.error;
        setSedangSubmit(false);
        tampilkanSukses();
      })
      .catch(function () {
        setSedangSubmit(false);
        tampilkanError("Gagal mengirim, coba lagi. Kalau terus gagal, pastikan koneksi internet stabil.");
      });
  });
})();
