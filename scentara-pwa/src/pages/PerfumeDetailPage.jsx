import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { usePerfumeById } from '../hooks/usePerfumes'
import FavoriteButton from '../components/common/FavoriteButton.jsx'
import NotePyramid from '../components/perfume/NotePyramid.jsx'
import ReviewSection from '../components/review/ReviewSection.jsx'
import ImageWithFallback from '../components/common/ImageWithFallback.jsx'
import { LoadingState, ErrorState } from '../components/common/StateBox.jsx'
import { formatRupiah } from '../utils/helpers'

export default function PerfumeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { perfume, loading, error, refetch } = usePerfumeById(id)

  return (
    <div>
      <button
        type="button"
        className="back-link"
        onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/katalog'))}
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      {loading && <LoadingState text="Memuat detail parfum..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {perfume && (
        <>
          <section className="detail">
            <div className="detail__media">
              <ImageWithFallback src={perfume.image_url} alt={perfume.name} />
            </div>

            <div className="detail__info">
              <Link to={`/katalog?brand=${perfume.brands?.slug}`} className="detail__brand">
                {perfume.brands?.name}
              </Link>
              <h1>{perfume.name}</h1>
              <p className="detail__meta">{perfume.concentration}</p>
              <p className="detail__price">{formatRupiah(perfume.price)}</p>

              <ul className="chip-list" aria-label="Profil aroma">
                {perfume.scent_profiles?.map((profile) => (
                  <li key={profile}>
                    <Link
                      to={`/katalog?scent=${encodeURIComponent(profile)}`}
                      className="chip"
                    >
                      {profile}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="detail__desc">{perfume.description}</p>

              <div className="detail__actions">
                <FavoriteButton id={perfume.id} name={perfume.name} className="fav-btn--wide" />
                {perfume.source_url && (
                  <a className="btn btn--ghost" href={perfume.source_url} target="_blank" rel="noreferrer">
                    Lihat di situs brand <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </section>

          <section className="section">
            <h2 className="section__title">Piramida aroma</h2>
            <p className="section__sub">Ketuk salah satu note untuk melihat parfum lain yang memakainya.</p>
            <NotePyramid notes={perfume.notes} />
          </section>

          <ReviewSection perfumeId={perfume.id} />

          <p className="page-foot">
            Data notes dan harga diambil dari halaman produk brand dan bisa berubah sewaktu-waktu.
          </p>
        </>
      )}
    </div>
  )
}
