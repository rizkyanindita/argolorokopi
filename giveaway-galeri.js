(function () {
  "use strict";

  var grid = document.getElementById("gwGrid");
  if (!grid) return;

  var emptyState = document.getElementById("gwGalleryEmpty");
  var errorState = document.getElementById("gwGalleryError");

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function el(tag, cls, txt) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (txt) node.textContent = txt;
    return node;
  }

  function getSupabaseClient() {
    if (typeof window.supabase === "undefined" ||
        !window.GIVEAWAY_SUPABASE_URL || !window.GIVEAWAY_SUPABASE_ANON_KEY ||
        window.GIVEAWAY_SUPABASE_URL.indexOf("xxxxxxxxxxxx") !== -1) {
      return null;
    }
    return window.supabase.createClient(window.GIVEAWAY_SUPABASE_URL, window.GIVEAWAY_SUPABASE_ANON_KEY);
  }

  function renderFoto(entry) {
    // Hanya kolom aman yang diekspos oleh view "giveaway_gallery" di
    // Supabase: id, foto_url, instagram_username, created_at. Nomor
    // WhatsApp dan status tidak pernah sampai ke browser pengunjung.
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

    var label = el("span", "gwcard-label", "@" + entry.instagram_username);
    kartu.appendChild(label);

    return kartu;
  }

  var client = getSupabaseClient();
  if (!client) {
    if (errorState) errorState.hidden = false;
    return;
  }

  client
    .from("giveaway_gallery")
    .select("id, foto_url, instagram_username, created_at")
    .order("created_at", { ascending: false })
    .then(function (res) {
      if (res.error) throw res.error;
      var rows = res.data || [];
      if (!rows.length) {
        if (emptyState) emptyState.hidden = false;
        return;
      }
      var frag = document.createDocumentFragment();
      rows.forEach(function (entry) {
        frag.appendChild(renderFoto(entry));
      });
      grid.appendChild(frag);
    })
    .catch(function () {
      if (errorState) errorState.hidden = false;
    });
})();
