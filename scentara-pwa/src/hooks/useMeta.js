import metaService from '../services/metaService'
import { useAsync } from './useAsync'

// Mengembalikan { brands, loading, error, refetch }
export function useBrands() {
  const { data, loading, error, refetch } = useAsync(() => metaService.getBrands(), 'brands')
  return { brands: data ?? [], loading, error, refetch }
}

// Mengembalikan { scentProfiles, loading, error, refetch }
export function useScentProfiles() {
  const { data, loading, error, refetch } = useAsync(
    () => metaService.getScentProfiles(),
    'scent-profiles',
  )
  return { scentProfiles: data ?? [], loading, error, refetch }
}
