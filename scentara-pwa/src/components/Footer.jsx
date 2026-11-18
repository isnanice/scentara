import { Link } from 'react-router-dom'
import { useBrands } from '../hooks/useMeta'
import { PROFILE } from '../data/profile'

export default function Footer() {
  const { brands } = useBrands()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <img src="/logo-lockup-on-dark.svg" alt="Scentara" width="187" height="40" />

        <p className="footer__disclaimer">
          Scentara adalah proyek Tugas Akhir praktikum dan bukan toko online. Scentara tidak menjual
          parfum dan tidak berafiliasi dengan brand mana pun. Nama brand, merek dagang, dan foto produk
          adalah milik pemiliknya masing-masing dan hanya dipakai untuk identifikasi.
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
            <h3>Brand</h3>
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
              <li><Link to="/tentang">Tentang Scentara</Link></li>
              <li><Link to="/favorit">Favorit saya</Link></li>
              <li>
                <a href={PROFILE.github} target="_blank" rel="noreferrer">
                  Source code
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3>Pembuat</h3>
            <ul>
              <li>{PROFILE.name}</li>
              <li>{PROFILE.nim}</li>
              <li>Teknik Komputer UNDIP</li>
            </ul>
          </div>
        </div>

        <p className="footer__bottom">
          2026 Scentara. Tugas Akhir Praktikum Pemrograman Perangkat Bergerak.
        </p>
      </div>
    </footer>
  )
}
