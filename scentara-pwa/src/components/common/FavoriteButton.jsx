import { Heart } from 'lucide-react'
import { useFavorites } from '../../hooks/useFavorites'

export default function FavoriteButton({ id, name, className = '' }) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(id)
  const label = active ? `Hapus ${name} dari favorit` : `Simpan ${name} ke favorit`

  return (
    <button
      type="button"
      className={`fav-btn${active ? ' fav-btn--active' : ''} ${className}`}
      onClick={() => toggle(id)}
      aria-pressed={active}
      aria-label={label}
      title={label}
    >
      <Heart size={18} fill={active ? 'currentColor' : 'none'} />
    </button>
  )
}
