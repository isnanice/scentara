import { useState } from 'react'
import { Pencil, Trash2, CheckCircle2, Maximize2, X, Clock } from 'lucide-react'
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
  const [showLightbox, setShowLightbox] = useState(false)

  const handleDeleteConfirm = () => {
    onDelete?.(review.id)
    setConfirmDelete(false)
  }

  const initial = (review.author || 'P').trim().charAt(0).toUpperCase()

  return (
    <>
      <article className="review-card">
        {/* HEAD: Avatar, Pengulas, Waktu, Star Rating */}
        <div className="review-card__head">
          <div className="review-card__user-info">
            <div className="review-card__avatar" aria-hidden="true">
              {initial}
            </div>
            <div>
              <div className="review-card__author-row">
                <span className="review-card__author">{review.author}</span>
                {isOwner && (
                  <span className="review-card__owner-tag">
                    <CheckCircle2 size={12} /> Ulasan Anda
                  </span>
                )}
              </div>
              <span className="review-card__time">
                <Clock size={11} /> {timeAgo(review.created_at)}
              </span>
            </div>
          </div>

          <StarRating value={Number(review.rating) || 5} />
        </div>

        {/* COMMENT TEXT */}
        <p className="review-card__comment">{review.comment}</p>

        {/* FOTO ULASAN (JIKA ADA) */}
        {review.image_url && (
          <div className="review-card__photo-wrapper">
            <div
              className="review-card__photo-thumb"
              onClick={() => setShowLightbox(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setShowLightbox(true)}
              title="Klik untuk memperbesar foto ulasan"
              aria-label="Lihat foto ulasan ukuran penuh"
            >
              <img
                src={review.image_url}
                alt={`Foto ulasan oleh ${review.author}`}
                loading="lazy"
              />
              <span className="review-card__photo-badge">
                <Maximize2 size={12} /> Lihat Foto
              </span>
            </div>
          </div>
        )}

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

      {/* LIGHTBOX MODAL FOTO ULASAN */}
      {showLightbox && (
        <div
          className="review-lightbox-backdrop"
          onClick={() => setShowLightbox(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="review-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="review-lightbox-close"
              onClick={() => setShowLightbox(false)}
              aria-label="Tutup foto"
            >
              <X size={20} />
            </button>
            <div className="review-lightbox-image-wrap">
              <img
                src={review.image_url}
                alt={`Foto ulasan penuh oleh ${review.author}`}
              />
            </div>
            <div className="review-lightbox-caption">
              <strong>Ulasan oleh {review.author}</strong>
              <span>{review.comment}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
