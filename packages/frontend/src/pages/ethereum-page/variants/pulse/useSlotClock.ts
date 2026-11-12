import { useLayoutEffect, useRef } from 'react'
import type { HeadBlock } from '../../live/types'
import { SLOT_SECONDS } from './format'

export interface SlotReading {
  /** Fractional slot: the head's slot plus how far into the next one we are */
  position: number
  msLeft: number
  slotMs: number
}

export interface SlotClock {
  read: (now: number) => SlotReading | undefined
}

/**
 * Times the slot from when its block reached us to when the stream expects
 * the next one, rather than from the wall clock: at 3× speed, or with a
 * device clock that is off, the trace and countdown still meet the next block.
 * Read from animation frames, so ticking never renders React.
 */
export function useSlotClock(
  head: HeadBlock | undefined,
  nextSlotAt: number | undefined,
): SlotClock {
  const state = useRef<
    { slot: number; start: number; nextAt: number } | undefined
  >(undefined)
  const clock = useRef<SlotClock>({
    read(now) {
      const s = state.current
      if (!s) return undefined
      const slotMs = Math.max(1, s.nextAt - s.start)
      const fraction = Math.min(1, Math.max(0, (now - s.start) / slotMs))
      return {
        position: s.slot + fraction,
        msLeft: Math.max(0, s.nextAt - now),
        slotMs,
      }
    },
  })

  const slot = head?.slot
  useLayoutEffect(() => {
    if (slot === undefined || nextSlotAt === undefined) return
    const now = Date.now()
    const current = state.current
    if (current?.slot === slot) {
      current.nextAt = nextSlotAt
      return
    }
    // the first block came mid-slot, the later ones as their slot began
    const start = current
      ? now
      : Math.min(now, nextSlotAt - SLOT_SECONDS * 1000)
    state.current = { slot, start, nextAt: nextSlotAt }
  }, [slot, nextSlotAt])

  return clock.current
}
