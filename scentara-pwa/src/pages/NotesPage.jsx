import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, X, Sparkles } from 'lucide-react'
import { useNotes, useNoteCategories } from '../hooks/useNotes'
import CategoryDropdown from '../components/common/CategoryDropdown.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateBox.jsx'

export default function NotesPage() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? ''
  const q = params.get('q') ?? ''
  const [search, setSearch] = useState(q)

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const handleClearAll = () => {
    setSearch('')
    const next = new URLSearchParams(params)
    next.delete('category')
    next.delete('q')
    setParams(next, { replace: true })
  }

  useEffect(() => {
    if (search === q) return
    const timer = setTimeout(() => setParam('q', search.trim()), 350)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const { categories } = useNoteCategories()
  const { notes, loading, error, refetch } = useNotes({ category, search: q })

  const hasActiveFilters = Boolean(category || q)

  return (
    <div className="notes-page">
      <div className="page-head">
        <span className="page-head__badge">Ensiklopedia Olfaktif</span>
        <h1>Notes Aroma</h1>
        <p className="lede">
          Notes adalah bahan dan molekul esensial penyusun piramida aroma parfum. Jelajahi karakter tiap
          bahan dan temukan parfum lokal yang menggunakannya.
        </p>
      </div>

      {/* TOOLBAR PENCARIAN MEMANJANG & DROPDOWN KATEGORI */}
      <div className="notes-toolbar">
        <div className="notes-search">
          <Search size={19} className="notes-search__icon" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama note aroma (misal: Bergamot, Rose, Cedarwood, Vanilla, Musk)..."
            aria-label="Cari nama note aroma"
            className="notes-search__input"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setParam('q', '')
              }}
              className="notes-search__clear"
              aria-label="Hapus teks pencarian"
              title="Hapus pencarian"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <CategoryDropdown
          value={category}
          onChange={(val) => setParam('category', val)}
          categories={categories}
        />
      </div>

      {/* FILTER AKTIF CHIPS */}
      {hasActiveFilters && (
        <div className="active-notes-filters">
          <span className="active-notes-filters__label">Filter aktif:</span>

          {category && (
            <button
              type="button"
              className="active-filter-pill"
              onClick={() => setParam('category', '')}
              title="Hapus filter kategori"
            >
              Kategori: <strong>{category}</strong> <X size={13} />
            </button>
          )}

          {q && (
            <button
              type="button"
              className="active-filter-pill"
              onClick={() => {
                setSearch('')
                setParam('q', '')
              }}
              title="Hapus filter pencarian"
            >
              Kata kunci: <strong>"{q}"</strong> <X size={13} />
            </button>
          )}

          <button
            type="button"
            className="active-filter-reset"
            onClick={handleClearAll}
          >
            Reset Semua
          </button>
        </div>
      )}

      {loading && notes.length === 0 && <LoadingState text="Memuat notes..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && notes.length === 0 && (
        <EmptyState
          title="Note tidak ditemukan"
          text="Tidak ada note yang cocok dengan kriteria pencarian Anda. Coba kata kunci lain atau pilih Semua Kategori."
        />
      )}

      {notes.length > 0 && (
        <>
          <div className="notes-header-meta">
            <p className="result-count">
              Menampilkan <strong>{notes.length}</strong> notes aroma
              {category && <span> dalam kategori <strong>{category}</strong></span>}
            </p>
          </div>

          <ul className="note-grid">
            {notes.map((note) => (
              <li key={note.id} className="note-card">
                <span className="chip chip--static">{note.category}</span>
                <h3 className="note-card__name">
                  <Link to={`/notes/${note.id}`} className="stretched-link">
                    {note.name}
                  </Link>
                </h3>
                <p className="note-card__desc">{note.description}</p>
                <p className="note-card__count">
                  <Sparkles size={13} /> Digunakan pada {note.perfume_count} parfum
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
