import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useNoteById } from '../hooks/useNotes'
import PerfumeCard from '../components/perfume/PerfumeCard.jsx'
import { LoadingState, ErrorState } from '../components/common/StateBox.jsx'

const LAYER_LABEL = { top: 'Top', middle: 'Middle', base: 'Base' }

export default function NoteDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { note, loading, error, refetch } = useNoteById(id)

  return (
    <div>
      <button
        type="button"
        className="back-link"
        onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/notes'))}
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      {loading && <LoadingState text="Memuat note..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {note && (
        <>
          <div className="note-hero">
            <span className="note-hero__cat">{note.category}</span>
            <h1>{note.name}</h1>
            <p>{note.description}</p>
          </div>

          <section className="section">
            <h2 className="section__title">Parfum dengan {note.name}</h2>
            {note.perfumes.length === 0 ? (
              <p className="lede">Belum ada parfum di katalog yang memakai note ini.</p>
            ) : (
              <ul className="card-grid">
                {note.perfumes.map((perfume) => (
                  <PerfumeCard
                    key={`${perfume.id}-${perfume.layer}`}
                    perfume={perfume}
                    layer={LAYER_LABEL[perfume.layer]}
                  />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
