import { useSyncExternalStore } from 'react'

const KEY = 'scentara_user_profile'
const listeners = new Set()

export const DEFAULT_PROFILE = {
  id: 'profile-main',
  name: 'Isna Ima Solekhah',
  avatarUrl: '',
  favoriteScent: 'Woody, Amber, Citrus',
  bio: 'Mahasiswa Teknik Komputer UNDIP (NIM: 211201241200200). Fragrance enthusiast yang gemar mengeksplorasi piramida aroma dan wewangian artisanal lokal Indonesia.',
  updatedAt: new Date().toISOString(),
}

const read = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw === null) {
      localStorage.setItem(KEY, JSON.stringify(DEFAULT_PROFILE))
      return DEFAULT_PROFILE
    }
    const parsed = JSON.parse(raw)
    // Pastikan jika ada properti yang belum ada di profil lama, tetap aman
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
    }
  } catch {
    return DEFAULT_PROFILE
  }
}

let cache = read()

const notify = () => {
  listeners.forEach((listener) => listener())
}

const write = (data) => {
  cache = data
  try {
    if (data === null) {
      localStorage.removeItem(KEY)
    } else {
      localStorage.setItem(KEY, JSON.stringify(data))
    }
  } catch {
    /* fallback jika kuota localStorage penuh */
  }
  notify()
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useProfile() {
  const profile = useSyncExternalStore(subscribe, () => cache)

  const updateProfile = (updatedFields) => {
    const updated = {
      ...(cache || DEFAULT_PROFILE),
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    }
    write(updated)
    return updated
  }

  const deletePhoto = () => {
    return updateProfile({ avatarUrl: '' })
  }

  const resetProfile = () => {
    write({ ...DEFAULT_PROFILE, updatedAt: new Date().toISOString() })
  }

  return {
    profile: profile || DEFAULT_PROFILE,
    updateProfile,
    deletePhoto,
    resetProfile,
  }
}
