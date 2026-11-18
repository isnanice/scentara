import { ExternalLink } from 'lucide-react'

const SOURCES = [
  { name: 'Alchemist Fragrance', url: 'https://alchemistfragrance.com' },
  { name: 'SAFF & Co.', url: 'https://saffnco.com' },
  { name: 'Crusita', url: 'https://crusita.com' },
  { name: 'LAYR Fragrance', url: 'https://layrfragrance.com' },
]

export default function AboutPage() {
  return (
    <div>
      <div className="page-head">
        <img src="/logo-on-light.svg" alt="Scentara" className="about-logo" width="236" height="131" />
        <h1>Tentang Scentara</h1>
        <p className="lede">
          Scentara adalah katalog parfum lokal Indonesia yang menampilkan notes aroma dalam bentuk
          piramida olfaktif — memudahkanmu menjelajahi dan membandingkan karakter wangi dari berbagai brand.
        </p>
      </div>

      <section className="about-card">
        <h2>Apa itu Scentara?</h2>
        <p>
          Scentara hadir untuk membantu pecinta parfum menemukan wangi yang cocok. Lewat katalog
          interaktif, kamu bisa melihat komposisi notes (top, middle, base), membandingkan profil
          aroma antar parfum, dan menyimpan favorit — semua dalam satu tempat.
        </p>
        <p>
          Scentara bukan toko online dan tidak menjual parfum. Scentara juga tidak berafiliasi dengan
          brand mana pun. Nama brand, merek dagang, dan foto produk adalah milik pemiliknya
          masing-masing dan hanya digunakan untuk keperluan identifikasi produk.
        </p>
      </section>

      <section className="about-card">
        <h2>Sumber data</h2>
        <p>
          Nama parfum, notes, harga, dan foto diambil dari halaman produk resmi brand berikut. Deskripsi
          ditulis ulang, dan profil aroma dikelompokkan dari notes serta karakter yang ditulis brand.
          Harga bisa berubah, jadi cek situs brand sebelum membeli.
        </p>
        <ul className="source-list">
          {SOURCES.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-card">
        <h2>Teknologi</h2>
        <p>
          Dibangun dengan React dan Vite untuk antarmuka yang cepat, React Router untuk navigasi,
          serta PWA-ready sehingga bisa diakses secara offline. Data disediakan oleh REST API
          Express dengan database Supabase (PostgreSQL).
        </p>
      </section>
    </div>
  )
}
