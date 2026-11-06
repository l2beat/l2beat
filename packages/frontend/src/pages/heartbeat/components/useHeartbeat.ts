import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/React'

/** The server reads the blocks this often for everyone */
const REFRESH_SECONDS = 2

export function useHeartbeat() {
  const trpc = useTRPC()
  return useQuery({
    ...trpc.activity.heartbeat.queryOptions(),
    staleTime: 0,
    refetchInterval: REFRESH_SECONDS * 1000,
  })
}
