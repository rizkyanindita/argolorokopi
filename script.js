(function () {
  "use strict";

  /* ============================================================
     DATA AGENDA — ubah di sini saja, tidak perlu sentuh HTML
     ============================================================

     FEATURED_EVENT  = satu event spesial bertanggal, tampil paling
                       atas dengan aksen terakota.
                       Set ke null kalau sedang tidak ada:
                           var FEATURED_EVENT = null;
                       Kartunya otomatis hilang, list di bawah tetap
                       tampil normal.

     EVENTS          = daftar event lain. Urutan di array ini tidak
                       penting — kode mengurutkan sendiri berdasarkan
                       tanggal (paling dekat di atas).

     Format tiap event:
       date     "YYYY-MM-DD"  wajib. Dipakai untuk urutan + badge.
       name     judul kartu. Kosongkan ("") kalau belum ada nama —
                tanggalnya otomatis jadi judul.
       tagline  satu baris penegas di atas judul. Opsional.
       caption  deskripsi. Opsional.
       lineup   array pengisi acara. Opsional, [] kalau tidak ada.

     Tulis "@namaakun" di caption atau lineup dan teks itu otomatis
     jadi tautan ke instagram.com/namaakun. Tidak perlu menulis URL.
     ============================================================ */

  var FEATURED_EVENT = {
    date: "2026-08-17",
    name: "Coffee Beats",
    tagline: "Special Independence Day 🇮🇩",
    caption: "Live band, DJ set, and fun little games! 🎸🌄 Pull up, catch the vibes, and let's celebrate Independence Day together! 🇮🇩🔥",
    lineup: []
  };

  var EVENTS = [
    {
      date: "2026-06-04",
      name: "", // TODO: belum ada nama — sementara tanggal jadi judul
      tagline: "",
      caption: "Dance through time with groovy beats, mountain vibes, and unforgettable memories. 🌲🎵",
      lineup: ["🎧 DJ — @primeprime_", "🎸 Acoustic — ANF"]
    }
  ];

  /* Tampilkan event yang tanggalnya sudah lewat?
     true  = tetap tampil (agenda jadi semacam arsip)
     false = otomatis disembunyikan begitu tanggalnya terlewat */
  var SHOW_PAST_EVENTS = true;

  /* ---- Agenda lama, disimpan kalau sewaktu-waktu dipakai lagi ----
  var EVENTS = [
    { date: "", name: "Sunrise Hike & Coffee", caption: "Sabtu, mulai 05.00 · Kuota terbatas", lineup: [] },
    { date: "", name: "Acoustic Nights",       caption: "Jumat, 19.00 sampai selesai",        lineup: [] },
    { date: "", name: "Community Cupping",     caption: "Minggu terakhir tiap bulan · 16.00", lineup: [] }
  ];
  ---------------------------------------------------------------- */

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===== Tahun footer ===== */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Status buka/tutup (real-time, zona WIB) =====
     Jam operasional 09.00–21.00 setiap hari. Dihitung di zona
     Asia/Jakarta supaya pengunjung dari zona lain tetap lihat
     status yang benar. */
  var OPEN_MINUTE = 9 * 60;   // 09.00
  var CLOSE_MINUTE = 21 * 60; // 21.00

  function jakartaMinutes() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      }).formatToParts(new Date());

      var h = 0, m = 0;
      parts.forEach(function (p) {
        if (p.type === "hour") h = parseInt(p.value, 10);
        if (p.type === "minute") m = parseInt(p.value, 10);
      });
      return h * 60 + m;
    } catch (e) {
      // Browser tanpa dukungan timeZone: pakai jam lokal perangkat.
      var d = new Date();
      return d.getHours() * 60 + d.getMinutes();
    }
  }

  function renderStatus() {
    var statusEl = document.getElementById("openStatus");
    var textEl = document.getElementById("openStatusText");
    if (!statusEl || !textEl) return;

    var now = jakartaMinutes();
    var isOpen = now >= OPEN_MINUTE && now < CLOSE_MINUTE;

    if (isOpen) {
      var left = CLOSE_MINUTE - now;
      statusEl.classList.remove("is-closed");
      textEl.textContent = left <= 60
        ? "Buka · tutup dalam " + left + " menit"
        : "Buka sekarang · sampai 21.00";
    } else {
      statusEl.classList.add("is-closed");
      textEl.textContent = now < OPEN_MINUTE
        ? "Tutup · buka jam 09.00"
        : "Tutup · buka lagi besok 09.00";
    }
  }

  renderStatus();
  window.setInterval(renderStatus, 60000);

  /* ===== Overlay "belum tersedia" =====
     Dipakai bersama oleh beberapa tombol. Judul dan ikonnya dibaca
     dari atribut data-* milik tombol yang diklik, jadi menambah
     tombol baru cukup di HTML — tidak perlu menyentuh file ini. */
  var overlay = document.getElementById("unavailableOverlay");
  var overlayClose = document.getElementById("unavailableClose");
  var overlayTitle = document.getElementById("unavailableTitle");
  var overlayIcon = document.getElementById("unavailableIcon");
  var triggers = Array.prototype.slice.call(
    document.querySelectorAll("[data-unavailable]")
  );

  if (overlay && overlayClose && triggers.length) {
    var lastTrigger = null;

    var openOverlay = function (trigger) {
      lastTrigger = trigger;

      if (overlayTitle) {
        overlayTitle.textContent =
          trigger.getAttribute("data-unavailable-title") || "Belum tersedia";
      }
      if (overlayIcon) {
        overlayIcon.textContent =
          trigger.getAttribute("data-unavailable-icon") || "☕";
      }

      overlay.hidden = false;
      document.body.style.overflow = "hidden";
      overlayClose.focus();
    };

    var closeOverlay = function () {
      overlay.hidden = true;
      document.body.style.overflow = "";
      // Fokus balik ke tombol yang membukanya, bukan ke tombol tetap.
      if (lastTrigger) lastTrigger.focus();
    };

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openOverlay(trigger);
      });
    });

    overlayClose.addEventListener("click", closeOverlay);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeOverlay();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) closeOverlay();
    });
  }

  /* ===== Sticky CTA — muncul setelah blok aksi tergulir lewat ===== */
  var stickyCta = document.getElementById("stickyCta");
  var actionsSection = document.getElementById("actions");

  if (stickyCta && actionsSection && "IntersectionObserver" in window) {
    var ctaObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          // Tampilkan hanya kalau blok aksi sudah keluar ke ATAS layar,
          // bukan saat halaman belum discroll sama sekali.
          var scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          stickyCta.classList.toggle("is-visible", scrolledPast);
        });
      },
      { threshold: 0 }
    );
    ctaObserver.observe(actionsSection);
  }

  /* ===== Peta: dimuat saat diminta =====
     Iframe baru dibuat setelah tombol ditekan, jadi ±165 KB skrip
     Google Maps tidak pernah menyentuh kunjungan pertama. */
  var mapLoad = document.getElementById("mapLoad");
  var mapEmbed = document.getElementById("mapEmbed");

  if (mapLoad && mapEmbed) {
    mapLoad.addEventListener("click", function () {
      var frame = document.createElement("iframe");
      frame.src = "https://www.google.com/maps?q=Argoloro+Kopi,+Samiran,+Selo,+Boyolali&z=15&output=embed";
      frame.width = "100%";
      frame.height = "300";
      frame.style.border = "0";
      frame.setAttribute("allowfullscreen", "");
      frame.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      frame.title = "Peta lokasi Argo Loro Kopi";
      mapEmbed.innerHTML = "";
      mapEmbed.appendChild(frame);
    });
  }

  /* ===== Gambar bento: benar-benar ditunda =====
     loading="lazy" saja tidak cukup — Chromium tetap mengunduhnya di
     awal dan berebut bandwidth dengan hero. srcset baru dipasang
     setelah tile-nya mendekati layar. */
  var deferred = Array.prototype.slice.call(
    document.querySelectorAll("[data-srcset], [data-src]")
  );

  function loadDeferred(node) {
    var ss = node.getAttribute("data-srcset");
    if (ss) {
      node.setAttribute("srcset", ss);
      node.removeAttribute("data-srcset");
    }
    var src = node.getAttribute("data-src");
    if (src) {
      node.setAttribute("src", src);
      node.removeAttribute("data-src");
    }
  }

  // Observer baru dinyalakan setelah foto hero selesai diunduh. Tanpa
  // penundaan ini, tile bento masuk jangkauan rootMargin sejak awal dan
  // kembali berebut bandwidth dengan hero di koneksi lambat.
  function whenHeroReady(cb) {
    var heroImg = document.querySelector(".hero-media img");
    if (!heroImg || heroImg.complete) return cb();

    var done = false;
    function once() { if (!done) { done = true; cb(); } }

    heroImg.addEventListener("load", once);
    heroImg.addEventListener("error", once);
    window.setTimeout(once, 5000); // jaring pengaman kalau hero gagal
  }

  if (deferred.length) {
    if ("IntersectionObserver" in window) {
      var imgObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            // <source> tidak bisa diobservasi, jadi yang diamati <picture>
            var scope = entry.target;
            Array.prototype.forEach.call(
              scope.querySelectorAll("[data-srcset], [data-src]"),
              loadDeferred
            );
            imgObserver.unobserve(scope);
          });
        },
        { rootMargin: "300px 0px" }
      );

      whenHeroReady(function () {
        document.querySelectorAll(".tile-photo picture").forEach(function (pic) {
          imgObserver.observe(pic);
        });
      });
    } else {
      deferred.forEach(loadDeferred);
    }
  }

  /* ===== Render agenda =====
     Sengaja dijalankan SEBELUM blok scroll-reveal di bawah, supaya
     kartu sudah ada di DOM waktu observer menyapu ".reveal".
     Tidak ada sistem animasi baru — kartu cukup diberi class
     ".reveal" dan ikut mekanisme yang sudah dipakai section lain. */
  var eventList = document.getElementById("eventList");

  if (eventList) {
    var MONTHS_SHORT = ["JAN","FEB","MAR","APR","MEI","JUN","JUL","AGU","SEP","OKT","NOV","DES"];
    var DAYS_LONG = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    var MONTHS_LONG = ["Januari","Februari","Maret","April","Mei","Juni",
                       "Juli","Agustus","September","Oktober","November","Desember"];

    // "2026-08-17" -> Date lokal. Sengaja tidak pakai new Date(str)
    // karena string ISO tanggal-saja diparse sebagai UTC dan bisa
    // meleset satu hari di zona WIB.
    function parseDate(iso) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
      if (!m) return null;
      return new Date(+m[1], +m[2] - 1, +m[3]);
    }

    function formatLong(d) {
      return DAYS_LONG[d.getDay()] + ", " + d.getDate() + " " +
             MONTHS_LONG[d.getMonth()] + " " + d.getFullYear();
    }

    function el(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      // textContent, bukan innerHTML: teks event ditulis manual dan
      // bisa memuat karakter seperti & atau < yang akan merusak markup.
      if (text) node.textContent = text;
      return node;
    }

    // Setiap "@handle" di caption dan lineup otomatis jadi tautan ke
    // profil Instagram-nya. Tulis saja @namaakun di data — tidak perlu
    // menulis URL. Dirakit sebagai node DOM, bukan innerHTML, supaya
    // teks di sekitarnya tetap aman.
    var HANDLE_RE = /@([A-Za-z0-9._]+)/g;

    function elLinked(tag, className, text) {
      var node = el(tag, className);
      var last = 0;
      var m;

      HANDLE_RE.lastIndex = 0;
      while ((m = HANDLE_RE.exec(text)) !== null) {
        var handle = m[1].replace(/\.+$/, ""); // titik penutup kalimat bukan bagian handle

        if (m.index > last) {
          node.appendChild(document.createTextNode(text.slice(last, m.index)));
        }

        var a = document.createElement("a");
        a.href = "https://www.instagram.com/" + handle + "/";
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = "@" + handle;
        node.appendChild(a);

        last = m.index + 1 + handle.length;
      }

      if (last < text.length) {
        node.appendChild(document.createTextNode(text.slice(last)));
      }
      return node;
    }

    function buildCard(ev, isFeatured) {
      var d = parseDate(ev.date);
      var li = el("li", "event-item reveal" + (isFeatured ? " event-featured" : ""));

      // Badge tanggal bujur sangkar — pengganti bullet bulat lama.
      if (d) {
        var badge = el("span", "event-day");
        badge.setAttribute("aria-hidden", "true");
        badge.appendChild(el("span", "event-day-num", String(d.getDate())));
        badge.appendChild(el("span", "event-day-mon", MONTHS_SHORT[d.getMonth()]));
        li.appendChild(badge);
      }

      var body = el("div", "event-body");

      if (isFeatured) body.appendChild(el("span", "event-kicker", "Event spesial"));
      if (ev.tagline) body.appendChild(el("p", "event-tagline", ev.tagline));

      // Tanpa nama, tanggal yang naik jadi judul supaya kartu tidak
      // tampil tanpa kepala.
      body.appendChild(el("h3", null, ev.name || (d ? formatLong(d) : "Agenda")));

      if (ev.name && d) body.appendChild(el("p", "event-date", formatLong(d)));
      if (ev.caption) body.appendChild(elLinked("p", "event-caption", ev.caption));

      if (ev.lineup && ev.lineup.length) {
        var ul = el("ul", "event-lineup");
        ev.lineup.forEach(function (item) {
          ul.appendChild(elLinked("li", null, item));
        });
        body.appendChild(ul);
      }

      li.appendChild(body);
      return li;
    }

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    function isUpcoming(ev) {
      if (SHOW_PAST_EVENTS) return true;
      var d = parseDate(ev.date);
      return !d || d >= today;
    }

    var upcoming = EVENTS.filter(isUpcoming).sort(function (a, b) {
      var da = parseDate(a.date), db = parseDate(b.date);
      if (!da) return 1;   // event tanpa tanggal ditaruh paling bawah
      if (!db) return -1;
      return da - db;      // terdekat lebih dulu
    });

    // Featured selalu di paling atas, terlepas dari tanggalnya.
    if (FEATURED_EVENT && isUpcoming(FEATURED_EVENT)) {
      eventList.appendChild(buildCard(FEATURED_EVENT, true));
    }

    upcoming.forEach(function (ev) {
      eventList.appendChild(buildCard(ev, false));
    });

    // Tidak ada satupun agenda: sembunyikan seluruh section daripada
    // meninggalkan judul menggantung di atas ruang kosong.
    if (!eventList.children.length) {
      var section = document.getElementById("events");
      if (section) section.hidden = true;
    }
  }

  /* ===== Scroll reveal ===== */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window && revealEls.length && !prefersReduced) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var el = entry.target;
          var siblings = Array.prototype.slice.call(
            el.parentElement.querySelectorAll(".reveal")
          );
          var index = siblings.indexOf(el);
          var delay = index >= 0 ? Math.min(index, 5) * 80 : 0;

          window.setTimeout(function () {
            el.classList.add("is-visible");
          }, delay);

          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
