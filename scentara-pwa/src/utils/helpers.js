export const formatRupiah = (value) => {
  const num = Number(value)
  if (!value || Number.isNaN(num)) return 'Harga belum tersedia'
  return `Rp${num.toLocaleString('id-ID')}`
}

// Pilih satu item yang sama sepanjang hari (untuk "parfum pilihan hari ini")
export const pickOfTheDay = (items) => {
  if (!items || items.length === 0) return null
  const now = new Date()
  const dayNumber = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) /
      86400000,
  )
  return items[dayNumber % items.length]
}

// Hapus parameter kosong supaya query string ke API tetap bersih
export const cleanParams = (params = {}) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))

// Urutkan daftar parfum. key: name_asc, name_desc, price_asc, price_desc
export const sortPerfumes = (items, sortKey = 'name_asc') => {
  const sorted = [...items]
  const byName = (a, b) => String(a.name).localeCompare(String(b.name))
  const byPrice = (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0)
  if (sortKey === 'name_desc') return sorted.sort((a, b) => byName(b, a))
  if (sortKey === 'price_asc') return sorted.sort(byPrice)
  if (sortKey === 'price_desc') return sorted.sort((a, b) => byPrice(b, a))
  return sorted.sort(byName)
}
