import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="state-box">
      <h1>Halaman tidak ditemukan</h1>
      <p>Alamat yang kamu buka tidak ada di Scentara.</p>
      <Link to="/" className="btn btn--primary">
        Ke beranda
      </Link>
    </div>
  )
}
