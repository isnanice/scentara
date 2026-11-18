import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { useBrands } from '../hooks/useMeta'
import { LoadingState, ErrorState } from '../components/common/StateBox.jsx'

export default function BrandsPage() {
  const { brands, loading, error, refetch } = useBrands()

  return (
    <div>
      <div className="page-head">
        <h1>Cari berdasarkan brand</h1>
        <p className="lede">Brand parfum lokal yang ada di katalog Scentara.</p>
      </div>

      {loading && brands.length === 0 && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {brands.length > 0 && (
        <ul className="brand-list">
          {brands.map((brand) => (
            <li key={brand.id} className="brand-row">
              <div className="brand-row__info">
                <h2>{brand.name}</h2>
                <p>{brand.description}</p>
              </div>
              <div className="brand-row__actions">
                <span className="brand-row__count">{brand.perfume_count} parfum</span>
                <Link to={`/katalog?brand=${brand.slug}`} className="btn btn--dark">
                  Lihat parfum
                </Link>
                {brand.website && (
                  <a className="btn btn--ghost" href={brand.website} target="_blank" rel="noreferrer">
                    Situs brand <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
