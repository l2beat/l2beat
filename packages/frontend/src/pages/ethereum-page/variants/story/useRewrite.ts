import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import type { Reorg } from '../../live/types'

/** The struck-through values stay up at least this long to be read */
const HOLD_MS = 6000
/** A reorg found when the tab comes back is news, not a moment to replay */
const STALE_MS = 15_000
/** Past this many slots a deeper rewind runs no longer */
const SLOWEST_DEPTH = 6

export type RewritePhase =
  | { kind: 'erase'; progress: number }
  | { kind: 'type'; progress: number }
  | { kind: 'hold' }

export interface Rewrite {
  reorg: Reorg
  phase: RewritePhase
  /** How long the erase runs, for effects that follow it */
  eraseMs: number
}

/**
 * The old sentence unwinds back to its first changed word, then the
 * corrected one types itself out. A deeper reorg rewinds a little longer, so
 * five slots feel heavier than one without keeping the reader waiting.
 */
export function rewriteTiming(depth: number) {
  const extra = Math.min(Math.max(depth, 1), SLOWEST_DEPTH) - 1
  return { eraseMs: 700 + extra * 110, typeMs: 1300 + extra * 120 }
}

/**
 * Plays a reorg as a correction to the lede: erase, retype, then hold the
 * corrected sentence until the hold is over and the chain has moved past the
 * rewritten slots. Ticks per frame only during the two short animated phases.
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

  const timing = rewriteTiming(active?.reorg.depth ?? 1)
  const animated = timing.eraseMs + timing.typeMs

  useEffect(() => {
    if (!active) return
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
  }, [active, animated, reducedMotion])

  const rewrittenHead = active?.reorg.by.at(-1)?.slot
  const finished =
    active !== undefined &&
    elapsed >= animated + HOLD_MS &&
    (rewrittenHead === undefined ||
      (headSlot !== undefined && headSlot > rewrittenHead))
  useEffect(() => {
    if (finished) setActive(undefined)
  }, [finished])

  if (!active) return undefined
  return {
    reorg: active.reorg,
    phase: toPhase(elapsed, timing),
    eraseMs: timing.eraseMs,
  }
}

function toPhase(
  elapsed: number,
  { eraseMs, typeMs }: ReturnType<typeof rewriteTiming>,
): RewritePhase {
  if (elapsed < eraseMs) {
    return { kind: 'erase', progress: elapsed / eraseMs }
  }
  if (elapsed < eraseMs + typeMs) {
    return { kind: 'type', progress: (elapsed - eraseMs) / typeMs }
  }
  return { kind: 'hold' }
}
