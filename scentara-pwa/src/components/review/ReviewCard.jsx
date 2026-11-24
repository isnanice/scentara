import { useState } from 'react'
import { Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import { StarRating } from './StarRating'

function timeAgo(dateStr) {
  if (!dateStr) return 'Baru saja'
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

export default function ReviewCard({
  review,
  isOwner = true,
  onEdit,
  onDelete,
  submitting,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDeleteConfirm = () => {
    onDelete?.(review.id)
    setConfirmDelete(false)
  }

  return (
    <article className="review-card">
      <div className="review-card__head">
        <div>
          <div className="review-card__author-row">
            <span className="review-card__author">{review.author}</span>
            {isOwner && (
              <span className="review-card__owner-tag">
                <CheckCircle2 size={12} /> Ulasan Anda
              </span>
            )}
          </div>
          <span className="review-card__time">{timeAgo(review.created_at)}</span>
        </div>
        <StarRating value={Number(review.rating) || 5} />
      </div>

      <p className="review-card__comment">{review.comment}</p>

      {/* AKSI CRUD (UPDATE & DELETE) */}
      {(onEdit || onDelete) && (
        <div className="review-card__actions">
          {confirmDelete ? (
            <div className="review-card__confirm-box">
              <span className="review-card__confirm-text">Hapus ulasan ini secara permanen?</span>
              <div className="review-card__confirm-buttons">
                <button
                  type="button"
                  className="btn btn--sm btn--danger-solid"
                  onClick={handleDeleteConfirm}
                  disabled={submitting}
                >
                  <Trash2 size={13} /> Ya, Hapus
                </button>
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  onClick={() => setConfirmDelete(false)}
                  disabled={submitting}
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="review-card__action-buttons">
              {onEdit && (
                <button
                  type="button"
                  className="btn btn--sm btn--ghost review-card__btn-edit"
                  onClick={() => onEdit(review)}
                  disabled={submitting}
                  aria-label="Edit ulasan"
                  title="Perbarui ulasan ini"
                >
                  <Pencil size={13} /> <span>Edit</span>
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className="btn btn--sm btn--danger-outline review-card__btn-delete"
                  onClick={() => setConfirmDelete(true)}
                  disabled={submitting}
                  aria-label="Hapus ulasan"
                  title="Hapus ulasan ini"
                >
                  <Trash2 size={13} /> <span>Hapus</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
