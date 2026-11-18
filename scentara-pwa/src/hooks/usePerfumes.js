import perfumeService from '../services/perfumeService'
import { useAsync } from './useAsync'

// ---------------------------------------------------------------------------
// usePerfumes: ambil daftar parfum dari API.
// Mengembalikan { perfumes, loading, error, refetch }.
// ---------------------------------------------------------------------------
export function usePerfumes(params = {}) {
  const { data, loading, error, refetch } = useAsync(
    () => perfumeService.getPerfumes(params),
    JSON.stringify(params),
  )
  return { perfumes: data ?? [], loading, error, refetch }
}

// ---------------------------------------------------------------------------
// usePerfumeById: ambil satu parfum beserta piramida notes-nya.
// Mengembalikan { perfume, loading, error, refetch }.
// ---------------------------------------------------------------------------
export function usePerfumeById(id) {
  const { data, loading, error, refetch } = useAsync(() => perfumeService.getPerfumeById(id), id)
  return { perfume: data, loading, error, refetch }
}
