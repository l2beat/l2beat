import { useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '~/react-query/trpc'

/**
 * Invalidates every query that renders abstract-token data. Call after any
 * write that creates, updates or deletes an abstract token.
 */
export function useInvalidateAbstractTokenQueries() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries(trpc.abstractTokens.getAll.queryFilter())
    queryClient.invalidateQueries(
      trpc.abstractTokens.getAllWithDeployedTokens.queryFilter(),
    )
    queryClient.invalidateQueries(trpc.abstractTokens.getById.queryFilter())
    queryClient.invalidateQueries(trpc.abstractTokens.checks.queryFilter())
    queryClient.invalidateQueries(trpc.search.all.queryFilter())
  }
}
