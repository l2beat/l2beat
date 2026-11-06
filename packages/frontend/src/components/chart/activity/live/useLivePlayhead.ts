import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/** Reads whose lag the delay covers, about 40 s of them */
const LAG_SAMPLES = 8
/** About how often the backend stores new blocks */
const STORE_SECONDS = 10
/** Kept between the window's end and the data's */
const MARGIN_SECONDS = 1
/** How much faster than the clock the window may catch up */
const CATCH_UP = 1.5
/** Behind by more, as after a hidden tab, the window jumps instead */
const JUMP_SECONDS = 60

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
 * and then catches up
 *
 * @param dataEnd Where the data read ends, in seconds. Undefined stops it
 * @param readAt When the data was read, in milliseconds
 */
export function useLivePlayhead(
  dataEnd: number | undefined,
  readAt: number,
  redrawEvery: number,
  onGlide: (seconds: number) => void,
  held: boolean,
): number | undefined {
  const [playhead, setPlayhead] = useState<number>()
  const lags = useRef<number[]>([])
  const last = useRef<{ playhead: number; at: number } | undefined>(undefined)
  const requested = useRef<number | undefined>(undefined)
  const drawn = useRef<number | undefined>(undefined)
  const glide = useRef(onGlide)
  glide.current = onGlide
  const hold = useRef(held)
  hold.current = held

  useEffect(() => {
    if (dataEnd === undefined) return
    const lag = readAt / 1000 - dataEnd
    // the first read may have come just after a batch, so a batch is added
    lags.current =
      lags.current.length === 0
        ? [lag + STORE_SECONDS]
        : [...lags.current, lag].slice(-LAG_SAMPLES)
  }, [dataEnd, readAt])

  // after every drawing and before it is painted, as one may also redraw
  // the charts' elements without their offset
  useLayoutEffect(() => {
    drawn.current = playhead
    glide.current(
      playhead === undefined || last.current === undefined
        ? 0
        : last.current.playhead - playhead,
    )
  })

  useEffect(() => {
    if (dataEnd === undefined) {
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
        last.current = { ...last.current, at: now }
        if (requested.current !== last.current.playhead) {
          requested.current = last.current.playhead
          setPlayhead(last.current.playhead)
        }
        frame = requestAnimationFrame(step)
        return
      }
      const target = Math.min(
        dataEnd,
        now - Math.max(...lags.current) - MARGIN_SECONDS,
      )
      const previous = last.current
      const next =
        previous === undefined || target - previous.playhead > JUMP_SECONDS
          ? target
          : Math.max(
              previous.playhead,
              Math.min(
                target,
                previous.playhead + (now - previous.at) * CATCH_UP,
              ),
            )
      last.current = { playhead: next, at: now }
      if (
        requested.current === undefined ||
        next - requested.current >= redrawEvery
      ) {
        requested.current = next
        setPlayhead(next)
      }
      if (drawn.current !== undefined) glide.current(next - drawn.current)
      frame = requestAnimationFrame(step)
    }
    step()
    return () => cancelAnimationFrame(frame)
  }, [dataEnd, redrawEvery])

  return playhead
}
