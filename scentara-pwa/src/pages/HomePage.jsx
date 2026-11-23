import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import { usePerfumes, usePerfumeById } from '../hooks/usePerfumes'
import { useBrands, useScentProfiles } from '../hooks/useMeta'
import PerfumeCard from '../components/perfume/PerfumeCard.jsx'
import NotePyramid from '../components/perfume/NotePyramid.jsx'
import ImageWithFallback from '../components/common/ImageWithFallback.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateBox.jsx'
import { pickOfTheDay, sortPerfumes } from '../utils/helpers'

const ITEMS_PER_PAGE = 9

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Nama A sampai Z' },
  { value: 'name_desc', label: 'Nama Z sampai A' },
  { value: 'price_asc', label: 'Harga terendah' },
  { value: 'price_desc', label: 'Harga tertinggi' },
]

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
  const [params, setParams] = useSearchParams()
  const brand = params.get('brand') ?? ''
  const scent = params.get('scent') ?? ''
  const q = params.get('q') ?? ''

  const [sortKey, setSortKey] = useState('name_asc')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Reset ke halaman 1 jika filter atau urutan diubah
  useEffect(() => {
    setCurrentPage(1)
  }, [brand, scent, q, sortKey])

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const { brands } = useBrands()
  const { scentProfiles } = useScentProfiles()
  const { perfumes, loading, error, refetch } = usePerfumes({ brand, scent, search: q })

  const sorted = useMemo(() => sortPerfumes(perfumes, sortKey), [perfumes, sortKey])
  const brandName = brands.find((b) => b.slug === brand)?.name ?? brand

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginatedPerfumes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return sorted.slice(start, start + ITEMS_PER_PAGE)
  }, [sorted, currentPage])

  const activeFilters = [
    brand && { key: 'brand', label: `Brand: ${brandName}` },
    scent && { key: 'scent', label: `Aroma: ${scent}` },
    q && { key: 'q', label: `Kata kunci: ${q}` },
  ].filter(Boolean)

  const daily = pickOfTheDay(perfumes)

  const handleScrollToKatalog = () => {
    const el = document.getElementById('katalog-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* 1. HERO BANNER & PARFUM PILIHAN HARI INI */}
      <section className="hero">
        <div className="hero__text">
          <h1>Kenali parfum dari lapisan aromanya</h1>
          <p>
            Scentara mengumpulkan parfum lokal beserta top, middle, dan base notes-nya, supaya kamu
            tahu apa yang tercium sebelum membeli.
          </p>
          <div className="hero__actions">
            <button type="button" onClick={handleScrollToKatalog} className="btn btn--light">
              Lihat katalog
            </button>
            <Link to="/notes" className="btn btn--outline-light">
              Jelajahi notes
            </Link>
          </div>
        </div>
        {daily && <PerfumeOfTheDay perfumeId={daily.id} />}
      </section>

      {/* 2. FITUR KATALOG LENGKAP DIPINDAHKAN KE BERANDA */}
      <section id="katalog-section" className="section catalog-home-section">
        <div className="section__head">
          <div>
            <h2 className="section__title">Katalog Parfum</h2>
            <p className="catalog-home-sub">
              Jelajahi seluruh koleksi parfum artisanal lokal dengan filter profil aroma, brand, dan piramida olfaktif.
            </p>
          </div>
        </div>

        <div className="catalog">
          <aside className={`filters-panel${filtersOpen ? ' is-open' : ''}`} aria-label="Filter parfum">
            <details open>
              <summary>Brand</summary>
              <ul className="filter-list">
                <li>
                  <label>
                    <input type="radio" name="brand" checked={brand === ''} onChange={() => setParam('brand', '')} />
                    Semua brand
                  </label>
                </li>
                {brands.map((b) => (
                  <li key={b.id}>
                    <label>
                      <input
                        type="radio"
                        name="brand"
                        checked={brand === b.slug}
                        onChange={() => setParam('brand', b.slug)}
                      />
                      {b.name}
                      <span className="filter-count">{b.perfume_count}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>

            <details open>
              <summary>Profil aroma</summary>
              <ul className="filter-list">
                <li>
                  <label>
                    <input type="radio" name="scent" checked={scent === ''} onChange={() => setParam('scent', '')} />
                    Semua profil
                  </label>
                </li>
                {scentProfiles.map((s) => (
                  <li key={s.name}>
                    <label>
                      <input
                        type="radio"
                        name="scent"
                        checked={scent === s.name}
                        onChange={() => setParam('scent', s.name)}
                      />
                      {s.name}
                      <span className="filter-count">{s.count}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          </aside>

          <section className="catalog__main">
            <div className="catalog__bar">
              <button
                type="button"
                className="btn btn--ghost btn--small filter-toggle"
                aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen((open) => !open)}
              >
                <SlidersHorizontal size={16} /> Filter
              </button>

              <p className="catalog__count" aria-live="polite">
                {loading && perfumes.length === 0
                  ? 'Memuat...'
                  : totalPages > 1
                  ? `Menampilkan ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      sorted.length,
                    )} dari ${sorted.length} parfum`
                  : `${sorted.length} parfum`}
              </p>

              <label className="sort">
                <span>Urutkan</span>
                <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {activeFilters.length > 0 && (
              <ul className="active-filters" aria-label="Filter aktif">
                {activeFilters.map((filter) => (
                  <li key={filter.key}>
                    <button type="button" onClick={() => setParam(filter.key, '')}>
                      {filter.label}
                      <X size={14} aria-label="Hapus filter" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {loading && perfumes.length === 0 && <LoadingState text="Memuat parfum..." />}
            {error && <ErrorState message={error} onRetry={refetch} />}

            {!loading && !error && sorted.length === 0 && (
              <EmptyState
                title="Tidak ada parfum yang cocok"
                text="Coba ganti kata kunci atau hapus salah satu filter."
                action={
                  activeFilters.length > 0 && (
                    <button type="button" className="btn btn--dark" onClick={() => setParams({}, { replace: true })}>
                      Hapus semua filter
                    </button>
                  )
                }
              />
            )}

            {sorted.length > 0 && (
              <>
                <ul className="card-grid">
                  {paginatedPerfumes.map((perfume) => (
                    <PerfumeCard key={perfume.id} perfume={perfume} />
                  ))}
                </ul>

                {/* PAGINASI: 9 PARFUM PER HALAMAN DENGAN SEBELUMNYA, 1, 2, SELANJUTNYA */}
                {totalPages > 1 && (
                  <nav className="pagination" aria-label="Navigasi halaman katalog">
                    <button
                      type="button"
                      className="btn btn--ghost btn--small pagination__btn"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1))
                        document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      aria-label="Halaman sebelumnya"
                    >
                      <ChevronLeft size={16} /> Sebelumnya
                    </button>

                    <div className="pagination__pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`pagination__page${page === currentPage ? ' is-active' : ''}`}
                          onClick={() => {
                            setCurrentPage(page)
                            document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          aria-current={page === currentPage ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="btn btn--ghost btn--small pagination__btn"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                        document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      aria-label="Halaman selanjutnya"
                    >
                      Selanjutnya <ChevronRight size={16} />
                    </button>
                  </nav>
                )}
              </>
            )}
          </section>
        </div>
      </section>
    </>
  )
}
