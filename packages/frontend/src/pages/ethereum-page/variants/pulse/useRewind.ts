import { useEffect, useMemo, useState } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import type { HeadBlock, Reorg } from '../../live/types'

/** Long enough to read, and to look for the slots it names */
const NOTICE_MS = 14_000

const SCRUB_MS = 700
/** The old branch held still in red, so it can be seen for what it was */
const SHOW_OLD_MS = 350
const FLATLINE_MS = 400
/** A lone beat gets a slow, deliberate redraw; a long branch a steady beat-by-beat one */
const SINGLE_DRAW_MS = 600
const MIN_STEP_MS = 280
const MAX_STEP_MS = 420
const REDRAW_BUDGET_MS = 1800
const SETTLE_MS = 200
const PLAY_MS = 700

/**
 * The rewind, in milliseconds from its start: the tape scrubs back to the
 * fork, the old branch shows in red and flatlines all at once, the winning
 * branch is drawn slot by slot from the fork forward, and the tape plays on
 * to now. Every animation of it reads one plan, so they stay in step; a
 * deeper reorg only lengthens the redraw, so depth 6 reads as six beats
 * written in turn rather than as more chaos.
 */
export interface RewindPlan {
  total: number
  scrubbedBack: number
  shownOld: number
  flatlined: number
  redrawn: number
  /** When each winning slot's beat starts drawing, oldest first, and for how long */
  draws: { delay: number; duration: number }[]
}

export function planRewind(depth: number): RewindPlan {
  const scrubbedBack = SCRUB_MS
  const shownOld = scrubbedBack + SHOW_OLD_MS
  const flatlined = shownOld + FLATLINE_MS
  const step =
    depth === 1
      ? SINGLE_DRAW_MS
      : Math.min(MAX_STEP_MS, Math.max(MIN_STEP_MS, REDRAW_BUDGET_MS / depth))
  const draws = Array.from({ length: depth }, (_, i) => ({
    delay: flatlined + i * step,
    // each overlaps the next a little, so the pen reads as one stroke
    duration: depth === 1 ? step : step * 1.3,
  }))
  const redrawn = flatlined + depth * step + SETTLE_MS
  return {
    total: redrawn + PLAY_MS,
    scrubbedBack,
    shownOld,
    flatlined,
    redrawn,
    draws,
  }
}

export interface Rewind {
  /** Set while the animation runs */
  playing: Reorg | undefined
  plan: RewindPlan | undefined
  /** False until the new head is drawn: numbers hold the replaced head's values till then */
  swapped: boolean
  /** Outlives the animation, so the notice can be read */
  notice: Reorg | undefined
  dismiss: () => void
  reducedMotion: boolean
}

/**
 * Derived in render rather than set from an effect, so the frame that brings
 * the winning branch already knows to hide it until the rewind gets there.
 */
export function useRewind(lastReorg: Reorg | undefined): Rewind {
  const reducedMotion = usePrefersReducedMotion()
  // a reorg already in the stream when the page opened is not news
  const [done, setDone] = useState(() => lastReorg?.seenAt)
  const [swappedAt, setSwappedAt] = useState(() => lastReorg?.seenAt)
  const [dismissedAt, setDismissedAt] = useState(() => lastReorg?.seenAt)

  const fresh = lastReorg && lastReorg.seenAt !== done ? lastReorg : undefined
  const playing = reducedMotion ? undefined : fresh
  const seenAt = fresh?.seenAt
  const depth = fresh?.depth
  const plan = useMemo(
    () => (depth === undefined ? undefined : planRewind(depth)),
    [depth],
  )

  useEffect(() => {
    if (seenAt === undefined || !plan) return
    if (reducedMotion) {
      setDone(seenAt)
      return
    }
    const headDraw = plan.draws.at(-1)
    const timers = [
      setTimeout(
        () => setSwappedAt(seenAt),
        headDraw ? headDraw.delay + headDraw.duration / 2 : plan.redrawn,
      ),
      setTimeout(() => setDone(seenAt), plan.total),
    ]
    return () => {
      for (const timer of timers) clearTimeout(timer)
    }
  }, [seenAt, plan, reducedMotion])

  const noticeAt = lastReorg?.seenAt
  useEffect(() => {
    if (noticeAt === undefined) return
    const timer = setTimeout(() => setDismissedAt(noticeAt), NOTICE_MS)
    return () => clearTimeout(timer)
  }, [noticeAt])

  return {
    playing,
    plan: playing ? plan : undefined,
    swapped: !playing || swappedAt === playing.seenAt,
    notice:
      lastReorg && lastReorg.seenAt !== dismissedAt ? lastReorg : undefined,
    dismiss: () => setDismissedAt(lastReorg?.seenAt),
    reducedMotion,
  }
}

/** The block the hero's numbers describe: the replaced one until its replacement is drawn */
export function shownHead(head: HeadBlock | undefined, rewind: Rewind) {
  const reorg = rewind.playing
  if (!head || !reorg || rewind.swapped) return head
  return reorg.replaced.find((b) => b.slot === head.slot) ?? head
}

/** The block the page had at `slot` before the reorg, if the reorg rewrote it */
export function replacedAt(reorg: Reorg | undefined, slot: number) {
  return reorg?.replaced.find((b) => b.slot === slot)
}

export function reorgRange(reorg: Reorg) {
  const first = reorg.forkSlot + 1
  return { first, last: reorg.replaced.at(-1)?.slot ?? first }
}
