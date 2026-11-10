import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const SIMULATED_DELAY_MS = 350

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

apiClient.interceptors.request.use(
  async (config) => {
    if (SIMULATED_DELAY_MS > 0) {
      await delay(SIMULATED_DELAY_MS)
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let pesan = 'Terjadi kesalahan saat menghubungi server data.'

    if (error.code === 'ECONNABORTED') {
      pesan = 'Waktu permintaan habis (timeout). Periksa koneksi jaringan Anda.'
    } else if (error.response) {
      pesan = `Gagal memuat data dari server (Status ${error.response.status}).`
    } else if (error.request) {
      pesan = 'Tidak dapat terhubung ke server API. Pastikan server berjalan.'
    } else if (error.message) {
      pesan = error.message
    }

    const customError = new Error(pesan)
    customError.status = error.response?.status ?? 500
    customError.originalError = error
    return Promise.reject(customError)
  }
)

export default apiClient
