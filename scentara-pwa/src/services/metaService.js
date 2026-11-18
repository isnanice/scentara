import { apiClient } from '../config/api'

// ---------------------------------------------------------------------------
// MetaService: data pendukung filter (daftar brand dan profil aroma).
// ---------------------------------------------------------------------------
class MetaService {
  async getBrands() {
    return apiClient.get('/api/brands')
  }

  async getScentProfiles() {
    return apiClient.get('/api/scent-profiles')
  }
}

export default new MetaService()
