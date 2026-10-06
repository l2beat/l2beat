import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '~/utils/cn'
import { usePrefersReducedMotion } from './hooks'

const BAR_WIDTH = 5
const BAR_STEP = BAR_WIDTH + 1
const SLIDE_MS = 700

/**
 * Blobs in each five minutes of the hour, the step under way on the right.
 * The steps are fixed in time, so the bars move only two ways: the last one
 * grows as batches land in it, and when a new step starts the whole row
 * slides one bar to the left, the oldest sliding out past the left edge.
 * Scaled to the row's own busiest step, rounded up to 1, 2 or 5 of a power
 * of ten so the scale, and with it every bar, seldom changes.
 */
export function Activity({
  buckets,
  firstBucket,
  color,
}: {
  buckets: number[]
  /** Which step the first bar is, so a bar keeps its element as it moves */
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
      <div ref={barsRef} className="flex h-full items-end gap-px">
        {shown.map(({ step, blobs }) => (
          <div
            key={step}
            className={cn(
              'shrink-0 rounded-[1px]',
              !sliding && 'transition-[height] duration-700 ease-out',
            )}
            style={{
              width: BAR_WIDTH,
              height: `${blobs === 0 ? 8 : 20 + (80 * blobs) / scale}%`,
              backgroundColor: blobs === 0 ? 'var(--divider)' : color,
              // the step under way stands out from the finished ones
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
 * The bar that fell off the left when a new step started, kept until the
 * slide that carries it out is done. Set before paint, so the row is never
 * drawn without it first. A jump of several steps, as after a hidden tab,
 * keeps nothing: the row is just redrawn.
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

/** The smallest of 1, 2, 5, 10, 20, 50… at least `value` */
function niceCeil(value: number) {
  const power = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 5, 10].find((s) => s * power >= value) ?? 10
  return step * power
}
