import { SLOT_SECONDS, slotProgressAt, slotStart } from '@l2beat/shared-pure'
import { createContext, useContext, useState } from 'react'
import { LIVE_LAG_SLOTS } from '~/server/features/data-availability/live-blobs/liveBlobsSlots'

/**
 * The device's clock may be off, and a minute off would park the bay away
 * from the blocks coming in, so the head's slot corrects it. A head the
 * server calls live is not taken for a clock that runs ahead: its own slot
 * and the ones the server lets it trail by
 */
const MAX_HEAD_LAG = (LIVE_LAG_SLOTS + 1) * SLOT_SECONDS
/** Where a corrected clock is put: about when a block reaches us */
const HEAD_SEEN_INTO_SLOT = 2

export interface ChainClock {
  /** Slots since genesis, with how far into the current one */
  progressNow: () => number
  /** Moves the clock to fit `head`, the newest slot the node has */
  correct: (head: number) => void
}

/** The one clock of the live view, so a correction from the belt reaches every number and the bay alike */
export const ChainClockContext = createContext<ChainClock | undefined>(
  undefined,
)

/** The view's clock, or one that lives as long as the component outside a view */
export function useChainClock(): ChainClock {
  const [own] = useState(createChainClock)
  return useContext(ChainClockContext) ?? own
}

/**
 * The chain's time, as the device tells it, put right by the head where the
 * device is far off: the head is never ahead of the true time, and rarely
 * far behind it
 */
export function createChainClock(): ChainClock {
  let offset = 0
  const now = () => Date.now() / 1000 + offset
  return {
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
