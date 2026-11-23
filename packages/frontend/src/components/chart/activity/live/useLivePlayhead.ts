import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LIVE_JUMP_SECONDS } from '~/utils/range/liveRanges'

/** The latest reads whose longest lag the window stays behind the clock by */
const LAG_SAMPLES = 8
/**
 * How often the backend stores new blocks: `HeadFollower`'s interval, which
 * the client's bundle can't import
 */
const STORE_SECONDS = 10
/** Kept between the window's end and the data's */
const MARGIN_SECONDS = 1
/** How much faster than the clock the window may catch up */
export const CATCH_UP = 1.5
/**
 * Drawings the charts are drawn past their right edge, for what slides in
 * before the next drawing. They never slide further: after a stalled frame
 * they wait for the drawing instead of leaving a gap at the edge
 */
export const LOOKAHEAD_DRAWINGS = 2

/**
 * Where a window that scrolls with the clock ends, instead of jumping with
 * each read. It stays as far behind the clock as the data lately was, so
 * blocks stored in batches arrive before the window gets to them, and it
 * never passes the data's end or moves back.
 *
 * Drawing the charts every frame costs too much, so the window is drawn
 * again only every `redrawEvery` seconds, and in between `onGlide` gets, each
 * frame, how far the window has moved past what is drawn. Held, the window
 * is drawn where it is and stops, as hovering reads the drawing's positions,
 * and then catches up. Still, it moves only with each drawing
 */
export function useLivePlayhead({
  dataEnd,
  earliestEnd,
  readAtMs,
  redrawEvery,
  onGlide,
  held,
  still,
}: {
  /** Where the data read ends, in seconds. Undefined stops the window */
  dataEnd: number | undefined
  /** Where the window may end earliest, as its data is read only so far before it */
  earliestEnd: number | undefined
  /** When the data was read */
  readAtMs: number
  /** Seconds the window moves between drawings */
  redrawEvery: number
  /** Seconds the window has moved past what is drawn */
  onGlide: (seconds: number) => void
  held: boolean
  /** For a visitor who prefers reduced motion */
  still: boolean
}): number | undefined {
  const [playhead, setPlayhead] = useState<number>()
  const lags = useRef<number[]>([])
  /** The range the lags are of, by how often its window is drawn */
  const lagsOf = useRef(redrawEvery)
  const last = useRef<{ playhead: number; at: number } | undefined>(undefined)
  const requested = useRef<number | undefined>(undefined)
  const drawn = useRef<number | undefined>(undefined)
  const glide = useRef(onGlide)
  glide.current = onGlide
  const hold = useRef(held)
  hold.current = held
  const stay = useRef(still)
  stay.current = still

  useEffect(() => {
    if (dataEnd === undefined) return
    // each range's data ends on its own bucket, so its reads lag by their own
    if (lagsOf.current !== redrawEvery) {
      lagsOf.current = redrawEvery
      lags.current = []
    }
    const lag = readAtMs / 1000 - dataEnd
    // the first read may have come just after a batch, so a batch is added
    lags.current =
      lags.current.length === 0
        ? [lag + STORE_SECONDS]
        : [...lags.current, lag].slice(-LAG_SAMPLES)
  }, [dataEnd, readAtMs, redrawEvery])

  // the state is of the drawing before, which may be of other data, as
  // another range's
  const read: [number, number] | undefined =
    dataEnd === undefined || earliestEnd === undefined
      ? undefined
      : [earliestEnd, dataEnd]
  const shown =
    read && playhead !== undefined ? withinRead(playhead, read) : undefined

  // after every drawing and before it is painted, as one may also redraw
  // the charts' elements without their offset
  useLayoutEffect(() => {
    drawn.current = shown
    glide.current(
      shown === undefined ||
        read === undefined ||
        last.current === undefined ||
        stay.current
        ? 0
        : withinRead(last.current.playhead, read) - shown,
    )
  })

  useEffect(() => {
    if (dataEnd === undefined || earliestEnd === undefined) {
      last.current = undefined
      requested.current = undefined
      lags.current = []
      setPlayhead(undefined)
      return
    }
    let frame = 0
    const step = () => {
      const now = Date.now() / 1000
      if (hold.current && last.current !== undefined) {
        // a hold can begin on data read since, as for another range
        last.current = {
          playhead: withinRead(last.current.playhead, [earliestEnd, dataEnd]),
          at: now,
        }
        if (requested.current !== last.current.playhead) {
          requested.current = last.current.playhead
          setPlayhead(last.current.playhead)
        }
        frame = requestAnimationFrame(step)
        return
      }
      const next = advancePlayhead(
        last.current,
        getPlayheadTarget(dataEnd, now, lags.current),
        [earliestEnd, dataEnd],
        now,
      )
      last.current = { playhead: next, at: now }
      if (shouldRedraw(requested.current, next, redrawEvery)) {
        requested.current = next
        setPlayhead(next)
      }
      if (drawn.current !== undefined && !stay.current) {
        glide.current(
          Math.min(next - drawn.current, LOOKAHEAD_DRAWINGS * redrawEvery),
        )
      }
      frame = requestAnimationFrame(step)
    }
    step()
    return () => cancelAnimationFrame(frame)
  }, [dataEnd, earliestEnd, redrawEvery])

  return shown
}

/**
 * Where the window heads: as far behind the clock as the reads lately were
 * behind their data, and a margin, but not past the data
 *
 * @param lags Seconds from each read's data end to when it was read
 */
export function getPlayheadTarget(
  dataEnd: number,
  now: number,
  lags: number[],
) {
  return Math.min(dataEnd, now - Math.max(...lags) - MARGIN_SECONDS)
}

/**
 * Whether a window now ending at `next` is drawn again: first, once it has
 * moved `redrawEvery` seconds past the drawing asked for last, or moved back
 */
export function shouldRedraw(
  requested: number | undefined,
  next: number,
  redrawEvery: number,
) {
  return (
    requested === undefined ||
    next - requested >= redrawEvery ||
    next < requested
  )
}

/**
 * Where the window ends next: on toward `target`, at most `CATCH_UP` times as
 * fast as the clock, and not back for a later target, or there at once when
 * more than `LIVE_JUMP_SECONDS` behind. But
 * never past the data: a longer range's data ends on its longer bucket, so
 * switching to one can end it before where the window had got to. Nor so far
 * behind it that the window's left edge was not read
 */
export function advancePlayhead(
  previous: { playhead: number; at: number } | undefined,
  target: number,
  read: [number, number],
  now: number,
) {
  const next =
    previous === undefined || target - previous.playhead > LIVE_JUMP_SECONDS
      ? target
      : Math.max(
          previous.playhead,
          Math.min(target, previous.playhead + (now - previous.at) * CATCH_UP),
        )
  return withinRead(next, read)
}

/** Not past the data, nor so far behind it that the window's left edge was not read */
function withinRead(
  playhead: number,
  [earliestEnd, dataEnd]: [number, number],
) {
  return Math.min(Math.max(playhead, earliestEnd), dataEnd)
}
