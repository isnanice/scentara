import { useCallback, useState } from 'react'
import reviewService from '../services/reviewService'
import { useAsync } from './useAsync'

// ID unik per perangkat, disimpan di localStorage.
// Dipakai untuk menandai review milik pengguna ini (tanpa login).
const REVIEWER_KEY = 'scentara_reviewer_id'

function getReviewerId() {
  let id = localStorage.getItem(REVIEWER_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(REVIEWER_KEY, id)
  }
  return id
}

// ---------------------------------------------------------------------------
// useReviews: ambil daftar review dan sediakan fungsi CRUD.
// ---------------------------------------------------------------------------
export function useReviews(perfumeId) {
  const { data, loading, error, refetch } = useAsync(
    () => reviewService.getByPerfumeId(perfumeId),
    perfumeId,
  )

  const reviewerId = getReviewerId()
  const [submitting, setSubmitting] = useState(false)

  const createReview = useCallback(
    async ({ author, rating, comment, image_url }) => {
      setSubmitting(true)
      try {
        await reviewService.create(perfumeId, {
          author,
          rating,
          comment,
          image_url,
          reviewer_id: reviewerId,
        })
        refetch()
      } finally {
        setSubmitting(false)
      }
    },
    [perfumeId, reviewerId, refetch],
  )

  const updateReview = useCallback(
    async (reviewId, { author, rating, comment, image_url }) => {
      setSubmitting(true)
      try {
        await reviewService.update(reviewId, { author, rating, comment, image_url })
        refetch()
      } finally {
        setSubmitting(false)
      }
    },
    [refetch],
  )

  const deleteReview = useCallback(
    async (reviewId) => {
      setSubmitting(true)
      try {
        await reviewService.delete(reviewId)
        refetch()
      } finally {
        setSubmitting(false)
      }
    },
    [refetch],
  )

  return {
    reviews: data ?? [],
    loading,
    error,
    refetch,
    reviewerId,
    submitting,
    createReview,
    updateReview,
    deleteReview,
  }
}

// ---------------------------------------------------------------------------
// useAllReviews: ambil semua review di platform untuk halaman Ulasan.
// ---------------------------------------------------------------------------
export function useAllReviews() {
  const { data, loading, error, refetch } = useAsync(
    () => reviewService.getAll(),
    'all-reviews',
  )

  const reviewerId = getReviewerId()
  const [submitting, setSubmitting] = useState(false)

  const createReview = useCallback(
    async (perfumeId, { author, rating, comment, image_url }) => {
      setSubmitting(true)
      try {
        const res = await reviewService.create(perfumeId, {
          author,
          rating,
          comment,
          image_url,
          reviewer_id: reviewerId,
        })
        refetch()
        return res
      } finally {
        setSubmitting(false)
      }
    },
    [reviewerId, refetch],
  )

  const updateReview = useCallback(
    async (reviewId, { author, rating, comment, image_url }) => {
      setSubmitting(true)
      try {
        await reviewService.update(reviewId, { author, rating, comment, image_url })
        refetch()
      } finally {
        setSubmitting(false)
      }
    },
    [refetch],
  )

  const deleteReview = useCallback(
    async (reviewId) => {
      setSubmitting(true)
      try {
        await reviewService.delete(reviewId)
        refetch()
      } finally {
        setSubmitting(false)
      }
    },
    [refetch],
  )

  return {
    reviews: data ?? [],
    loading,
    error,
    refetch,
    reviewerId,
    submitting,
    createReview,
    updateReview,
    deleteReview,
  }
}

