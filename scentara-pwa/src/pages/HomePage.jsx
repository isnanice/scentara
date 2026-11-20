import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { usePerfumes, usePerfumeById } from '../hooks/usePerfumes'
import { useBrands, useScentProfiles } from '../hooks/useMeta'
import PerfumeCard from '../components/perfume/PerfumeCard.jsx'
import NotePyramid from '../components/perfume/NotePyramid.jsx'
import ImageWithFallback from '../components/common/ImageWithFallback.jsx'
import { LoadingState, ErrorState } from '../components/common/StateBox.jsx'
import { pickOfTheDay } from '../utils/helpers'

function PerfumeOfTheDay({ perfumeId }) {
  const { perfume } = usePerfumeById(perfumeId)
  if (!perfume) return <div className="daily daily--empty" aria-hidden="true" />

  return (
    <article className="daily">
      <p className="daily__label">Parfum pilihan hari ini</p>
      <div className="daily__head">
        <div className="daily__img">
          <ImageWithFallback src={perfume.image_url} alt={perfume.name} />
        </div>
        <div>
          <p className="daily__brand">{perfume.brands?.name}</p>
          <h2 className="daily__name">
            <Link to={`/parfum/${perfume.id}`}>{perfume.name}</Link>
          </h2>
        </div>
      </div>
      <NotePyramid notes={perfume.notes} compact />
    </article>
  )
}

export default function HomePage() {
  const { perfumes, loading: perfumesLoading, error: perfumesError, refetch: refetchPerfumes } = usePerfumes()
  const { brands, loading: brandsLoading, error: brandsError, refetch: refetchBrands } = useBrands()
  const { scentProfiles, loading: scentsLoading, error: scentsError, refetch: refetchScents } = useScentProfiles()
  const daily = pickOfTheDay(perfumes)

  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <h1>Kenali parfum dari lapisan aromanya</h1>
          <p>
            Scentara mengumpulkan parfum lokal beserta top, middle, dan base notes-nya, supaya kamu
            tahu apa yang tercium sebelum membeli.
          </p>
          <div className="hero__actions">
            <Link to="/katalog" className="btn btn--light">
              Lihat katalog
            </Link>
            <Link to="/notes" className="btn btn--outline-light">
              Jelajahi notes
            </Link>
          </div>
        </div>
        {daily && <PerfumeOfTheDay perfumeId={daily.id} />}
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Cari berdasarkan profil aroma</h2>
          <Link to="/aroma" className="text-link">
            Lihat semua
          </Link>
        </div>
        {scentsLoading && scentProfiles.length === 0 && <LoadingState />}
        {scentsError && <ErrorState message={scentsError} onRetry={refetchScents} />}
        {scentProfiles.length > 0 && (
          <ul className="tile-grid">
            {scentProfiles.map((scent) => (
              <li key={scent.name}>
                <Link to={`/katalog?scent=${encodeURIComponent(scent.name)}`} className="tile">
                  <span className="tile__name">{scent.name}</span>
                  <span className="tile__count">{scent.count} parfum</span>
                  <ArrowUpRight size={18} className="tile__icon" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Cari berdasarkan brand</h2>
          <Link to="/brand" className="text-link">
            Lihat semua
          </Link>
        </div>
        {brandsLoading && brands.length === 0 && <LoadingState />}
        {brandsError && <ErrorState message={brandsError} onRetry={refetchBrands} />}
        {brands.length > 0 && (
          <ul className="brand-grid">
            {brands.map((brand) => (
              <li key={brand.id}>
                <Link to={`/katalog?brand=${brand.slug}`} className="brand-card">
                  <span className="brand-card__name">{brand.name}</span>
                  <span className="brand-card__desc">{brand.description}</span>
                  <span className="brand-card__count">{brand.perfume_count} parfum</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Koleksi parfum</h2>
          <Link to="/katalog" className="text-link">
            {perfumes.length > 5 ? `Lihat semua (${perfumes.length})` : 'Katalog lengkap'}
          </Link>
        </div>
        {perfumesLoading && perfumes.length === 0 && <LoadingState />}
        {perfumesError && <ErrorState message={perfumesError} onRetry={refetchPerfumes} />}
        {perfumes.length > 0 && (
          <>
            <ul className="card-grid card-grid--home">
              {perfumes.slice(0, 5).map((perfume) => (
                <PerfumeCard key={perfume.id} perfume={perfume} />
              ))}
            </ul>

            {perfumes.length > 5 && (
              <div className="section__foot">
                <Link to="/katalog" className="btn btn--ghost btn--more">
                  Lihat {perfumes.length - 5} parfum lainnya di katalog &rarr;
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
