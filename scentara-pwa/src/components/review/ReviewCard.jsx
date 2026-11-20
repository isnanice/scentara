import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { StarRating } from './StarRating'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} hari lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ReviewCard({ review, isOwner, onEdit, onDelete, submitting }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete(review.id)
    setConfirmDelete(false)
  }

  return (
    <article className="review-card">
      <div className="review-card__head">
        <div>
          <span className="review-card__author">{review.author}</span>
          <span className="review-card__time">{timeAgo(review.created_at)}</span>
        </div>
        <StarRating value={review.rating} />
      </div>

      <p className="review-card__comment">{review.comment}</p>

      {isOwner && (
        <div className="review-card__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(review)}
            disabled={submitting}
            aria-label="Edit ulasan"
            title="Edit ulasan"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            className={`icon-btn${confirmDelete ? ' icon-btn--danger' : ''}`}
            onClick={handleDelete}
            onBlur={() => setConfirmDelete(false)}
            disabled={submitting}
            aria-label={confirmDelete ? 'Konfirmasi hapus' : 'Hapus ulasan'}
            title={confirmDelete ? 'Klik lagi untuk konfirmasi' : 'Hapus ulasan'}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </article>
  )
}

