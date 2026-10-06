import { createContext, useContext, useEffect, useRef, useState } from 'react'
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
 * Holds back what a new block brought until the belt shows it landing, so a
 * number counts up as its batch lands rather than when the data comes in,
 * and every landing it hears is an arrival to show.
 *
 * `fresh` is what the block at `stamp` (the head) brought to this number;
 * `matches` picks the landings that count toward it. Keep it stable.
 */
export function useHeldUntilLanded(
  stamp: number | undefined,
  fresh: number,
  matches: (landing: Landing) => boolean,
) {
  const landings = useContext(LandingsContext)
  const [held, setHeld] = useState(0)
  const [arrival, setArrival] = useState<Arrival>()
  const last = useRef(stamp)
  // kept apart from the effect, so a re-run for the same block cannot drop it
  const release = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(release.current), [])

  useEffect(() => {
    if (stamp === undefined) return
    const isNew = last.current !== undefined && stamp > last.current
    last.current = stamp
    if (!isNew || fresh <= 0 || !landings) return
    setHeld(fresh)
    clearTimeout(release.current)
    release.current = setTimeout(() => setHeld(0), HOLD_LIMIT_MS)
  }, [stamp, fresh, landings])

  useEffect(
    () =>
      landings?.subscribe((landing) => {
        if (!matches(landing)) return
        setHeld((current) => Math.max(0, current - landing.blobs))
        setArrival((current) => ({
          amount: landing.blobs,
          id: (current?.id ?? 0) + 1,
        }))
      }),
    [landings, matches],
  )

  return { held, arrival }
}
