# Haisumbar

Situs berita statis dengan admin Decap CMS, siap di-deploy ke Cloudflare Pages.

## Isi folder
- index.html, artikel.html: beranda dan halaman artikel
- assets/: CSS dan JavaScript
- data/: berita, opini, dan iklan dalam format JSON (diubah lewat admin)
- admin/: halaman login redaksi dan konfigurasi Decap (config.yml)
- images/uploads/: gambar yang diunggah redaksi

## Langkah deploy
1. Buat repositori GitHub baru (misalnya haisumbar) dan unggah seluruh isi folder ini ke branch main.
2. Di admin/config.yml, ganti USERNAME/haisumbar dengan nama repositori Anda.
3. Di Cloudflare: Workers & Pages > Create > Pages > Connect to Git. Pilih repositori, kosongkan build command, dan isi output directory dengan "/" (root). Klik Save and deploy.
4. Buat OAuth App di GitHub (Settings > Developer settings). Deploy proxy OAuth (misalnya Cloudflare Worker dari proyek Decap), lalu isi base_url di config.yml dengan URL Worker tersebut.
5. Undang anggota redaksi sebagai collaborator di repositori GitHub. Editorial workflow membutuhkan akses ini.
6. Buka /admin di situs Anda untuk mulai menulis.

## Catatan
- Versi Decap di admin/index.html memakai rentang ^3.0.0. Untuk produksi, pin ke versi tertentu setelah memeriksa rilis terbaru.
- Isi kode iklan dimasukkan apa adanya ke halaman. Hanya admin tepercaya yang boleh mengeditnya.
- Teks di bagian isi berita ditampilkan sebagai teks biasa, dengan baris baru dipertahankan.
