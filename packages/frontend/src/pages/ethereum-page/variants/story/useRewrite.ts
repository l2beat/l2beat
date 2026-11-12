import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import type { Reorg } from '../../live/types'

/** The old sentence unwinds back to its first changed word */
export const ERASE_MS = 700
/** Then the corrected one types itself out */
export const TYPE_MS = 1300
/** The struck-through values stay up at least this long to be read */
const HOLD_MS = 6000
/** A reorg found when the tab comes back is news, not a moment to replay */
const STALE_MS = 15_000

export type RewritePhase =
  | { kind: 'erase'; progress: number }
  | { kind: 'type'; progress: number }
  | { kind: 'hold' }

export interface Rewrite {
  reorg: Reorg
  phase: RewritePhase
}

/**
 * Plays a reorg as a correction to the lede: erase, retype, then hold the
 * corrected sentence until the hold is over and the chain has moved past the
 * replaced slot. Ticks per frame only during the two short animated phases.
 */
export function useRewrite(
  reorg: Reorg | undefined,
  headSlot: number | undefined,
): Rewrite | undefined {
  const reducedMotion = usePrefersReducedMotion()
  const [active, setActive] = useState<{ reorg: Reorg; start: number }>()
  const [elapsed, setElapsed] = useState(0)
  const seen = useRef<number>(undefined)

  useEffect(() => {
    if (!reorg || reorg.seenAt === seen.current) return
    seen.current = reorg.seenAt
    if (Date.now() - reorg.seenAt > STALE_MS) return
    setActive({ reorg, start: performance.now() })
    setElapsed(0)
  }, [reorg])

  useEffect(() => {
    if (!active) return
    const animated = ERASE_MS + TYPE_MS
    let frame = 0
    if (reducedMotion) {
      setElapsed(animated)
    } else {
      frame = requestAnimationFrame(function tick(now) {
        const at = now - active.start
        setElapsed(Math.min(at, animated))
        if (at < animated) frame = requestAnimationFrame(tick)
      })
    }
    const hold = setTimeout(
      () => setElapsed(animated + HOLD_MS),
      animated + HOLD_MS,
    )
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(hold)
    }
  }, [active, reducedMotion])

  const finished =
    active !== undefined &&
    elapsed >= ERASE_MS + TYPE_MS + HOLD_MS &&
    headSlot !== undefined &&
    headSlot > active.reorg.slot
  useEffect(() => {
    if (finished) setActive(undefined)
  }, [finished])

  if (!active) return undefined
  return { reorg: active.reorg, phase: toPhase(elapsed) }
}

function toPhase(elapsed: number): RewritePhase {
  if (elapsed < ERASE_MS) {
    return { kind: 'erase', progress: elapsed / ERASE_MS }
  }
  if (elapsed < ERASE_MS + TYPE_MS) {
    return { kind: 'type', progress: (elapsed - ERASE_MS) / TYPE_MS }
  }
  return { kind: 'hold' }
}
