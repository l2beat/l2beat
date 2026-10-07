import { useState } from 'react'
import { SLOT_SECONDS, slotProgressAt, slotStart } from '~/utils/beaconSlots'

/**
 * The device's clock may be off, and a minute off would park the bay away
 * from the blocks coming in, so the head's slot corrects it
 */
const MAX_HEAD_LAG = 3 * SLOT_SECONDS
/** Where a corrected clock is put: about when a block reaches us */
const HEAD_SEEN_INTO_SLOT = 2

export interface ChainClock {
  /** Unix seconds */
  now: () => number
  /** Slots since genesis, with how far into the current one */
  progressNow: () => number
  /** Moves the clock to fit `head`, the newest slot the node has */
  correct: (head: number) => void
}

/** A clock that lives as long as the component */
export function useChainClock(): ChainClock {
  const [clock] = useState(createChainClock)
  return clock
}

/**
 * The chain's time, as the device tells it, put right by the head where the
 * device is far off: the head is never ahead of the true time, and rarely
 * far behind it
 */
function createChainClock(): ChainClock {
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
