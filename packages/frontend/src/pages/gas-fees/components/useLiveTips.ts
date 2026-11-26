import type { GasFeesTier, GasFeesWallet } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useReducer, useRef } from 'react'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { useTRPC } from '~/trpc/React'

/** The backend reads a block every 12 seconds, and the server shares a read for 3 */
const POLL_MS = 4_000
/** A block is 12 seconds, so an estimate this old means the backend has stopped reading */
const STALE_AFTER_SECONDS = 120

const TIERS: { key: GasFeesTier; name: string; promise: string }[] = [
  { key: 'slow', name: 'Slow', promise: '95% within 1 minute' },
  { key: 'medium', name: 'Medium', promise: '95% within 2 blocks' },
  { key: 'fast', name: 'Fast', promise: '95% next block' },
]

const WALLETS: GasFeesWallet[] = ['Ambire', 'MetaMask', 'Rabby']

export interface WalletSuggestion {
  name: GasFeesWallet
  option: string
  gwei: number
  /** Of our estimate, undefined when ours is zero or missing */
  multiple: number | undefined
}

export interface TipTierRow {
  key: GasFeesTier
  name: string
  promise: string
  /** Our estimate, undefined while loading and when the backend has none */
  gwei: number | undefined
  /** What it adds to an ERC-20 transfer */
  usd: number | undefined
  /** What the wallets suggest beside this tier, as the backend last read them */
  wallets: WalletSuggestion[]
  /** The highest of them */
  highest: WalletSuggestion | undefined
}

export type LiveTipsStatus =
  | { kind: 'pending' | 'live' | 'none' }
  | { kind: 'stale'; updatedAt: number }

/** Our three estimates and the wallets beside them, polled while the card is on screen */
export function useLiveTips() {
  const trpc = useTRPC()
  const ref = useRef<HTMLDivElement>(null)
  const onScreen = useIsOnScreen(ref)
  const { data: tips, isPending } = useQuery({
    ...trpc.gasFees.liveTips.queryOptions(),
    enabled: onScreen,
    refetchInterval: POLL_MS,
  })
  const updatedAt = tips?.updatedAt
  const isLive =
    updatedAt !== undefined && UnixTime.now() - updatedAt < STALE_AFTER_SECONDS
  // A poll that brings the same read renders nothing, so the clock has to
  const [, rerender] = useReducer((count: number) => count + 1, 0)
  useEffect(() => {
    if (updatedAt === undefined) return
    const left = updatedAt + STALE_AFTER_SECONDS - UnixTime.now()
    if (left <= 0) return
    const timer = setTimeout(rerender, left * 1000)
    return () => clearTimeout(timer)
  }, [updatedAt])

  const rows: TipTierRow[] = TIERS.map((tier) => {
    const ours = tips?.tips.find((tip) => tip.key === tier.key)
    const wallets = (tips?.wallets ?? [])
      .filter((row) => row.beside === tier.key)
      .map((row) => ({
        name: row.wallet,
        option: row.option,
        gwei: row.gwei,
        multiple: ours && ours.gwei > 0 ? row.gwei / ours.gwei : undefined,
      }))
      .sort((a, b) => b.gwei - a.gwei)
    return {
      ...tier,
      gwei: ours?.gwei,
      usd: ours?.usd,
      wallets,
      highest: wallets[0],
    }
  })
  const status: LiveTipsStatus = isPending
    ? { kind: 'pending' }
    : isLive
      ? { kind: 'live' }
      : updatedAt === undefined
        ? { kind: 'none' }
        : { kind: 'stale', updatedAt }
  // Only a live read says what wallets suggest right now
  const fast = isLive ? rows.find((row) => row.key === 'fast') : undefined
  const highest = fast?.highest?.multiple
  const lowest = fast?.wallets.at(-1)?.multiple
  return {
    ref,
    rows,
    status,
    /** The wallets the backend has a read of: a deployment may not poll them, and it drops one that hasn't answered for 30 minutes */
    wallets: WALLETS.filter((wallet) =>
      tips?.wallets.some((row) => row.wallet === wallet),
    ),
    /** How many times our fast estimate the wallets' suggestions are, when some are above it */
    fastRange:
      highest !== undefined && lowest !== undefined && highest > 1
        ? { lowest, highest }
        : undefined,
  }
}
