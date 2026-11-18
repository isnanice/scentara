import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useNotes, useNoteCategories } from '../hooks/useNotes'
import ChipGroup from '../components/common/ChipGroup.jsx'
import SearchBox from '../components/common/SearchBox.jsx'
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

  useEffect(() => {
    if (search === q) return
    const timer = setTimeout(() => setParam('q', search.trim()), 350)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const { categories } = useNoteCategories()
  const { notes, loading, error, refetch } = useNotes({ category, search: q })

  return (
    <div>
      <div className="page-head">
        <h1>Notes aroma</h1>
        <p className="lede">
          Notes adalah bahan penyusun aroma parfum. Pilih satu note untuk melihat parfum yang
          memakainya.
        </p>
      </div>

      <div className="filters">
        <SearchBox value={search} onChange={setSearch} label="Cari nama note" placeholder="Cari nama note" />
        <ChipGroup
          label="Filter kategori note"
          value={category}
          onChange={(v) => setParam('category', v)}
          allLabel="Semua kategori"
          options={categories.map((c) => ({ value: c.name, label: c.name }))}
        />
      </div>

      {loading && notes.length === 0 && <LoadingState text="Memuat notes..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && notes.length === 0 && (
        <EmptyState title="Note tidak ditemukan" text="Coba kata kunci lain atau ganti kategori." />
      )}

      {notes.length > 0 && (
        <>
          <p className="result-count">{notes.length} notes</p>
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
                <p className="note-card__count">Dipakai di {note.perfume_count} parfum</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
