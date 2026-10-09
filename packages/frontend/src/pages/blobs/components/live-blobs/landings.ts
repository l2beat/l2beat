import { SLOT_SECONDS } from '@l2beat/shared-pure'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { arrivesNow } from './blocks/beaconChain'
import { SLIDE_TIME } from './blocks/beltPosition'
import { BATCH_STAGGER, LAND_AFTER } from './blocks/motion'
import { useChainClock } from './chainClock'
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
  /**
   * The newest block the reader has had from the start, given `head`: the
   * head the page loaded with, or a lower one once the chain takes that back,
   * as a block in its slot then comes in front of the reader
   */
  loadedHead: (head: number) => number
}

export function createLandings(): Landings {
  const listeners = new Set<(landing: Landing) => void>()
  let loaded: number | undefined
  return {
    emit: (landing) => {
      for (const listener of listeners) listener(landing)
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    loadedHead: (head) => {
      loaded = Math.min(loaded ?? head, head)
      return loaded
    },
  }
}

export const LandingsContext = createContext<Landings | undefined>(undefined)

/**
 * Whether the block at `slot` came after the page loaded. The belt drops the
 * block the page loaded with too, but no number has been seen without it, so
 * counting it up would show an arrival the reader never missed: a "+11" by a
 * number that was never 11 lower
 */
export function cameAfterLoad(landings: Landings, slot: number | undefined) {
  return slot !== undefined && slot > landings.loadedHead(slot)
}

/**
 * Longest a number waits for `blobs` of a block to land, in milliseconds. The
 * belt may be scrolled away, still loading, or failed, and the number must
 * not wait for it forever; but a working belt lands a block's batches one
 * after another, and the last of as many batches as blobs lands last
 */
export function holdLimitMs(blobs: number) {
  return 1000 * (blobs * BATCH_STAGGER + LAND_AFTER + HOLD_SLACK)
}
/** Seconds past the last landing before a number stops waiting for it */
const HOLD_SLACK = 1

/**
 * A total over the window, as the belt shows blobs come and go. What a new
 * block brought is counted in as the belt lands it, rather than when the data
 * comes in, and each landing is an arrival to show. The block the page loaded
 * with is counted in from the start, and its landings show nothing. What left
 * the window with a block is let go of once the belt has moved on to the next
 * slot: let go of at once, the number would dip just before the new blobs
 * land and climb back after, every block.
 *
 * `total` is the window's at `stamp` (the head), `fresh` what the block at
 * `stamp` brought to it, `blockBlobs` all that block brought (its last batch
 * lands last, whoever's it is), and `matches` picks the landings that count
 * toward it. Keep `matches` stable.
 */
export function useLandedTotal(
  stamp: number | undefined,
  total: number,
  fresh: number,
  blockBlobs: number,
  matches: (landing: Landing) => boolean,
) {
  const landings = useContext(LandingsContext)
  const clock = useChainClock()
  // put right here, before the read below: the belt's correction comes in
  // its effect, after this render has already judged the newest block
  if (stamp !== undefined) clock.correct(stamp)
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
        // a landing from above the stamp is of a block the chain took back
        if (
          !matches(landing) ||
          isAbove(landing.slot, stampInHand.current) ||
          !cameAfterLoad(landings, landing.slot)
        ) {
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

  return { value: total - held.arriving + held.departed, arrival }
}

/** A total over the window, with what is held back from it for now */
export interface Held {
  stamp: number | undefined
  total: number
  /** All the newest block brought, for how long its landings take */
  blockBlobs: number
  /** What the newest block brought to this total, until the belt lands it */
  arriving: number
  /** What left the window as blocks came, until the belt moves on a slot */
  departed: number
}

/**
 * What to hold back as a number starts. The belt drops the newest block if it
 * is of this slot or the last (as `arrivesNow` has it), so a number that comes
 * on as it does, like a poster's first row, waits for its landing
 */
export function firstHeld(
  stamp: number | undefined,
  total: number,
  fresh: number,
  blockBlobs: number,
  currentSlot: number,
): Held {
  const landing =
    stamp !== undefined && arrivesNow(stamp, stamp, true, currentSlot)
  return {
    stamp,
    total,
    blockBlobs: landing ? blockBlobs : 0,
    arriving: landing ? fresh : 0,
    departed: 0,
  }
}

/** What to hold back once the total is `total` at `stamp` */
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
  // what left the window: the old total and the new blobs, less the new total
  const departed = Math.max(0, held.total + fresh - total)
  return {
    stamp,
    total,
    blockBlobs,
    arriving: fresh,
    departed: held.departed + departed,
  }
}

/** Seconds until the belt's slide under way at `progress` ends, or the next one's once this slot's is over */
export function secondsUntilSlideEnds(progress: number) {
  const slideStartedAt = progress - SLIDE_TIME / SLOT_SECONDS
  const slideEnds = Math.floor(slideStartedAt) + 1
  return (slideEnds - progress) * SLOT_SECONDS + SLIDE_TIME
}

function isAbove(slot: number | undefined, than: number | undefined) {
  return slot !== undefined && than !== undefined && slot > than
}
