import { useLayoutEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { toRgba } from '~/utils/color'

// thin enough for a whole day of bars to fit a table column
const BAR_WIDTH = 2
const BAR_STEP = BAR_WIDTH + 1
/** As the row's `h-5` */
const ROW_HEIGHT = 20
const SLIDE_MS = 700
const PAST_ALPHA = 0.6

/**
 * Steps are fixed in time: the last bar grows as batches land, and a new step
 * slides the row one bar left. The scale is rounded up to 1, 2 or 5 of a power
 * of ten so it, and with it every bar, seldom changes.
 *
 * A bar takes its new height at once. Easing it in would animate a transform
 * on an SVG rect, which browsers run on the main thread, laying the row out
 * on every frame of the ease.
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
  const barsRef = useRef<SVGSVGElement>(null)
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
  // jumps on the way; then the rest take the new scale
  const scale = niceCeil(Math.max(1, ...shown.map((b) => b.blobs)))
  const current = firstBucket + buckets.length - 1
  const bars = shown.map((bar) => ({
    ...bar,
    height: barHeight(bar.blobs, scale),
  }))

  return (
    <div
      className="h-5 overflow-hidden"
      style={{ width: buckets.length * BAR_STEP - 1 }}
      aria-hidden
    >
      {/* One SVG, not a box per bar: as a block lands, iOS Safari repaints
          the rows it touches, and paints each box in a row on its own. A
          fixed height, as Safari lays out a percent height in a table cell
          twice whenever a number in the table changes */}
      <svg
        ref={barsRef}
        width={bars.length * BAR_STEP - 1}
        height={ROW_HEIGHT}
        className="block"
      >
        {bars.map(({ step, blobs, height }, index) => (
          <rect
            key={step}
            x={index * BAR_STEP}
            y={ROW_HEIGHT - height}
            width={BAR_WIDTH}
            height={height}
            rx={1}
            style={{
              // dimmed by its color, as an opacity would make it a layer
              fill:
                blobs === 0
                  ? 'var(--divider)'
                  : step === current
                    ? color
                    : toRgba(color, PAST_ALPHA),
            }}
          />
        ))}
      </svg>
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

  useLayoutEffect(() => {
    const was = last.current
    last.current = { firstBucket, buckets }
    if (firstBucket - was.firstBucket !== 1 || reducedMotion) return
    setLeavingBar({ step: was.firstBucket, blobs: was.buckets[0] ?? 0 })
  }, [firstBucket, buckets, reducedMotion])

  const [drop] = useState(() => () => setLeavingBar(undefined))
  return { bar: leavingBar, drop }
}

/** 1, 2, 5, 10, 20, 50… */
function niceCeil(value: number) {
  const power = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 5, 10].find((s) => s * power >= value) ?? 10
  return step * power
}
