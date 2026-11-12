import {
  createContext,
  type ReactNode,
  use,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import type { Reorg } from '../../../live/types'
import { useAnchor } from './anchor'

/**
 * When each beat of a reorg's replay happens, in ms from when the page learns
 * of it. A deeper reorg rewinds further and lands more blocks, so it runs
 * longer, but the landings share a budget so six slots don't drag.
 */
export function rewindTiming(depth: number) {
  const slots = Math.max(1, Math.min(depth, 8))
  const rewindStart = 260
  const rewindEnd = rewindStart + 380 + 60 * slots
  const peel = rewindEnd + 100
  const land = peel + 520
  const stagger = slots > 1 ? Math.min(160, 700 / (slots - 1)) : 0
  const lastLand = land + stagger * (slots - 1)
  const forward = lastLand + 900
  const total = forward + 1300
  return {
    rewindStart,
    rewindEnd,
    peel,
    /** When the i-th rewritten slot (oldest first) gets its winning block */
    landAt: (i: number) => land + stagger * Math.min(i, slots - 1),
    /** Numbers hold the replaced values until the new head lands, then roll back */
    hold: lastLand,
    forward,
    total,
  }
}
/** The orphan stays on its side branch this long, as an uncle */
const UNCLE_MS = 3 * 60_000
const NOTICE_MS = 30_000

export interface Rewind {
  /** The reorg being animated right now */
  active: Reorg | undefined
  /** Replaced branches still drawn above the chain */
  uncles: Reorg[]
  /** The reorg the notice names, until it times out or is dismissed */
  notice: Reorg | undefined
  dismissNotice: () => void
}

const RewindContext = createContext<Rewind>({
  active: undefined,
  uncles: [],
  notice: undefined,
  dismissNotice: () => {},
})

export function RewindProvider({ children }: { children: ReactNode }) {
  const { head } = useAnchor()
  const lastReorg = head.lastReorg
  const [seen, setSeen] = useState<Reorg[]>([])
  const [dismissed, setDismissed] = useState<number>()
  const [, rerender] = useReducer((n: number) => n + 1, 0)

  // derived in render, not in an effect, so the orphan is drawn in the same
  // frame the numbers change: an effect would show the replacement first
  if (lastReorg && seen.at(-1) !== lastReorg) {
    setSeen([...seen, lastReorg].slice(-6))
  }

  // wake up when the animation, the notice and the oldest uncle expire
  useEffect(() => {
    const now = Date.now()
    const deadlines = seen
      .flatMap((r) => [
        r.seenAt + rewindTiming(r.depth).total,
        r.seenAt + NOTICE_MS,
        r.seenAt + UNCLE_MS,
      ])
      .filter((t) => t > now)
    if (deadlines.length === 0) return
    const timer = setTimeout(rerender, Math.min(...deadlines) - now + 20)
    return () => clearTimeout(timer)
  })

  const now = Date.now()
  const latest = seen.at(-1)
  const active =
    latest && now - latest.seenAt < rewindTiming(latest.depth).total
      ? latest
      : undefined
  const notice =
    latest && now - latest.seenAt < NOTICE_MS && dismissed !== latest.seenAt
      ? latest
      : undefined
  const uncleKey = seen
    .filter((r) => now - r.seenAt < UNCLE_MS)
    .map((r) => r.seenAt)
    .join()

  // biome-ignore lint/correctness/useExhaustiveDependencies: `uncleKey` names the uncles that are still fresh
  const uncles = useMemo(
    () => seen.filter((r) => Date.now() - r.seenAt < UNCLE_MS),
    [uncleKey],
  )

  const value = useMemo(
    (): Rewind => ({
      active,
      uncles,
      notice,
      dismissNotice: () => setDismissed(latest?.seenAt),
    }),
    [active, uncles, notice, latest],
  )
  return <RewindContext value={value}>{children}</RewindContext>
}

export function useRewind() {
  return use(RewindContext)
}
