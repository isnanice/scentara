import { apiClient } from '../config/api'

// ---------------------------------------------------------------------------
// ReviewService: Manajemen CRUD Ulasan Parfum
// Mendukung koneksi live API Supabase dengan sinkronisasi local storage
// (PWA Offline-First / Graceful Fallback)
// ---------------------------------------------------------------------------

const CACHE_KEY = 'scentara_reviews_store'

// Data ulasan awal sebagai bibit (seed) saat aplikasi baru dijalankan
const SEED_REVIEWS = [
  {
    id: 'rev-001',
    perfume_id: 'powder-room',
    author: 'Isna Ima Solekhah',
    rating: 5,
    comment: 'Aroma powdery dan clean musky-nya sangat menenangkan! Terasa seperti pakaian linen putih yang baru selesai dicuci dan terkena angin sore.',
    reviewer_id: 'default-user',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'rev-002',
    perfume_id: 'chno',
    author: 'Reza Pratama',
    rating: 5,
    comment: 'Vanilla dan spicy amber-nya luar biasa bold! Cocok banget buat acara malam formal atau kencan, longevity tembus 8 jam lebih di kulit.',
    reviewer_id: 'user-reza',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'rev-003',
    perfume_id: 'home-garden',
    author: 'Dinda Kirana',
    rating: 4,
    comment: 'Green notes dan citrus-nya menyegarkan sekali di cuaca tropis yang terik. Proyeksinya pas untuk daily wear ke kampus atau kantor.',
    reviewer_id: 'user-dinda',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
]

function readLocalReviews() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(SEED_REVIEWS))
      return SEED_REVIEWS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_REVIEWS
  } catch {
    return SEED_REVIEWS
  }
}

function writeLocalReviews(reviews) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(reviews))
  } catch {
    /* fallback kuota storage */
  }
}

class ReviewService {
  /**
   * READ ALL: Ambil semua ulasan di platform.
   */
  async getAll() {
    try {
      const data = await apiClient.get('/api/reviews')
      if (Array.isArray(data) && data.length > 0) {
        writeLocalReviews(data)
        return data
      }
      return readLocalReviews()
    } catch {
      // Fallback jika API backend offline
      return readLocalReviews()
    }
  }

  /**
   * READ BY PERFUME: Ambil semua ulasan untuk satu parfum.
   */
  async getByPerfumeId(perfumeId) {
    try {
      const data = await apiClient.get(`/api/perfumes/${perfumeId}/reviews`)
      if (Array.isArray(data) && data.length > 0) {
        return data
      }
      const local = readLocalReviews()
      return local.filter((r) => r.perfume_id === perfumeId)
    } catch {
      const local = readLocalReviews()
      return local.filter((r) => r.perfume_id === perfumeId)
    }
  }

  /**
   * CREATE: Tambah ulasan baru.
   */
  async create(perfumeId, { author, rating, comment, reviewer_id }) {
    const payload = {
      author,
      rating: Number(rating),
      comment,
      reviewer_id,
    }

    let saved = null

    try {
      saved = await apiClient.post(`/api/perfumes/${perfumeId}/reviews`, payload)
    } catch {
      // Fallback pembuatan lokal
      saved = {
        id: crypto.randomUUID ? crypto.randomUUID() : `rev-${Date.now()}`,
        perfume_id: perfumeId,
        author: payload.author,
        rating: payload.rating,
        comment: payload.comment,
        reviewer_id: payload.reviewer_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    // Selalu perbarui cache lokal agar UI reaktif seketika
    const current = readLocalReviews()
    const updated = [saved, ...current.filter((r) => r.id !== saved.id)]
    writeLocalReviews(updated)

    return saved
  }

  /**
   * UPDATE: Perbarui ulasan yang ada.
   */
  async update(reviewId, { author, rating, comment }) {
    const payload = {
      author,
      rating: Number(rating),
      comment,
    }

    let updatedReview = null

    try {
      updatedReview = await apiClient.put(`/api/reviews/${reviewId}`, payload)
    } catch {
      // Fallback update lokal
      const current = readLocalReviews()
      const target = current.find((r) => r.id === reviewId)
      if (target) {
        updatedReview = {
          ...target,
          author: payload.author,
          rating: payload.rating,
          comment: payload.comment,
          updated_at: new Date().toISOString(),
        }
      }
    }

    if (updatedReview) {
      const current = readLocalReviews()
      const list = current.map((r) => (r.id === reviewId ? updatedReview : r))
      writeLocalReviews(list)
    }

    return updatedReview
  }

  /**
   * DELETE: Hapus ulasan berdasarkan ID.
   */
  async delete(reviewId) {
    try {
      await apiClient.delete(`/api/reviews/${reviewId}`)
    } catch {
      /* jika API offline, lanjut hapus lokal */
    }

    // Hapus dari cache lokal
    const current = readLocalReviews()
    const filtered = current.filter((r) => r.id !== reviewId)
    writeLocalReviews(filtered)

    return { success: true }
  }
}

export default new ReviewService()
