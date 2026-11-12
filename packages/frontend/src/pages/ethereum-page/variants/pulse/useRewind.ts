import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import type { HeadBlock, Reorg } from '../../live/types'

/**
 * The rewind, as fractions of `REWIND_MS`: the tape scrubs back to the
 * replaced beat, the beat flatlines, its replacement is drawn, and the tape
 * plays forward to now. Every animation of it reads these, so they stay in step.
 */
export const REWIND_MS = 2600
export const REWIND = {
  scrubbedBack: 0.27,
  flatlined: 0.45,
  redrawn: 0.68,
} as const
/** Long enough to read, and to look for the beat it names */
const NOTICE_MS = 14_000

export interface Rewind {
  /** Set while the animation runs */
  playing: Reorg | undefined
  /** False until the replacement is drawn: numbers hold the replaced block's values till then */
  swapped: boolean
  /** Outlives the animation, so the notice can be read */
  notice: Reorg | undefined
  dismiss: () => void
  reducedMotion: boolean
}

/**
 * Derived in render rather than set from an effect, so the frame that brings
 * the replacement block already knows to hide it until the rewind gets there.
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

  useEffect(() => {
    if (seenAt === undefined) return
    if (reducedMotion) {
      setDone(seenAt)
      return
    }
    const timers = [
      setTimeout(() => setSwappedAt(seenAt), REWIND_MS * REWIND.flatlined),
      setTimeout(() => setDone(seenAt), REWIND_MS),
    ]
    return () => {
      for (const timer of timers) clearTimeout(timer)
    }
  }, [seenAt, reducedMotion])

  const noticeAt = lastReorg?.seenAt
  useEffect(() => {
    if (noticeAt === undefined) return
    const timer = setTimeout(() => setDismissedAt(noticeAt), NOTICE_MS)
    return () => clearTimeout(timer)
  }, [noticeAt])

  return {
    playing,
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
  if (head && reorg && !rewind.swapped && reorg.slot === head.slot) {
    return reorg.replaced
  }
  return head
}
