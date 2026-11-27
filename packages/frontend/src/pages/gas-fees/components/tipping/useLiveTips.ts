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
  const { data, isError, dataUpdatedAt } = useQuery({
    ...trpc.gasFees.liveTips.queryOptions(),
    enabled: onScreen,
    refetchInterval: onScreen ? POLL_MS : false,
    staleTime: POLL_MS,
  })
  // The estimate's age at the read is the server's to tell; the device's clock only counts on from there
  const staleAtMs = data?.estimate
    ? dataUpdatedAt +
      (LIVE_FOR_SECONDS - Math.max(0, data.readAt - data.estimate.updatedAt)) *
        1000
    : undefined
  const now = useNowUntil(staleAtMs)
  // A failed read is no estimate, not a load without end; the polls go on
  if (!data && isError) return { status: 'none' }
  if (!data || now === undefined) return { status: 'loading' }
  const { estimate, wallets } = data
  if (!estimate || staleAtMs === undefined) return { status: 'none' }
  if (now > staleAtMs) {
    return { status: 'stale', updatedAt: estimate.updatedAt }
  }
  return { status: 'live', estimate, wallets }
}

/**
 * The device's clock in ms, read after mount (the first render must match the
 * server's) and again just after `untilMs`, so that passes without a new poll
 */
function useNowUntil(untilMs: number | undefined): number | undefined {
  const [now, setNow] = useState<number>()
  useEffect(() => {
    const read = () => setNow(Date.now())
    read()
    if (untilMs === undefined) return
    const ms = untilMs + 1000 - Date.now()
    if (ms <= 0) return
    const id = setTimeout(read, ms)
    return () => clearTimeout(id)
  }, [untilMs])
  return now
}
