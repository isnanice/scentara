import { apiClient } from '../config/api'

// ---------------------------------------------------------------------------
// ReviewService: memanggil endpoint review pada API Scentara.
// CRUD: Create, Read, Update, Delete.
// ---------------------------------------------------------------------------
class ReviewService {
  /** Ambil semua review di platform. */
  async getAll() {
    return apiClient.get('/api/reviews')
  }

  /** Ambil semua review untuk satu parfum. */
  async getByPerfumeId(perfumeId) {
    return apiClient.get(`/api/perfumes/${perfumeId}/reviews`)
  }

  /** Tambah review baru. */
  async create(perfumeId, { author, rating, comment, reviewer_id }) {
    return apiClient.post(`/api/perfumes/${perfumeId}/reviews`, {
      author,
      rating,
      comment,
      reviewer_id,
    })
  }

  /** Update review yang sudah ada. */
  async update(reviewId, { author, rating, comment }) {
    return apiClient.put(`/api/reviews/${reviewId}`, {
      author,
      rating,
      comment,
    })
  }

  /** Hapus review. */
  async delete(reviewId) {
    return apiClient.delete(`/api/reviews/${reviewId}`)
  }
}

export default new ReviewService()

