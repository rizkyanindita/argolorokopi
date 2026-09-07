/* Template kredensial Supabase untuk fitur Giveaway.
   Salin berkas ini jadi "giveaway-config.js" (tanpa ".example") lalu
   isi dua nilai di bawah dari Supabase Dashboard → Project Settings → API.

   Pakai "anon public" key, BUKAN "service_role" — anon key memang
   dirancang untuk ditempel di kode browser, keamanannya datang dari
   Row Level Security (lihat supabase-giveaway-setup.sql), bukan dari
   menyembunyikan key ini.

   "giveaway-config.js" sengaja masuk .gitignore supaya kredensial tidak
   ikut ter-commit ke git — ini pengganti environment variable untuk
   situs statis tanpa build step. */
window.GIVEAWAY_SUPABASE_URL = "https://xxxxxxxxxxxx.supabase.co";
window.GIVEAWAY_SUPABASE_ANON_KEY = "isi-anon-key-di-sini";
