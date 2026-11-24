import { useEffect, useMemo, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { usePerfumes } from '../hooks/usePerfumes'
import { useBrands, useScentProfiles } from '../hooks/useMeta'
import PerfumeCard from '../components/perfume/PerfumeCard.jsx'
import CustomDropdown from '../components/common/CustomDropdown.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateBox.jsx'
import { sortPerfumes } from '../utils/helpers'

const ITEMS_PER_PAGE = 10

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Nama A sampai Z' },
  { value: 'name_desc', label: 'Nama Z sampai A' },
  { value: 'price_asc', label: 'Harga terendah' },
  { value: 'price_desc', label: 'Harga tertinggi' },
]

/* ikon filter SVG ala Shopee (funnel + sparkle) */
function FilterIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h12l-5 6.5v7l-2-1v-6z" />
      <path d="M19 2v4M17 4h4" strokeWidth="1.5" />
    </svg>
  )
}

export default function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const brand = params.get('brand') ?? ''
  const scent = params.get('scent') ?? ''
  const q = params.get('q') ?? ''

  const [sortKey, setSortKey] = useState('name_asc')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  /* draft filter */
  const [draftBrand, setDraftBrand] = useState(brand)
  const [draftScent, setDraftScent] = useState(scent)

  useEffect(() => { setDraftBrand(brand) }, [brand])
  useEffect(() => { setDraftScent(scent) }, [scent])
  useEffect(() => { setCurrentPage(1) }, [brand, scent, q, sortKey])

  // lock body scroll saat drawer terbuka
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const applyFilters = useCallback(() => {
    const next = new URLSearchParams(params)
    if (draftBrand) next.set('brand', draftBrand); else next.delete('brand')
    if (draftScent) next.set('scent', draftScent); else next.delete('scent')
    setParams(next, { replace: true })
    setDrawerOpen(false)
  }, [draftBrand, draftScent, params, setParams])

  const resetFilters = useCallback(() => {
    setDraftBrand('')
    setDraftScent('')
  }, [])

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

  const hasActiveDrawerFilters = draftBrand || draftScent

  return (
    <div>
      <div className="page-head">
        <h1>Katalog parfum</h1>
      </div>

      {/* TOOLBAR: jumlah | urutkan | filter icon */}
      <div className="catalog-toolbar">
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

        <div className="catalog-toolbar__right">
          <CustomDropdown
            value={sortKey}
            onChange={setSortKey}
            options={SORT_OPTIONS}
            labelPrefix="Urutkan:"
            placeholder="Urutkan"
            alwaysPlaceholder
            minWidth="140px"
          />

          <button
            type="button"
            className={`filter-icon-btn${activeFilters.some(f => f.key === 'brand' || f.key === 'scent') ? ' has-filter' : ''}`}
            onClick={() => setDrawerOpen(true)}
            aria-label="Buka filter"
          >
            <FilterIcon size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* ACTIVE FILTER PILLS */}
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

      {/* CONTENT */}
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
          <ul className="card-grid" style={{ marginTop: 24 }}>
            {paginatedPerfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
          </ul>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Navigasi halaman katalog">
              <button
                type="button"
                className="btn btn--ghost btn--small pagination__btn"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1))
                  window.scrollTo({ top: 0, behavior: 'smooth' })
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
                      window.scrollTo({ top: 0, behavior: 'smooth' })
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
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                aria-label="Halaman selanjutnya"
              >
                Selanjutnya <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </>
      )}

      <p className="page-foot">
        Mencari aroma dari bahan tertentu? <Link to="/notes">Lihat daftar notes</Link>.
      </p>

      {/* FILTER DRAWER (slide dari kanan seperti Shopee) */}
      {drawerOpen && (
        <div className="filter-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <aside
            className="filter-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Filter parfum"
          >
            {/* Header */}
            <div className="filter-drawer__head">
              <h3>Filter</h3>
              <button type="button" className="filter-drawer__close" onClick={() => setDrawerOpen(false)} aria-label="Tutup filter">
                <X size={20} />
              </button>
            </div>

            {/* Body: scrollable */}
            <div className="filter-drawer__body">
              {/* Brand */}
              <div className="filter-drawer__section">
                <h4 className="filter-drawer__label">Brand</h4>
                <div className="filter-drawer__chips">
                  <button
                    type="button"
                    className={`filter-chip${draftBrand === '' ? ' is-active' : ''}`}
                    onClick={() => setDraftBrand('')}
                  >
                    Semua
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`filter-chip${draftBrand === b.slug ? ' is-active' : ''}`}
                      onClick={() => setDraftBrand(b.slug)}
                    >
                      {b.name}
                      <span className="filter-chip__count">{b.perfume_count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Profil Aroma */}
              <div className="filter-drawer__section">
                <h4 className="filter-drawer__label">Profil Aroma</h4>
                <div className="filter-drawer__chips">
                  <button
                    type="button"
                    className={`filter-chip${draftScent === '' ? ' is-active' : ''}`}
                    onClick={() => setDraftScent('')}
                  >
                    Semua
                  </button>
                  {scentProfiles.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      className={`filter-chip${draftScent === s.name ? ' is-active' : ''}`}
                      onClick={() => setDraftScent(s.name)}
                    >
                      {s.name}
                      <span className="filter-chip__count">{s.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="filter-drawer__foot">
              <button
                type="button"
                className="btn btn--ghost filter-drawer__reset"
                onClick={resetFilters}
                disabled={!hasActiveDrawerFilters}
              >
                Atur Ulang
              </button>
              <button type="button" className="btn btn--dark filter-drawer__apply" onClick={applyFilters}>
                Terapkan
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
