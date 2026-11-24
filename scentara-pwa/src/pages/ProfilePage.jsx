import { Link } from 'react-router-dom'
import { ExternalLink, Layers, Compass, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react'
import { useBrands } from '../hooks/useMeta'
import ProfileSection from '../components/profile/ProfileSection.jsx'

export default function ProfilePage() {
  const { brands } = useBrands()

  return (
    <div className="profile-page">
      {/* 1. HEADER HALAMAN PROFIL (Standar Scentara: page-head & lede) */}
      <div className="page-head">
        <span className="page-head__badge">Preferensi Pengguna</span>
        <h1>Profil Saya</h1>
        <p className="lede">
          Kelola profil personal dan aroma favoritmu, serta telusuri direktori arsip dan arsitektur wewangian Scentara.
        </p>
      </div>

      {/* 2. BAGIAN UTAMA: CRUD KARTU PROFIL */}
      <ProfileSection />

      {/* 3. BAGIAN DIREKTORI & EDUKASI AROMA (ISI TENTANG SEBELUMNYA) */}
      <section className="section about-guide-section">
        <div className="section__head">
          <div>
            <span className="page-head__badge">Direktori Olfaktif Indonesia</span>
            <h2 className="section__title" style={{ marginTop: '10px' }}>Mengenal Seni & Arsitektur Aroma</h2>
            <p className="section__sub" style={{ marginTop: '8px' }}>
              Scentara adalah arsip dan katalog wewangian independen yang memetakan karya terbaik dari
              beragam rumah parfum artisanal lokal Indonesia.
            </p>
          </div>
        </div>

        {/* Visi Platform */}
        <section className="about-card">
          <div className="about-card__header">
            <Compass className="about-card__icon" size={24} aria-hidden="true" />
            <h2>Dedikasi untuk Wewangian Lokal</h2>
          </div>
          <p>
            Industri wewangian tanah air kini tengah mengalami lompatan kreativitas yang luar biasa.
            Beragam perfumer dan rumah wewangian independen melahirkan karya olfaktif berkualitas tinggi
            dengan konsep arsitektur aroma yang matang dan berkarakter kuat.
          </p>
          <p>
            Scentara hadir sebagai ruang panduan terpadu. Kami mendokumentasikan setiap rilisan parfum
            bukan sekadar sebagai produk kecantikan, melainkan sebagai sebuah karya seni olfaktif
            yang memiliki struktur, lapisan aroma, serta cerita di balik setiap semprotan.
          </p>
        </section>

        {/* Edukasi Piramida Notes */}
        <section className="about-card">
          <div className="about-card__header">
            <Layers className="about-card__icon" size={24} aria-hidden="true" />
            <h2>Memahami Tiga Lapisan Piramida Aroma</h2>
          </div>
          <p>
            Parfum adalah komposisi dinamis yang berevolusi di atas kulit seiring waktu. Scentara
            mengurai setiap parfum ke dalam tiga lapisan olfaktif untuk memudahkanmu membayangkan
            karakter wangi sebelum mencobanya:
          </p>

          <div className="pyramid-explain">
            <div className="pyramid-explain__item">
              <div className="pyramid-explain__badge pyramid-explain__badge--top">Top Notes</div>
              <h3>Lapisan Pembuka (15–30 Menit)</h3>
              <p>
                Molekul teringan yang pertama kali tercium saat parfum disemprotkan. Memberikan impresi
                pertama yang segar dan cerah, umumnya berupa aroma citrus, herbal segar, atau buah-buahan renyah.
              </p>
            </div>

            <div className="pyramid-explain__item">
              <div className="pyramid-explain__badge pyramid-explain__badge--mid">Heart / Middle Notes</div>
              <h3>Jantung Aroma (30 Menit – 4 Jam)</h3>
              <p>
                Inti kepribadian dari sebuah parfum yang merekah setelah lapisan pembuka menguap. Lapisan ini
                menentukan jati diri wewangian, biasanya didominasi oleh nuansa floral, rempah hangat, atau aromatik.
              </p>
            </div>

            <div className="pyramid-explain__item">
              <div className="pyramid-explain__badge pyramid-explain__badge--base">Base Notes</div>
              <h3>Pondasi Jejak Aroma (4–12+ Jam)</h3>
              <p>
                Molekul terberat yang mengikat seluruh racikan dan menempel paling lama di kulit. Memberikan
                kedalaman, kehangatan, dan jejak aroma (*sillage*), seperti kayu cendana, cedarwood, amber, vanilla, dan musk.
              </p>
            </div>
          </div>
        </section>

        {/* Fitur Utama Katalog */}
        <section className="about-card">
          <div className="about-card__header">
            <Sparkles className="about-card__icon" size={24} aria-hidden="true" />
            <h2>Eksplorasi di Scentara</h2>
          </div>
          <div className="feature-grid">
            <div className="feature-item">
              <h3>Dekomposisi Notes Terstruktur</h3>
              <p>
                Setiap parfum dilengkapi rincian piramida olfaktif resmi sehingga kamu tahu komposisi spesifik
                dari awal semprotan hingga aroma dasar.
              </p>
            </div>
            <div className="feature-item">
              <h3>Navigasi Profil Aroma</h3>
              <p>
                Temukan parfum berdasarkan nuansa dominan yang kamu sukai: Woody, Floral, Fresh, Citrus,
                Gourmand, Musky, hingga Amber.
              </p>
            </div>
            <div className="feature-item">
              <h3>Katalog Lintas Rumah Brand</h3>
              <p>
                Bandingkan konsentrasi (Extrait de Parfum vs Eau de Parfum) dan estimasi harga
                antar brand dalam satu format yang rapi.
              </p>
            </div>
            <div className="feature-item">
              <h3>Ulasan & Komunitas Pecinta Parfum</h3>
              <p>
                Baca dan bagikan pengalaman langsung mengenai performa wangi di kehidupan sehari-hari,
                daya tahan, dan daya sebar aroma.
              </p>
            </div>
          </div>
        </section>

        {/* Brand Terkurasi */}
        <section className="about-card">
          <div className="about-card__header">
            <MessageSquare className="about-card__icon" size={24} aria-hidden="true" />
            <h2>Rumah Wewangian Terkurasi</h2>
          </div>
          <p>
            Scentara terus memperluas kurasi dengan mendokumentasikan katalog wewangian dari berbagai rumah
            parfum terpercaya di Indonesia:
          </p>
          <div className="curated-brands">
            {brands.map((b) => (
              <div key={b.id} className="curated-brands__item">
                <div className="curated-brands__meta">
                  <h3>{b.name}</h3>
                  <p>{b.description || 'Rumah wewangian independen lokal dengan koleksi olfaktif khas.'}</p>
                </div>
                <div className="curated-brands__links">
                  <Link to={`/katalog?brand=${b.slug}`} className="btn btn--sm btn--outline">
                    Lihat Koleksi
                  </Link>
                  {b.website && (
                    <a href={b.website} target="_blank" rel="noreferrer" className="btn btn--sm btn--ghost">
                      Situs Resmi <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Independensi & Komitmen */}
        <section className="about-card about-card--accent">
          <div className="about-card__header">
            <ShieldCheck className="about-card__icon" size={24} aria-hidden="true" />
            <h2>Independensi & Standar Kurasi</h2>
          </div>
          <p>
            Scentara beroperasi murni sebagai platform kurasi, katalog, dan arsip wewangian independen.
            Scentara tidak melayani transaksi penjualan parfum langsung dan tidak terikat secara komersial
            dengan brand mana pun.
          </p>
          <p>
            Seluruh nama brand, merek dagang, formulasi notes, dan aset visual produk adalah hak cipta
            milik masing-masing rumah parfum terkait dan ditampilkan semata-mata sebagai referensi informasi
            edukasi bagi masyarakat pecinta wewangian Indonesia.
          </p>
        </section>
      </section>
    </div>
  )
}

