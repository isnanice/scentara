import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useScentProfiles } from '../hooks/useMeta'
import { LoadingState, ErrorState } from '../components/common/StateBox.jsx'

// Penjelasan singkat tiap profil aroma, ditampilkan di bawah namanya.
const SCENT_HINTS = {
  Amber: 'Hangat, manis, dan sedikit berbedak.',
  Citrus: 'Segar, cerah, dan ringan.',
  Floral: 'Aroma bunga yang lembut.',
  Fresh: 'Bersih seperti udara dan kain.',
  Fruity: 'Manis dan berair seperti buah.',
  Green: 'Seperti daun, teh, dan rumput.',
  Musky: 'Lembut dan dekat dengan kulit.',
  Sweet: 'Manis seperti vanilla dan permen.',
  Spicy: 'Hangat dengan sentuhan rempah.',
  Woody: 'Kering, tenang, dan membumi.',
}

export default function ScentProfilesPage() {
  const { scentProfiles, loading, error, refetch } = useScentProfiles()

  return (
    <div>
      <div className="page-head">
        <h1>Cari berdasarkan profil aroma</h1>
        <p className="lede">Pilih karakter aroma yang kamu suka, lalu lihat parfum yang cocok.</p>
      </div>

      {loading && scentProfiles.length === 0 && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {scentProfiles.length > 0 && (
        <ul className="scent-grid">
          {scentProfiles.map((scent) => (
            <li key={scent.name}>
              <Link to={`/katalog?scent=${encodeURIComponent(scent.name)}`} className="scent-card">
                <span className="scent-card__name">{scent.name}</span>
                <span className="scent-card__hint">{SCENT_HINTS[scent.name] ?? 'Lihat parfum dengan profil ini.'}</span>
                <span className="scent-card__foot">
                  {scent.count} parfum
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
