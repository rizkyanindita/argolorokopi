-- ============================================================
-- Argo Loro — setup Supabase untuk fitur Giveaway/UGC
-- Jalankan seluruh isi berkas ini di Supabase Dashboard →
-- SQL Editor → New query → Run. Aman dijalankan ulang (idempotent)
-- kecuali bagian "create table" (akan gagal kalau tabel sudah ada,
-- itu wajar, berarti sudah pernah dijalankan).
-- ============================================================

-- ---- Tabel utama ----
create table public.giveaway_entries (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  nama                text not null,
  nomor_wa            text not null,
  instagram_username  text not null,
  foto_url            text not null,
  consent_repost      boolean not null,
  status              text not null default 'pending'
                        check (status in ('pending', 'approved', 'rejected'))
);

create index giveaway_entries_status_idx on public.giveaway_entries (status);

alter table public.giveaway_entries enable row level security;

-- Publik (role "anon") boleh INSERT (submit form), tapi wajib status
-- 'pending' — jadi peserta tidak bisa mengirim baris yang langsung
-- berstatus 'approved' lewat request API buatan sendiri.
create policy "publik boleh daftar giveaway"
  on public.giveaway_entries
  for insert
  to anon
  with check (status = 'pending');

-- SENGAJA tidak ada policy SELECT di tabel ini untuk role anon.
-- Artinya publik tidak bisa membaca tabel ini sama sekali lewat API —
-- termasuk nomor WhatsApp peserta yang statusnya sudah approved.
-- Galeri publik membaca lewat VIEW terpisah di bawah, yang cuma
-- mengekspos kolom aman.

-- ---- View untuk galeri publik ----
-- View ini berjalan dengan hak akses pembuatnya (bukan si pengunjung),
-- jadi tetap bisa membaca tabel di atas walau anon tidak punya akses
-- langsung ke tabel itu. Filter "status = 'approved'" dan daftar kolom
-- di bawah inilah satu-satunya yang publik bisa lihat.
create view public.giveaway_gallery as
  select id, foto_url, instagram_username, created_at
  from public.giveaway_entries
  where status = 'approved';

grant select on public.giveaway_gallery to anon;

-- ---- Storage bucket untuk foto ----
insert into storage.buckets (id, name, public)
values ('giveaway-photos', 'giveaway-photos', true)
on conflict (id) do nothing;

-- Publik boleh upload foto (submit form)
create policy "publik boleh upload foto giveaway"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'giveaway-photos');

-- Publik boleh lihat foto (bucket sudah public, ini jaring pengaman tambahan)
create policy "publik boleh lihat foto giveaway"
  on storage.objects
  for select
  to anon
  using (bucket_id = 'giveaway-photos');

-- ============================================================
-- Setelah menjalankan berkas ini:
-- 1. Buka Project Settings → API, salin "Project URL" dan
--    kunci "anon public" (BUKAN "service_role" — jangan pernah
--    pakai service_role di kode yang jalan di browser).
-- 2. Tempel keduanya ke giveaway-config.js (lihat
--    giveaway-config.example.js untuk formatnya).
-- 3. Cara approve/reject foto ada di GIVEAWAY-MODERASI.md.
-- ============================================================
