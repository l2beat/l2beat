import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { useTRPC, useTRPCClient } from '~/trpc/React'

export type LiveStatus = 'connecting' | 'live' | 'reconnecting'

/**
 * The server holds each ask open until a new block comes, so the next one
 * goes out as soon as an answer is in
 */
const ASK_AGAIN_AFTER = 0.25
const RETRY_DELAY = 2
const MAX_RETRY_DELAY = 30

/** Follows the recent blocks through our server while `enabled`, for the whole card */
export function useLiveBlobs(enabled: boolean) {
  const trpc = useTRPC()
  const trpcClient = useTRPCClient()
  // the newest slot in hand, which the server waits to pass before it answers
  const head = useRef<number>(undefined)
  const query = useQuery({
    ...trpc.da.liveBlobs.queryOptions({}),
    queryFn: ({ signal }) =>
      trpcClient.da.liveBlobs.query({ after: head.current }, { signal }),
    enabled,
    // a poll that fails backs off by itself, rather than retrying at once
    retry: false,
    // what was fetched before the card left the screen is old on its return
    staleTime: 0,
    refetchInterval: (q) => 1000 * askAgainIn(q.state.fetchFailureCount),
  })
  const data = query.data ?? undefined
  head.current = data?.head
  const status: LiveStatus = !data
    ? 'connecting'
    : // the server answers, but its own line to the node may be down
      query.isError || !data.live
      ? 'reconnecting'
      : 'live'
  return { data, status }
}

/** Seconds until the server is asked again */
function askAgainIn(failures: number) {
  if (failures === 0) return ASK_AGAIN_AFTER
  return Math.min(MAX_RETRY_DELAY, RETRY_DELAY * 2 ** failures)
}
