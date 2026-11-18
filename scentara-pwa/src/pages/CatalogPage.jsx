import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { usePerfumes } from '../hooks/usePerfumes'
import { useBrands, useScentProfiles } from '../hooks/useMeta'
import PerfumeCard from '../components/perfume/PerfumeCard.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateBox.jsx'
import { sortPerfumes } from '../utils/helpers'

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Nama A sampai Z' },
  { value: 'name_desc', label: 'Nama Z sampai A' },
  { value: 'price_asc', label: 'Harga terendah' },
  { value: 'price_desc', label: 'Harga tertinggi' },
]

export default function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const brand = params.get('brand') ?? ''
  const scent = params.get('scent') ?? ''
  const q = params.get('q') ?? ''

  const [sortKey, setSortKey] = useState('name_asc')
  const [filtersOpen, setFiltersOpen] = useState(false)

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

  const activeFilters = [
    brand && { key: 'brand', label: `Brand: ${brandName}` },
    scent && { key: 'scent', label: `Aroma: ${scent}` },
    q && { key: 'q', label: `Kata kunci: ${q}` },
  ].filter(Boolean)

  return (
    <div>
      <div className="page-head">
        <h1>Katalog parfum</h1>
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
              {loading && perfumes.length === 0 ? 'Memuat...' : `${sorted.length} parfum`}
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
            <ul className="card-grid">
              {sorted.map((perfume) => (
                <PerfumeCard key={perfume.id} perfume={perfume} />
              ))}
            </ul>
          )}

          <p className="page-foot">
            Mencari aroma dari bahan tertentu? <Link to="/notes">Lihat daftar notes</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
