import { useQuery } from '@tanstack/react-query'
import { getAllReviews, getIndex, getReview } from './api'

export function useIndex() {
  return useQuery({
    queryKey: ['index'],
    queryFn: getIndex,
    staleTime: 5 * 60 * 1000,
  })
}

export function useReview(slug: string) {
  return useQuery({
    queryKey: ['review', slug],
    queryFn: () => getReview(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  })
}

export function useAllReviews() {
  return useQuery({
    queryKey: ['allReviews'],
    queryFn: getAllReviews,
    staleTime: 5 * 60 * 1000,
  })
}
