import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/React'
import { useChainClock } from './chainClock'

export type LiveStatus = 'connecting' | 'live' | 'reconnecting'

/**
 * What the belt fetched, for everything around it. The belt alone asks, and
 * only while it is seen; this only reads what it brings. The chain's clock is
 * put right by a live head here, in render, as the belt's own correction comes
 * in its effect, after this render has already judged the newest block
 */
export function useLiveBlobs() {
  const trpc = useTRPC()
  const query = useQuery({
    // the key the belt fetches under, with no slot in it
    ...trpc.da.liveBlobs.queryOptions({}),
    enabled: false,
  })
  const data = query.data ?? undefined
  const clock = useChainClock()
  // a head that is not live is an old one, which would pull the clock back
  if (data?.live) clock.correct(data.head)
  const status: LiveStatus = !data
    ? 'connecting'
    : // the server answers, but its own line to the node may be down
      query.isError || !data.live
      ? 'reconnecting'
      : 'live'
  return { data, status }
}
