import { useSyncExternalStore } from 'react'

// Favorit disimpan di localStorage dan dibagikan ke semua komponen,
// jadi ikon hati dan badge di navigasi selalu sinkron.
const KEY = 'scentara_favorites'
const listeners = new Set()

const read = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

let cache = read()

const write = (ids) => {
  cache = ids
  try {
    localStorage.setItem(KEY, JSON.stringify(ids))
  } catch {
    /* penyimpanan penuh atau diblokir: favorit tetap jalan selama sesi */
  }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, () => cache)

  const isFavorite = (id) => ids.includes(id)
  const toggle = (id) => write(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])

  return { ids, isFavorite, toggle }
}
