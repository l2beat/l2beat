import { type RefObject, useLayoutEffect, useRef, useState } from 'react'
import { toRgba } from './color'
import { usePrefersReducedMotion } from './hooks'

// thin enough for a whole day of bars to fit a table column
const BAR_WIDTH = 2
const BAR_STEP = BAR_WIDTH + 1
/** As the row's `h-5` */
const ROW_HEIGHT = 20
const SLIDE_MS = 700
const GROW_MS = 700
/** Tailwind's `ease-out` */
const GROW_EASING = 'cubic-bezier(0, 0, 0.2, 1)'
const PAST_ALPHA = 0.6

/**
 * Steps are fixed in time: the last bar grows as batches land, and a new step
 * slides the row one bar left. The scale is rounded up to 1, 2 or 5 of a power
 * of ten so it, and with it every bar, seldom changes.
 */
export function Activity({
  buckets,
  firstBucket,
  color,
}: {
  buckets: number[]
  /** So a bar keeps its element as it moves */
  firstBucket: number
  color: string
}) {
  const barsRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const leaving = useLeavingBar(buckets, firstBucket, reducedMotion)

  // The bar that left is still drawn, so the row starts where it was and
  // moves one step left, carrying it out of view; then it is dropped
  useLayoutEffect(() => {
    const bars = barsRef.current
    if (!leaving.bar || !bars) return
    const slide = bars.animate(
      [{ transform: 'none' }, { transform: `translateX(-${BAR_STEP}px)` }],
      {
        duration: SLIDE_MS,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        // held at the end until the bar is dropped, in the same frame
        fill: 'forwards',
      },
    )
    slide.onfinish = leaving.drop
    return () => slide.cancel()
  }, [leaving.bar, leaving.drop])

  const shown = leaving.bar
    ? [leaving.bar, ...toBars(buckets, firstBucket)]
    : toBars(buckets, firstBucket)
  // Until it is gone, the leaving bar keeps its part in the scale, so nothing
  // jumps on the way; then the rest grow or shrink to the new scale
  const scale = niceCeil(Math.max(1, ...shown.map((b) => b.blobs)))
  const current = firstBucket + buckets.length - 1
  // as the row slides, bars must not also grow or shrink on the way
  const sliding = leaving.bar !== undefined || leaving.pending
  const bars = shown.map((bar) => ({
    ...bar,
    height: barHeight(bar.blobs, scale),
  }))
  useGrowingBars(barsRef, bars, !sliding && !reducedMotion)

  return (
    <div
      className="h-5 overflow-hidden"
      style={{ width: buckets.length * BAR_STEP - 1 }}
      aria-hidden
    >
      <div
        ref={barsRef}
        // a fixed height: Safari lays out a percent height in a table cell
        // twice, every bar with it, whenever a number in the table changes
        className="flex h-5 items-end gap-px"
      >
        {bars.map(({ step, blobs, height }) => (
          <div
            key={step}
            className="shrink-0 origin-bottom rounded-[1px]"
            style={{
              width: BAR_WIDTH,
              height,
              // dimmed by its color, as an opacity would make it a layer
              backgroundColor:
                blobs === 0
                  ? 'var(--divider)'
                  : step === current
                    ? color
                    : toRgba(color, PAST_ALPHA),
            }}
          />
        ))}
      </div>
    </div>
  )
}

interface Bar {
  step: number
  blobs: number
}

/** Px; a bar with no blobs keeps a sliver, so the row still reads as a day */
function barHeight(blobs: number, scale: number) {
  const share = blobs === 0 ? 0.08 : 0.2 + (0.8 * blobs) / scale
  // to a hundredth, so float error does not reach the markup
  return Math.round(ROW_HEIGHT * share * 100) / 100
}

/**
 * Bars stand at their height, with no transform or opacity, as either makes
 * a bar a layer of its own, and while any animation runs off the compositor
 * (a number's color as it counts) WebKit goes through every layer on each
 * frame: ~1,600 bars, 2 ms a frame on a Mac. A bar whose height changed eases
 * into it by scaling, on the compositor, and is a layer only while it does.
 */
function useGrowingBars(
  barsRef: RefObject<HTMLDivElement | null>,
  bars: { step: number; height: number }[],
  animate: boolean,
) {
  const drawn = useRef(new Map<number, number>())
  useLayoutEffect(() => {
    const row = barsRef.current
    if (!row) return
    const next = new Map<number, number>()
    bars.forEach(({ step, height }, i) => {
      next.set(step, height)
      const was = drawn.current.get(step)
      const bar = row.children[i]
      if (!animate || was === undefined || was === height || !bar) return
      bar.animate(
        [{ transform: `scaleY(${was / height})` }, { transform: 'none' }],
        { duration: GROW_MS, easing: GROW_EASING },
      )
    })
    drawn.current = next
  })
}

function toBars(buckets: number[], firstBucket: number): Bar[] {
  return buckets.map((blobs, i) => ({ step: firstBucket + i, blobs }))
}

/**
 * Kept until the slide carrying it out is done; set before paint, so the row
 * is never drawn without it first. A jump of several steps keeps nothing.
 */
function useLeavingBar(
  buckets: number[],
  firstBucket: number,
  reducedMotion: boolean,
) {
  const [leavingBar, setLeavingBar] = useState<Bar>()
  const last = useRef({ firstBucket, buckets })
  // the render with the new step, before the effect below has caught it
  const pending = firstBucket !== last.current.firstBucket

  useLayoutEffect(() => {
    const was = last.current
    last.current = { firstBucket, buckets }
    if (firstBucket - was.firstBucket !== 1 || reducedMotion) return
    setLeavingBar({ step: was.firstBucket, blobs: was.buckets[0] ?? 0 })
  }, [firstBucket, buckets, reducedMotion])

  const [drop] = useState(() => () => setLeavingBar(undefined))
  return { bar: leavingBar, pending, drop }
}

/** 1, 2, 5, 10, 20, 50… */
function niceCeil(value: number) {
  const power = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 5, 10].find((s) => s * power >= value) ?? 10
  return step * power
}
