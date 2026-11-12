import { type RefObject, useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { REWIND_MS } from '../state/rewind'
import { SLIDE } from '../ui/spring'
import { columnStep } from './geometry'

/** More slots than this at once (a tab back from the background) jump instead of slide */
const MAX_SLIDE_SLOTS = 6

/**
 * Moves the whole track, so every tile, marker and uncle on it travels
 * together: one slot left with a spring when a block arrives, and a jolt back
 * and forth when a reorg rewinds it. Both add onto each other, since a block
 * can arrive in the same tick as a reorg.
 */
export function useChainMotion(
  trackRef: RefObject<HTMLElement | null>,
  headSlot: number | undefined,
  rewindAt: number | undefined,
) {
  const reducedMotion = usePrefersReducedMotion()
  const previousHead = useRef<number>(undefined)

  useLayoutEffect(() => {
    const track = trackRef.current
    const before = previousHead.current
    previousHead.current = headSlot
    if (!track || reducedMotion) return
    if (before === undefined || headSlot === undefined) return
    const slots = headSlot - before
    if (slots <= 0 || slots > MAX_SLIDE_SLOTS) return
    const distance = slots * columnStep(track)
    track.animate(
      [{ transform: `translateX(${distance}px)` }, { transform: 'none' }],
      { duration: SLIDE.duration, easing: SLIDE.easing, composite: 'add' },
    )
  }, [trackRef, headSlot, reducedMotion])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track || rewindAt === undefined || reducedMotion) return
    const jolt = columnStep(track) * 0.7
    track.animate(
      [
        { transform: 'none', easing: 'cubic-bezier(0.5, 0, 0.75, 0)' },
        { transform: `translateX(${jolt}px)`, offset: 0.2, easing: 'ease-out' },
        {
          transform: `translateX(${jolt * 0.85}px)`,
          offset: 0.55,
          easing: SLIDE.easing,
        },
        { transform: 'none' },
      ],
      { duration: REWIND_MS, composite: 'add' },
    )
  }, [trackRef, rewindAt, reducedMotion])
}
