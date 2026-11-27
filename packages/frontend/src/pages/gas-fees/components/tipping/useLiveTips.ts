import { useQuery } from '@tanstack/react-query'
import { type RefObject, useEffect, useState } from 'react'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import type { GasFeesLiveTips } from '~/server/features/gas-fees/tipping/getGasFeesLiveTips'
import { useTRPC } from '~/trpc/React'

const POLL_MS = 4_000
/** An estimate read longer ago than this is no longer live */
const LIVE_FOR_SECONDS = 120

export type LiveTips =
  | { status: 'loading' }
  | { status: 'none' }
  | { status: 'stale'; updatedAt: number }
  | {
      status: 'live'
      estimate: NonNullable<GasFeesLiveTips['estimate']>
      wallets: GasFeesLiveTips['wallets']
    }

/** Polls only while the card is on screen; turns stale on a timer, poll or not */
export function useLiveTips(ref: RefObject<Element | null>): LiveTips {
  const trpc = useTRPC()
  const onScreen = useIsOnScreen(ref)
  const { data, isError } = useQuery({
    ...trpc.gasFees.liveTips.queryOptions(),
    enabled: onScreen,
    refetchInterval: onScreen ? POLL_MS : false,
    staleTime: POLL_MS,
  })
  const now = useNowUntilStale(data?.estimate?.updatedAt)
  // A failed read is no estimate, not a load without end; the polls go on
  if (!data && isError) return { status: 'none' }
  if (!data || now === undefined) return { status: 'loading' }
  const { estimate, wallets } = data
  if (!estimate) return { status: 'none' }
  if (now - estimate.updatedAt > LIVE_FOR_SECONDS) {
    return { status: 'stale', updatedAt: estimate.updatedAt }
  }
  return { status: 'live', estimate, wallets }
}

/**
 * Seconds, read after mount (the first render must match the server's) and
 * again once the estimate turns stale, so it does without a new poll
 */
function useNowUntilStale(updatedAt: number | undefined): number | undefined {
  const [now, setNow] = useState<number>()
  useEffect(() => {
    const read = () => setNow(Math.floor(Date.now() / 1000))
    read()
    if (updatedAt === undefined) return
    const ms = (updatedAt + LIVE_FOR_SECONDS + 1) * 1000 - Date.now()
    if (ms <= 0) return
    const id = setTimeout(read, ms)
    return () => clearTimeout(id)
  }, [updatedAt])
  return now
}
