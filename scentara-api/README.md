# Scentara API

REST API untuk aplikasi Scentara. Hanya endpoint GET, karena data katalog dikelola lewat Supabase dan tabelnya dilindungi Row Level Security (anon key hanya boleh SELECT).

```
npm install
cp .env.example .env   # isi SUPABASE_URL dan SUPABASE_KEY
npm run dev
```

Struktur:

```
src/
  config/        koneksi Supabase
  models/        query ke database
  controllers/   mengolah request dan response
  routes/        pemetaan URL ke controller
  index.js       entry point Express
vercel.json      konfigurasi deploy Vercel
```
