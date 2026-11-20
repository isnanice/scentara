import { useState } from 'react'
import { useReviews } from '../../hooks/useReviews'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import { LoadingState, ErrorState } from '../common/StateBox'
import { StarRating } from './StarRating'

export default function ReviewSection({ perfumeId }) {
  const {
    reviews,
    loading,
    error,
    refetch,
    reviewerId,
    submitting,
    createReview,
    updateReview,
    deleteReview,
  } = useReviews(perfumeId)

  const [editingReview, setEditingReview] = useState(null)

  const handleSubmit = async (formData) => {
    if (editingReview) {
      await updateReview(editingReview.id, formData)
      setEditingReview(null)
    } else {
      await createReview(formData)
    }
  }

  // Rata-rata rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null

  return (
    <section className="section review-section">
      <h2 className="section__title">Ulasan</h2>

      {avgRating && (
        <div className="review-summary">
          <span className="review-summary__avg">{avgRating}</span>
          <StarRating value={Math.round(Number(avgRating))} size={18} />
          <span className="review-summary__count">{reviews.length} ulasan</span>
        </div>
      )}

      <ReviewForm
        onSubmit={handleSubmit}
        editingReview={editingReview}
        onCancelEdit={() => setEditingReview(null)}
        submitting={submitting}
      />

      {loading && reviews.length === 0 && <LoadingState text="Memuat ulasan..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && reviews.length === 0 && (
        <p className="review-empty">Belum ada ulasan. Jadilah yang pertama!</p>
      )}

      {reviews.length > 0 && (
        <div className="review-list">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwner={review.reviewer_id === reviewerId}
              onEdit={setEditingReview}
              onDelete={deleteReview}
              submitting={submitting}
            />
          ))}
        </div>
      )}
    </section>
  )
}

