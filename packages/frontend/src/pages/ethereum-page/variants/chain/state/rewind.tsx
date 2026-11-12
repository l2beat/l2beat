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

/** The whole choreography: rewind, peel, replace, play forward again */
export const REWIND_MS = 3600
/** Numbers hold the replaced block's values until the replacement lands, then roll back */
export const REWIND_HOLD_MS = 1300
/** The orphan stays on its side branch this long, as an uncle */
const UNCLE_MS = 3 * 60_000
const NOTICE_MS = 30_000

export interface Rewind {
  /** The reorg being animated right now */
  active: Reorg | undefined
  /** Replaced blocks still drawn on a side branch */
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
        r.seenAt + REWIND_MS,
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
  const active = latest && now - latest.seenAt < REWIND_MS ? latest : undefined
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
