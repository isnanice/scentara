import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Star, Sparkles, Filter, X, Check, MessageSquare } from 'lucide-react'
import { useAllReviews } from '../hooks/useReviews'
import { usePerfumes } from '../hooks/usePerfumes'
import ReviewCard from '../components/review/ReviewCard.jsx'
import ReviewForm from '../components/review/ReviewForm.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateBox.jsx'

export default function ReviewsPage() {
  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    refetch,
    reviewerId,
    submitting,
    createReview,
    updateReview,
    deleteReview,
  } = useAllReviews()

  const { perfumes } = usePerfumes()

  const [selectedPerfumeId, setSelectedPerfumeId] = useState('')
  const [filterRating, setFilterRating] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [modalPerfumeId, setModalPerfumeId] = useState('')
  const [notice, setNotice] = useState('')

  const showNotice = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3500)
  }

  // Map parfum berdasarkan id untuk akses cepat nama dan brand
  const perfumeMap = useMemo(() => {
    const map = {}
    perfumes.forEach((p) => {
      map[p.id] = p
    })
    return map
  }, [perfumes])

  // Filter ulasan berdasarkan rating atau parfum terpilih
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (selectedPerfumeId && r.perfume_id !== selectedPerfumeId) return false
      if (filterRating > 0 && Number(r.rating) !== filterRating) return false
      return true
    })
  }, [reviews, selectedPerfumeId, filterRating])

  // Hitung rata-rata rating
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
    return (sum / reviews.length).toFixed(1)
  }, [reviews])

  // CREATE: Tambah Ulasan Baru
  const handleCreateReview = async (formData) => {
    const targetPerfumeId = modalPerfumeId || selectedPerfumeId || perfumes[0]?.id
    if (!targetPerfumeId) return
    await createReview(targetPerfumeId, formData)
    setShowAddModal(false)
    showNotice('Ulasan baru berhasil ditambahkan!')
  }

  // UPDATE: Perbarui Ulasan Terpilih
  const handleUpdateReview = async (formData) => {
    if (!editingReview) return
    await updateReview(editingReview.id, formData)
    setEditingReview(null)
    showNotice('Ulasan berhasil diperbarui!')
  }

  // DELETE: Hapus Ulasan
  const handleDeleteReview = async (reviewId) => {
    await deleteReview(reviewId)
    showNotice('Ulasan berhasil dihapus.')
  }

  return (
    <div className="reviews-page">
      {/* 1. HEADER HALAMAN */}
      <div className="page-head">
        <span className="page-head__badge">Komunitas & Diskusi</span>
        <h1>Ulasan Komunitas</h1>
        <p className="lede">
          Bagikan pengalaman wangi nyata, impresi aroma, daya tahan (*longevity*), dan daya sebar (*sillage*) dari
          koleksi parfum lokal Indonesia.
        </p>
      </div>

      {/* NOTIFIKASI SUKSES (FEEDBACK CRUD) */}
      {notice && (
        <div className="profile-notice" role="status" style={{ marginBottom: 20 }}>
          <Check size={18} /> {notice}
        </div>
      )}

      {/* 2. RINGKASAN & TOMBOL TAMBAH ULASAN (CREATE) */}
      <section className="reviews-overview-card">
        <div className="reviews-overview__stats">
          <div className="reviews-overview__score">
            <span className="reviews-overview__avg">{avgRating > 0 ? avgRating : '-'}</span>
            <div className="reviews-overview__stars">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={star <= Math.round(avgRating) ? '#f59e0b' : 'none'}
                    className={star <= Math.round(avgRating) ? '' : 'star--empty'}
                  />
                ))}
              </div>
              <span className="reviews-overview__total">{reviews.length} ulasan terdaftar</span>
            </div>
          </div>

          <p className="reviews-overview__hint">
            Ulasan bersifat terbuka. Anda dapat membuat ulasan baru (Create), membaca ulasan (Read), memperbarui ulasan (Update), maupun menghapus ulasan (Delete).
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setModalPerfumeId(selectedPerfumeId || (perfumes[0]?.id ?? ''))
            setShowAddModal(true)
          }}
          className="btn btn--primary btn--add-review"
        >
          <Plus size={16} /> Tulis Ulasan Baru
        </button>
      </section>

      {/* 3. TOOLBAR FILTER ULASAN */}
      <div className="reviews-toolbar">
        <div className="reviews-filter-group">
          <label className="reviews-filter-label" htmlFor="perfume-filter">
            <Filter size={15} /> Parfum:
          </label>
          <select
            id="perfume-filter"
            value={selectedPerfumeId}
            onChange={(e) => setSelectedPerfumeId(e.target.value)}
            className="reviews-select"
          >
            <option value="">Semua Parfum ({perfumes.length})</option>
            {perfumes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.brands?.name ? `${p.brands.name} - ` : ''}{p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="reviews-filter-group">
          <label className="reviews-filter-label" htmlFor="rating-filter">
            Rating:
          </label>
          <select
            id="rating-filter"
            value={filterRating}
            onChange={(e) => setFilterRating(Number(e.target.value))}
            className="reviews-select"
          >
            <option value={0}>Semua Rating</option>
            <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
            <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
            <option value={3}>⭐⭐⭐ (3 Bintang)</option>
            <option value={2}>⭐⭐ (2 Bintang)</option>
            <option value={1}>⭐ (1 Bintang)</option>
          </select>
        </div>

        {(selectedPerfumeId || filterRating > 0) && (
          <button
            type="button"
            className="reviews-filter-reset"
            onClick={() => {
              setSelectedPerfumeId('')
              setFilterRating(0)
            }}
          >
            <X size={14} /> Reset Filter
          </button>
        )}
      </div>

      {/* 4. MODAL FORM TAMBAH ULASAN (CREATE) */}
      {showAddModal && (
        <div className="review-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal__head">
              <div>
                <span className="page-head__badge">Operasi Create</span>
                <h3 style={{ marginTop: 4 }}>Tulis Ulasan Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="review-modal__close"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <div className="review-modal__select-perfume">
              <label htmlFor="modal-perfume-select">Pilih Parfum yang Ingin Diulas *</label>
              <select
                id="modal-perfume-select"
                value={modalPerfumeId}
                onChange={(e) => setModalPerfumeId(e.target.value)}
                className="reviews-select reviews-select--full"
              >
                {perfumes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brands?.name ? `${p.brands.name} - ` : ''}{p.name}
                  </option>
                ))}
              </select>
            </div>

            <ReviewForm onSubmit={handleCreateReview} submitting={submitting} />
          </div>
        </div>
      )}

      {/* 5. MODAL FORM EDIT ULASAN (UPDATE) */}
      {editingReview && (
        <div className="review-modal-backdrop" onClick={() => setEditingReview(null)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal__head">
              <div>
                <span className="page-head__badge">Operasi Update</span>
                <h3 style={{ marginTop: 4 }}>Edit Ulasan Pengguna</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="review-modal__close"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <div className="review-modal__perfume-badge">
              <MessageSquare size={15} />
              <span>
                Mengulas:{' '}
                <strong>
                  {perfumeMap[editingReview.perfume_id]
                    ? `${perfumeMap[editingReview.perfume_id].brands?.name || ''} - ${perfumeMap[editingReview.perfume_id].name}`
                    : editingReview.perfume_id}
                </strong>
              </span>
            </div>

            <ReviewForm
              editingReview={editingReview}
              onSubmit={handleUpdateReview}
              onCancelEdit={() => setEditingReview(null)}
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {/* STATE BOXES */}
      {reviewsLoading && reviews.length === 0 && <LoadingState text="Memuat ulasan komunitas..." />}
      {reviewsError && <ErrorState message={reviewsError} onRetry={refetch} />}

      {!reviewsLoading && !reviewsError && filteredReviews.length === 0 && (
        <EmptyState
          title="Tidak ada ulasan yang cocok"
          text="Jadilah yang pertama menulis ulasan atau atur ulang filter Anda."
          action={
            <button
              type="button"
              className="btn btn--dark"
              onClick={() => {
                setSelectedPerfumeId('')
                setFilterRating(0)
                setShowAddModal(true)
              }}
            >
              <Plus size={16} /> Tulis Ulasan Sekarang
            </button>
          }
        />
      )}

      {/* 6. DAFTAR ULASAN (READ) BESERTA TOMBOL EDIT & HAPUS */}
      {filteredReviews.length > 0 && (
        <div className="reviews-feed">
          <p className="result-count">
            Menampilkan <strong>{filteredReviews.length}</strong> ulasan
          </p>

          <ul className="reviews-list">
            {filteredReviews.map((review) => {
              const perfume = perfumeMap[review.perfume_id]
              const isOwner = review.reviewer_id === reviewerId

              return (
                <li key={review.id} className="review-feed-item">
                  {perfume && (
                    <div className="review-feed-item__perfume">
                      <Link to={`/parfum/${perfume.id}`} className="review-feed-item__link">
                        <Sparkles size={14} />
                        <span>
                          {perfume.brands?.name} &bull; <strong>{perfume.name}</strong>
                        </span>
                      </Link>
                    </div>
                  )}
                  <ReviewCard
                    review={review}
                    isOwner={isOwner}
                    onEdit={(r) => setEditingReview(r)}
                    onDelete={(id) => handleDeleteReview(id)}
                    submitting={submitting}
                  />
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
