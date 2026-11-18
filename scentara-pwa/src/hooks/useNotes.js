import noteService from '../services/noteService'
import { useAsync } from './useAsync'

// Mengembalikan { notes, loading, error, refetch }
export function useNotes(params = {}) {
  const { data, loading, error, refetch } = useAsync(
    () => noteService.getNotes(params),
    JSON.stringify(params),
  )
  return { notes: data ?? [], loading, error, refetch }
}

// Mengembalikan { categories, loading, error, refetch }
export function useNoteCategories() {
  const { data, loading, error, refetch } = useAsync(() => noteService.getNoteCategories(), 'categories')
  return { categories: data ?? [], loading, error, refetch }
}

// Mengembalikan { note, loading, error, refetch }
export function useNoteById(id) {
  const { data, loading, error, refetch } = useAsync(() => noteService.getNoteById(id), id)
  return { note: data, loading, error, refetch }
}
