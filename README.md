# Haisumbar.com

Portal media digital dan jurnalisme data **Haisumbar.com**.
Tagline: *Suara Kritis Arus Bawah Ranah Minang*.

Halaman beranda statis dengan tampilan responsif: versi mobile (di bawah 768px) dan desktop (768px ke atas).

## Struktur

```
haisumbar-web/
├── index.html          # Beranda (mobile + desktop)
└── assets/
    ├── logo-haisumbar.png
    ├── favicon.ico
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── icon-192.png
    └── icon-512.png
```

## Menjalankan secara lokal

Tidak ada build step. Buka `index.html` langsung di browser, atau jalankan server statis:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## Catatan

- Seluruh konten (judul berita, nama penulis, angka infografik, dan nomor registrasi Dewan Pers) masih **data dummy** dan perlu diganti dengan konten resmi.
- Foto dan thumbnail masih berupa placeholder abu-abu.
- Carousel headline bergerak otomatis dengan CSS (berganti setiap 3 detik); belum ada kontrol manual.
- Menu hamburger berfungsi dengan CSS saja (tanpa JavaScript).

## Palet warna

| Token | Nilai | Pemakaian |
|---|---|---|
| Primary Maroon | `#7C242C` | Header, headline, badge, tautan aktif |
| Maroon Dalam | `#5E1A21` | Blok sekunder, infografik |
| Accent Gold | `#CC9C44` | Badge data, aksen ikon, garis pemisah |
| Charcoal | `#242424` | Teks utama, bar atas, rubrik gelap |
| Surface | `#F7F6F4` | Latar belakang |
| Verified Green | `#047857` | Penanda berita terverifikasi |
| Alert Red | `#B91C1C` | Penanda hoaks dan breaking news |

Font: *Newsreader* (judul) dan *Inter* (UI dan teks), dimuat dari Google Fonts.

## Deploy ke GitHub Pages

1. Push folder ini ke repository GitHub.
2. Buka **Settings → Pages**.
3. Pilih **Deploy from a branch**, branch `main`, folder `/ (root)`.
