import { useMutation } from '@tanstack/react-query'
import { getConfigHealth } from '../../../api/api'

export function useConfigHealth() {
  const mutation = useMutation({
    mutationFn: () => getConfigHealth(),
  })

  return {
    generate: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  }
}
