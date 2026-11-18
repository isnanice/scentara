import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { usePerfumes } from '../hooks/usePerfumes'
import { useFavorites } from '../hooks/useFavorites'
import PerfumeCard from '../components/perfume/PerfumeCard.jsx'
import { LoadingState, ErrorState } from '../components/common/StateBox.jsx'

export default function FavoritesPage() {
  const { ids } = useFavorites()
  const { perfumes, loading, error, refetch } = usePerfumes()

  const saved = perfumes.filter((perfume) => ids.includes(perfume.id))

  return (
    <div>
      <div className="page-head">
        <h1>Favorit</h1>
        <p className="lede">Parfum yang kamu simpan. Daftar ini tersimpan di perangkat ini.</p>
      </div>

      {loading && perfumes.length === 0 && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && saved.length === 0 && (
        <div className="state-box">
          <Heart size={26} />
          <h3>Belum ada favorit</h3>
          <p>Ketuk ikon hati pada parfum untuk menyimpannya di sini.</p>
          <Link to="/katalog" className="btn btn--primary">
            Buka katalog
          </Link>
        </div>
      )}

      {saved.length > 0 && (
        <>
          <p className="result-count">{saved.length} parfum tersimpan</p>
          <ul className="card-grid">
            {saved.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
