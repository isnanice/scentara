import { apiClient } from '../config/api'
import { cleanParams } from '../utils/helpers'

// ---------------------------------------------------------------------------
// PerfumeService: memanggil endpoint /api/perfumes pada API Scentara.
// ---------------------------------------------------------------------------
class PerfumeService {
  /**
   * Daftar parfum. Filter opsional: brand (slug), scent (profil aroma), search (nama).
   */
  async getPerfumes(params = {}) {
    return apiClient.get('/api/perfumes', { params: cleanParams(params) })
  }

  /**
   * Detail satu parfum beserta piramida notes (top, middle, base).
   */
  async getPerfumeById(id) {
    return apiClient.get(`/api/perfumes/${id}`)
  }
}

export default new PerfumeService()
