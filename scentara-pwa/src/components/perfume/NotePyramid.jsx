import { Link } from 'react-router-dom'

const LAYERS = [
  { key: 'top', title: 'Top notes', hint: 'Tercium pertama, cepat memudar' },
  { key: 'middle', title: 'Middle notes', hint: 'Inti aroma setelah top notes menghilang' },
  { key: 'base', title: 'Base notes', hint: 'Dasar aroma yang menempel paling lama' },
]

// Piramida aroma: makin ke bawah makin lebar, makin lama tercium.
export default function NotePyramid({ notes, compact = false }) {
  return (
    <div className={`pyramid${compact ? ' pyramid--compact' : ''}`}>
      {LAYERS.map((layer) => (
        <section key={layer.key} className={`pyramid__layer pyramid__layer--${layer.key}`}>
          <h3 className="pyramid__title">{layer.title}</h3>
          {!compact && <p className="pyramid__hint">{layer.hint}</p>}
          <ul className="pyramid__notes">
            {(notes?.[layer.key] ?? []).map((note) => (
              <li key={note.id}>
                <Link to={`/notes/${note.id}`}>{note.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
