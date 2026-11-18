# Scentara PWA

```
npm install
cp .env.example .env   # isi VITE_API_BASE_URL
npm run dev
```

Struktur (mengikuti pola praktikum PWA II):

```
public/
  brand/                 file logo asli (scentara-logo-gelap.svg, scentara-logo-transparan.svg)
  logo-*.svg             logo turunan untuk header, footer, dan halaman Tentang
  favicon.svg, icon-*.png  favicon dan ikon PWA (192, 512, maskable)
src/
  config/
    api.js               konfigurasi axios dan alamat API (.env)
  services/
    perfumeService.js    memanggil /api/perfumes
    noteService.js       memanggil /api/notes
    metaService.js       memanggil /api/brands dan /api/scent-profiles
  hooks/
    useAsync.js          pembantu status loading, error, data
    usePerfumes.js       usePerfumes, usePerfumeById
    useNotes.js          useNotes, useNoteById, useNoteCategories
    useMeta.js           useBrands, useScentProfiles
    useFavorites.js      favorit tersimpan di localStorage
  pages/                 satu file per layar (Home, Catalog, PerfumeDetail, Brands, ScentProfiles, Notes, NoteDetail, Favorites, About)
  components/
    common/              komponen umum (ChipGroup, SearchBox, StateBox, FavoriteButton, ImageWithFallback)
    perfume/             komponen khusus parfum (PerfumeCard, NotePyramid)
    Header.jsx, BottomNav.jsx, Footer.jsx, PWABadge.jsx, ScrollToTop.jsx
  utils/
    helpers.js           fungsi bantu (format harga, warna, pilihan hari ini)
  data/
    profile.js           data profil pembuat
  App.jsx                daftar route
  main.jsx               entry point
  index.css              token warna dan gaya dasar
  App.css                gaya komponen dan halaman
vite.config.js           konfigurasi vite-plugin-pwa (manifest, service worker)
vercel.json              rewrite agar route React Router berfungsi di Vercel
```
