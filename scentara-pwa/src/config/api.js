import axios from 'axios'

// Alamat API dibaca dari file .env (VITE_API_BASE_URL)
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

if (!BASE_URL) {
  console.warn('[api] VITE_API_BASE_URL belum diisi. Salin .env.example menjadi .env.')
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Ambil isi response saja dan seragamkan pesan error
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Terjadi kesalahan yang tidak diketahui.'
    let status = null

    if (error.response) {
      status = error.response.status
      message =
        status === 404
          ? 'Data tidak ditemukan.'
          : error.response.data?.error || `Server bermasalah (${status}).`
    } else if (error.request) {
      message = 'Tidak bisa menghubungi server. Periksa koneksi internet dan alamat API.'
    } else {
      message = error.message || message
    }

    return Promise.reject({ message, status })
  },
)
