import { SLOT_SECONDS } from '@l2beat/shared-pure'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { arrivesNow } from './blocks/beaconChain'
import { SLIDE_TIME } from './blocks/beltPosition'
import { BATCH_STAGGER, LAND_AFTER } from './blocks/motion'
import { useChainClock } from './chainClock'
import type { Arrival } from './liveMotion'

export interface Landing {
  posterId: string
  blobs: number
  slot: number
}

/** The belt emits its landings; the numbers around it subscribe */
export interface Landings {
  emit: (landing: Landing) => void
  subscribe: (listener: (landing: Landing) => void) => () => void
  /** The head the page loaded with, or lower once the chain takes that back */
  loadedHead: (head: number) => number
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
    loadedHead: trackLoadedHead(),
  }
}

/**
 * The same landings, for numbers first shown after the page loaded, as the
 * posters table built after the belt is. The block they first show is theirs
 * to show whole, as the reader never saw them without it; its landings may
 * well have come before they could listen
 */
export function shownLater(landings: Landings): Landings {
  return { ...landings, loadedHead: trackLoadedHead() }
}

function trackLoadedHead() {
  let loaded: number | undefined
  return (head: number) => {
    loaded = Math.min(loaded ?? head, head)
    return loaded
  }
}

export const LandingsContext = createContext<Landings | undefined>(undefined)

export const anyLanding = (_: Landing) => true

/**
 * The belt drops the block the page loaded with too, but no number was ever
 * shown without it, so counting it up would show a "+11" the reader never missed
 */
export function cameAfterLoad(landings: Landings, slot: number | undefined) {
  return slot !== undefined && slot > landings.loadedHead(slot)
}

/** Whether a landing counts toward a number holding the block at `stamp` */
export function countsToward(
  landing: Landing,
  stamp: number | undefined,
  landings: Landings,
  matches: (landing: Landing) => boolean,
) {
  // with no data it holds nothing, and asking would set its load head
  if (stamp === undefined || !matches(landing)) return false
  // a landing from above the stamp is of a block the chain took back
  return !isAbove(landing.slot, stamp) && cameAfterLoad(landings, landing.slot)
}

/**
 * The belt may be scrolled away, loading or failed, so a number must not wait
 * for it forever; a working belt lands at most `blobs` batches, one after another
 */
export function holdLimitMs(blobs: number) {
  return 1000 * (blobs * BATCH_STAGGER + LAND_AFTER + HOLD_SLACK)
}
/** Seconds */
const HOLD_SLACK = 1

/**
 * A window total that counts a new block in as the belt lands it, not when the
 * data comes. What left the window is let go of only after the belt's next
 * slide, or the number would dip and climb back every block.
 *
 * `fresh` is what the block at `stamp` brought to `total`; `blockBlobs` all it
 * brought (its last batch lands last, whoever's it is). Keep `matches` stable.
 */
export function useLandedTotal(
  stamp: number | undefined,
  total: number,
  fresh: number,
  blockBlobs: number,
  matches: (landing: Landing) => boolean,
) {
  const landings = useContext(LandingsContext)
  // put right by `useLiveBlobs`, which the callers read `stamp` from
  const clock = useChainClock()
  const toLand = landings && cameAfterLoad(landings, stamp) ? fresh : 0
  const [held, setHeld] = useState<Held>(() =>
    firstHeld(
      stamp,
      total,
      toLand,
      blockBlobs,
      Math.floor(clock.progressNow()),
    ),
  )
  const [arrival, setArrival] = useState<Arrival>()

  // Caught in the render it comes in, so not one frame shows the new total
  if (stamp !== held.stamp || total !== held.total) {
    setHeld(
      holdBack(
        held,
        stamp,
        total,
        toLand,
        blockBlobs,
        Math.floor(clock.progressNow()),
      ),
    )
  }
  const stampInHand = useRef(held.stamp)
  stampInHand.current = held.stamp

  const waiting = held.arriving > 0
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new block waits anew
  useEffect(() => {
    if (!waiting) return
    const timer = setTimeout(
      () => setHeld((current) => ({ ...current, arriving: 0 })),
      holdLimitMs(held.blockBlobs),
    )
    return () => clearTimeout(timer)
  }, [held.stamp, waiting])

  // Not before the new blobs are in, so the number never falls as they land,
  // and just after the belt's slide, so its count-down never slows the slide
  const departing = held.departed > 0 && !waiting
  useEffect(() => {
    if (!departing) return
    const timer = setTimeout(
      () => setHeld((current) => ({ ...current, departed: 0 })),
      secondsUntilSlideEnds(clock.progressNow()) * 1000,
    )
    return () => clearTimeout(timer)
  }, [departing, clock])

  useEffect(
    () =>
      landings?.subscribe((landing) => {
        if (!countsToward(landing, stampInHand.current, landings, matches)) {
          return
        }
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

  return {
    value: total - held.arriving + held.departed,
    arrival,
    landing: held.arriving > 0,
  }
}

export interface Held {
  stamp: number | undefined
  total: number
  /** For how long the newest block's landings take */
  blockBlobs: number
  /** Held back until the belt lands it */
  arriving: number
  /** Held in until the belt moves on a slot */
  departed: number
}

/**
 * The belt drops the newest block if `arrivesNow`, so a number that appears
 * with it, like a poster's first row, waits for its landing
 */
export function firstHeld(
  stamp: number | undefined,
  total: number,
  fresh: number,
  blockBlobs: number,
  currentSlot: number,
): Held {
  const landing = landsNow(stamp, currentSlot)
  return {
    stamp,
    total,
    blockBlobs: landing ? blockBlobs : 0,
    arriving: landing ? fresh : 0,
    departed: 0,
  }
}

export function holdBack(
  held: Held,
  stamp: number | undefined,
  total: number,
  fresh: number,
  blockBlobs: number,
  currentSlot: number,
): Held {
  // the number came before any data: the first data is its start
  if (held.stamp === undefined) {
    return firstHeld(stamp, total, fresh, blockBlobs, currentSlot)
  }
  // the chain took its newest block back: nothing of it is arriving any more,
  // and what left the window as it came is back in
  if (isAbove(held.stamp, stamp)) {
    return { stamp, total, blockBlobs: 0, arriving: 0, departed: 0 }
  }
  if (!isAbove(stamp, held.stamp)) return { ...held, stamp, total }
  const departed = Math.max(0, held.total + fresh - total)
  const landing = landsNow(stamp, currentSlot)
  return {
    stamp,
    total,
    blockBlobs: landing ? blockBlobs : 0,
    arriving: landing ? fresh : 0,
    departed: held.departed + departed,
  }
}

/** The slide under way, or the next one's once this slot's is over */
export function secondsUntilSlideEnds(progress: number) {
  const slideStartedAt = progress - SLIDE_TIME / SLOT_SECONDS
  const slideEnds = Math.floor(slideStartedAt) + 1
  return (slideEnds - progress) * SLOT_SECONDS + SLIDE_TIME
}

/** Whether the belt drops, and so lands, the newest block: one stored late is placed quietly */
function landsNow(stamp: number | undefined, currentSlot: number) {
  return stamp !== undefined && arrivesNow(stamp, stamp, true, currentSlot)
}

function isAbove(slot: number | undefined, than: number | undefined) {
  return slot !== undefined && than !== undefined && slot > than
}
