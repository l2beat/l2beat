import { useQuery } from '@tanstack/react-query'
import { getAddressUsage } from '../../../api/api'

export function useAddressUsage() {
  return useQuery({
    queryKey: ['address-usage'],
    queryFn: getAddressUsage,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
  })
}
