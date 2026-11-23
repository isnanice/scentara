import { Link } from 'react-router-dom'
import { useBrands } from '../hooks/useMeta'

export default function Footer() {
  const { brands } = useBrands()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <img src="/logo-lockup-on-dark.svg" alt="Scentara" width="187" height="40" />

        <p className="footer__disclaimer">
          Scentara adalah platform direktori dan arsip wewangian independen yang menyajikan
          katalog parfum lokal Indonesia. Seluruh nama brand, merek dagang, dan foto produk adalah
          hak milik dari masing-masing pemegang merek dan ditampilkan sebagai panduan kurasi serta referensi olfaktif.
        </p>

        <div className="footer__cols">
          <div>
            <h3>Jelajahi</h3>
            <ul>
              <li><Link to="/katalog">Katalog lengkap</Link></li>
              <li><Link to="/brand">Per brand</Link></li>
              <li><Link to="/aroma">Per profil aroma</Link></li>
              <li><Link to="/notes">Notes aroma</Link></li>
            </ul>
          </div>

          <div>
            <h3>Brand Pilihan</h3>
            <ul>
              {brands.map((brand) => (
                <li key={brand.id}>
                  <Link to={`/katalog?brand=${brand.slug}`}>{brand.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Informasi</h3>
            <ul>
              <li><Link to="/profile">Profile & Tentang</Link></li>
              <li><Link to="/favorit">Favorit saya</Link></li>
              <li><Link to="/katalog">Pencarian aroma</Link></li>
            </ul>
          </div>
        </div>

        <p className="footer__bottom">
          &copy; {new Date().getFullYear()} Scentara. Direktori & Arsip Olfaktif Parfum Indonesia.
        </p>
      </div>
    </footer>
  )
}
