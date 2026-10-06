import { createContext, useContext, useEffect, useState } from 'react'
import { slotProgressAt, slotStart } from '~/utils/beaconSlots'
import { SLIDE_TIME } from './blocks/beltPosition'
import type { Arrival } from './liveMotion'

/** A batch coming to rest on the belt */
export interface Landing {
  posterId: string
  blobs: number
  slot: number
}

/** Where the belt tells of its landings, and the numbers around it hear */
export interface Landings {
  emit: (landing: Landing) => void
  subscribe: (listener: (landing: Landing) => void) => () => void
}

export function createLandings(): Landings {
  const listeners = new Set<(landing: Landing) => void>()
  return {
    emit: (landing) => {
      for (const listener of listeners) listener(landing)
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export const LandingsContext = createContext<Landings | undefined>(undefined)

/**
 * Longest a number waits for its batch to land. The belt may be scrolled
 * away, still loading, or failed, and the number must not wait for it forever
 */
const HOLD_LIMIT_MS = 3000

/**
 * A total over the hour, as the belt shows blobs come and go. What a new
 * block brought is counted in as the belt lands it, rather than when the data
 * comes in, and every landing it hears is an arrival to show. What left the
 * hour with that block is let go of once the belt has moved on to the next
 * slot: let go of at once, the number would dip just before the new blobs
 * land and climb back after, every block.
 *
 * `total` is the hour's at `stamp` (the head), `fresh` what the block at
 * `stamp` brought to it, and `matches` picks the landings that count toward
 * it. Keep `matches` stable.
 */
export function useLandedTotal(
  stamp: number | undefined,
  total: number,
  fresh: number,
  matches: (landing: Landing) => boolean,
) {
  const landings = useContext(LandingsContext)
  const [held, setHeld] = useState<Held>({
    stamp,
    total,
    arriving: 0,
    departed: 0,
  })
  const [arrival, setArrival] = useState<Arrival>()

  // Caught in the render it comes in, so not one frame shows the new total
  if (stamp !== held.stamp || total !== held.total) {
    setHeld(holdBack(held, stamp, total, landings ? fresh : 0))
  }

  const waiting = held.arriving > 0
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new block waits anew
  useEffect(() => {
    if (!waiting) return
    const timer = setTimeout(
      () => setHeld((current) => ({ ...current, arriving: 0 })),
      HOLD_LIMIT_MS,
    )
    return () => clearTimeout(timer)
  }, [held.stamp, waiting])

  // Not before the new blobs are in, so the number never falls as they land,
  // and just after the belt's slide, so its count-down never slows the slide
  const departing = held.departed > 0 && !waiting
  useEffect(() => {
    if (!departing) return
    const now = Date.now() / 1000
    const slideEnds =
      slotStart(Math.floor(slotProgressAt(now - SLIDE_TIME)) + 1) + SLIDE_TIME
    const timer = setTimeout(
      () => setHeld((current) => ({ ...current, departed: 0 })),
      (slideEnds - now) * 1000,
    )
    return () => clearTimeout(timer)
  }, [departing])

  useEffect(
    () =>
      landings?.subscribe((landing) => {
        if (!matches(landing)) return
        setHeld((current) => ({
          ...current,
          arriving: Math.max(0, current.arriving - landing.blobs),
        }))
        // a block's batches add up, so the pop says all the number gained
        setArrival((current) => ({
          amount:
            landing.blobs +
            (current?.slot === landing.slot ? current.amount : 0),
          slot: landing.slot,
        }))
      }),
    [landings, matches],
  )

  return { value: total - held.arriving + held.departed, arrival }
}

/** A total over the hour, with what is held back from it for now */
interface Held {
  stamp: number | undefined
  total: number
  /** What the newest block brought, until the belt lands it */
  arriving: number
  /** What left the hour as blocks came, until the belt moves on a slot */
  departed: number
}

/** What to hold back once the total is `total` at `stamp` */
function holdBack(
  held: Held,
  stamp: number | undefined,
  total: number,
  fresh: number,
): Held {
  const isNew =
    stamp !== undefined && held.stamp !== undefined && stamp > held.stamp
  if (!isNew) return { ...held, stamp, total }
  // what left the hour: the old total and the new blobs, less the new total
  const departed = Math.max(0, held.total + fresh - total)
  return {
    stamp,
    total,
    arriving: fresh,
    departed: held.departed + departed,
  }
}
