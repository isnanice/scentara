# Scentara: Katalog Parfum dan Notes Aroma

Tugas Akhir Praktikum Pemrograman Perangkat Bergerak 2026 (platform PWA, JavaScript).

Isi proyek:

| Folder | Fungsi |
| --- | --- |
| `scentara-api/` | REST API (Node.js, Express, Supabase) dengan struktur model, controller, routes seperti Modul 1 |
| `scentara-pwa/` | Aplikasi PWA (React, Vite, vite-plugin-pwa) yang memakai API di atas |

Skema database dan data awal (SQL) dikirim terpisah di chat. Jalankan di Supabase SQL Editor.

## Cara menjalankan

1. Buat project Supabase, buka SQL Editor, jalankan skema dan data SQL.
2. API:
   ```
   cd scentara-api
   npm install
   ```
   Salin `.env.example` menjadi `.env`, isi `SUPABASE_URL` dan `SUPABASE_KEY` (anon public key), lalu `npm run dev`.
   Cek `http://localhost:3000/api/perfumes` di browser atau Postman.
3. PWA:
   ```
   cd scentara-pwa
   npm install
   ```
   Salin `.env.example` menjadi `.env` (isi `VITE_API_BASE_URL` dengan alamat API), lalu `npm run dev`.
4. Edit `scentara-pwa/src/data/profile.js` untuk memastikan nama, NIM, dan link GitHub benar.

## Deploy (Vercel)

- API: push `scentara-api` ke repository GitHub, import di Vercel, isi Environment Variables `SUPABASE_URL` dan `SUPABASE_KEY`.
- PWA: push `scentara-pwa` ke repository GitHub, import di Vercel (preset Vite), isi `VITE_API_BASE_URL` dengan URL API dari Vercel (tanpa garis miring di akhir).
- Untuk mengecek fitur PWA secara lokal: `npm run build` lalu `npm run preview`, kemudian buka DevTools, tab Application.

## Endpoint API

| Method | Path | Keterangan |
| --- | --- | --- |
| GET | `/api/perfumes?brand=&scent=&search=` | Daftar parfum, bisa difilter brand (slug), profil aroma, dan nama |
| GET | `/api/perfumes/:id` | Detail parfum beserta piramida notes |
| GET | `/api/notes?category=&search=` | Daftar notes beserta jumlah parfum yang memakainya |
| GET | `/api/notes/categories` | Kategori notes |
| GET | `/api/notes/:id` | Detail note beserta parfum yang memakainya |
| GET | `/api/brands` | Daftar brand |
| GET | `/api/scent-profiles` | Profil aroma beserta jumlah parfum |


