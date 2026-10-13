# Mengaktifkan CMS Haisumbar.com (/admin)

Panel admin memakai Decap CMS. Supaya redaksi bisa login dengan akun GitHub,
dibutuhkan satu jembatan kecil (Cloudflare Worker) — file `worker.js` di folder ini.
Urutan pengerjaan (langkah 1–3 dikerjakan pemilik akun, langkah 4 oleh Anfield):

## Prasyarat
Situs sudah deploy di Cloudflare Pages dari repo ini dan domain **haisumbar.com**
sudah terpasang, sehingga `haisumbar.com/admin` membuka halaman login Decap.

## 1. Buat Cloudflare Worker
1. Dashboard Cloudflare → **Workers & Pages → Create → Worker**.
2. Beri nama, misalnya `haisumbar-oauth` → **Deploy**.
3. **Edit code** → hapus isi bawaan → tempel seluruh isi `worker.js` → **Deploy**.
4. Catat alamatnya, bentuknya: `https://haisumbar-oauth.<subdomain>.workers.dev`

## 2. Buat GitHub OAuth App (akun haisumbardotcom-ux)
1. GitHub → foto profil → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Isi:
   - Application name: `Haisumbar CMS`
   - Homepage URL: `https://haisumbar.com`
   - Authorization callback URL: `https://haisumbar-oauth.<subdomain>.workers.dev/callback`
     (samakan persis dengan alamat Worker langkah 1 + `/callback`)
3. **Register application** → catat **Client ID**, lalu **Generate a new client secret**.

## 3. Isi variabel Worker
1. Dashboard Cloudflare → Worker `haisumbar-oauth` → **Settings → Variables and Secrets**.
2. Tambahkan:
   - `OAUTH_GITHUB_CLIENT_ID` = Client ID dari langkah 2 (tipe: Text)
   - `OAUTH_GITHUB_CLIENT_SECRET` = Client Secret dari langkah 2 (tipe: **Secret**)
   
   Client Secret adalah kata sandi aplikasi — ketik langsung di Cloudflare,
   jangan pernah dikirim lewat chat/email.

## 4. Sambungkan ke konfigurasi CMS
Kabari Anfield alamat Worker-nya (langkah 1). Anfield mengisi `base_url`
di `admin/config.yml` lalu push. Setelah itu buka `https://haisumbar.com/admin`,
klik **Login with GitHub**, dan CMS siap dipakai:
menulis berita lewat CMS otomatis mengubah `data/berita.json` di repo,
Cloudflare Pages men-deploy ulang, dan beranda menampilkannya.

## Catatan
- Siapa pun yang boleh menulis harus punya akses tulis (collaborator) ke repo
  `haisumbardotcom-ux/Haisumbar-website` — login CMS memakai akun GitHub masing-masing.
- `publish_mode: editorial_workflow` aktif: berita baru masuk sebagai draf
  (Draft → In Review → Ready) sebelum terbit.
