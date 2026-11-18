import { apiClient } from '../config/api'
import { cleanParams } from '../utils/helpers'

// ---------------------------------------------------------------------------
// NoteService: memanggil endpoint /api/notes pada API Scentara.
// ---------------------------------------------------------------------------
class NoteService {
  /**
   * Daftar notes. Filter opsional: category, search (nama).
   */
  async getNotes(params = {}) {
    return apiClient.get('/api/notes', { params: cleanParams(params) })
  }

  async getNoteCategories() {
    return apiClient.get('/api/notes/categories')
  }

  /**
   * Detail satu note beserta parfum yang memakainya.
   */
  async getNoteById(id) {
    return apiClient.get(`/api/notes/${id}`)
  }
}

export default new NoteService()
