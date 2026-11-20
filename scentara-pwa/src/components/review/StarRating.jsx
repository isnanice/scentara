import { Star } from 'lucide-react'

// Bintang rating (hanya tampilan, bukan input)
export function StarRating({ value, size = 16 }) {
  return (
    <span className="star-rating" aria-label={`Rating ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= value ? 'star--filled' : 'star--empty'}
          fill={n <= value ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  )
}

// Bintang rating interaktif (untuk form)
export function StarInput({ value, onChange, size = 22 }) {
  return (
    <span className="star-input" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-input__btn${n <= value ? ' is-active' : ''}`}
          onClick={() => onChange(n)}
          aria-label={`${n} bintang`}
          aria-checked={n === value}
          role="radio"
        >
          <Star size={size} fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </span>
  )
}

