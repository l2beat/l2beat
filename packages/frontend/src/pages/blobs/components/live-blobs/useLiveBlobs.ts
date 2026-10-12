import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/React'

export type LiveStatus = 'connecting' | 'live' | 'reconnecting'

/**
 * What the belt fetched, for everything around it. The belt alone asks, and
 * only while it is seen; this only reads what it brings.
 */
export function useLiveBlobs() {
  const trpc = useTRPC()
  const query = useQuery({
    // the key the belt fetches under, with no slot in it
    ...trpc.da.liveBlobs.queryOptions({}),
    enabled: false,
  })
  const data = query.data ?? undefined
  const status: LiveStatus = !data
    ? 'connecting'
    : // the server answers, but its own line to the node may be down
      query.isError || !data.live
      ? 'reconnecting'
      : 'live'
  return { data, status }
}
