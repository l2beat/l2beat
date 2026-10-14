import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '~/utils/cn'
import { usePrefersReducedMotion } from './hooks'

// thin enough for a whole day of bars to fit a table column
const BAR_WIDTH = 2
const BAR_STEP = BAR_WIDTH + 1
const SLIDE_MS = 700

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
        {shown.map(({ step, blobs }) => (
          <div
            key={step}
            // grown by scaling, not by height: a height change lays out the
            // whole table again on every frame of the transition
            className={cn(
              'h-full shrink-0 origin-bottom rounded-[1px]',
              !sliding && 'transition-transform duration-700 ease-out',
            )}
            style={{
              width: BAR_WIDTH,
              transform: `scaleY(${blobs === 0 ? 0.08 : 0.2 + (0.8 * blobs) / scale})`,
              backgroundColor: blobs === 0 ? 'var(--divider)' : color,
              opacity: blobs === 0 || step === current ? 1 : 0.6,
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
