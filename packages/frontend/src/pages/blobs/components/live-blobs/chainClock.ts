import { SLOT_SECONDS, slotProgressAt, slotStart } from '@l2beat/shared-pure'
import { createContext, useContext, useState } from 'react'
import { LIVE_LAG_SLOTS } from '~/server/features/data-availability/live-blobs/liveBlobsSlots'

/** A head the server still calls live is no sign of a clock running ahead */
const MAX_HEAD_LAG = (LIVE_LAG_SLOTS + 1) * SLOT_SECONDS
/** Seconds into the slot: about when a block reaches us */
const HEAD_SEEN_INTO_SLOT = 2

export interface ChainClock {
  /** Unix seconds, with the fraction */
  now: () => number
  /** Fractional slots since genesis */
  progressNow: () => number
  correct: (head: number) => void
}

/** Shared, so a correction from the belt reaches every number and the bay alike */
export const ChainClockContext = createContext<ChainClock | undefined>(
  undefined,
)

export function useChainClock(): ChainClock {
  const [own] = useState(createChainClock)
  return useContext(ChainClockContext) ?? own
}

/**
 * The device's clock may be off, and a minute off would park the bay away from
 * the blocks coming in. The head is never ahead of true time and rarely far
 * behind, so it corrects the clock
 */
export function createChainClock(): ChainClock {
  let offset = 0
  const now = () => Date.now() / 1000 + offset
  return {
    now,
    progressNow: () => slotProgressAt(now()),
    correct: (head) => {
      const start = slotStart(head)
      const at = now()
      if (at < start || at > start + MAX_HEAD_LAG) {
        offset += start + HEAD_SEEN_INTO_SLOT - at
      }
    },
  }
}
