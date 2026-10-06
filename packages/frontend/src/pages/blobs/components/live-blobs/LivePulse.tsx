import { memo, useLayoutEffect, useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { formatWhole } from './blocks/format'
import { usePrefersReducedMotion } from './hooks'
import type { BlockLimits } from './model'
import { useLiveBlobs } from './useLiveBlobs'

/** The hour behind the belt, under it */
export function LivePulse({ limits }: { limits: BlockLimits }) {
  const { data } = useLiveBlobs()
  if (!data) return <Skeleton className="h-14 w-full" />
  return (
    <BlobPulse
      blobsPerSlot={data.window.blobsPerSlot}
      head={data.head}
      limits={limits}
    />
  )
}

const PULSE_HEIGHT = 48
const BAR_STEP = 4
const BAR_WIDTH = 3
const SLOTS_SHOWN = 300

/**
 * Every block of the hour as a bar of its blobs, newest on the right. Each
 * new block slides the hour along by one and grows in at the end, so the
 * hour reads as passing, block by block.
 */
function BlobPulse({
  blobsPerSlot,
  head,
  limits,
}: {
  blobsPerSlot: (number | null)[]
  head: number
  limits: BlockLimits
}) {
  const barsRef = useRef<SVGGElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  // Bars keep their place by slot and the group moves, so a new block
  // moves one element rather than all 300
  const firstHead = useRef(head)
  const width = SLOTS_SHOWN * BAR_STEP
  const scale = PULSE_HEIGHT / limits.maxBlobsPerBlock
  const targetY = PULSE_HEIGHT - limits.targetBlobsPerBlock * scale

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new head is what slides it
  useLayoutEffect(() => {
    if (reducedMotion || !barsRef.current) return
    barsRef.current.animate(
      [{ transform: `translateX(${BAR_STEP}px)` }, { transform: 'none' }],
      { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )
  }, [head, reducedMotion])

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${PULSE_HEIGHT}`}
        preserveAspectRatio="none"
        className="block h-10 w-full"
        role="img"
        aria-label={`Blobs in each of the last ${formatWhole(blobsPerSlot.length)} slots`}
      >
        <g ref={barsRef}>
          <g
            transform={`translate(${width - (head - firstHead.current + 1) * BAR_STEP} 0)`}
          >
            {blobsPerSlot.map((blobs, i) =>
              blobs === null || blobs === 0 ? null : (
                <PulseBar
                  key={head - i}
                  x={(head - i - firstHead.current) * BAR_STEP}
                  height={blobs * scale}
                  aboveTarget={blobs > limits.targetBlobsPerBlock}
                  grow={i === 0 && !reducedMotion}
                />
              ),
            )}
          </g>
        </g>
        <line
          x1={0}
          x2={width}
          y1={targetY}
          y2={targetY}
          className="stroke-secondary"
          strokeDasharray="4 4"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-1 flex justify-between gap-4 font-medium text-label-value-12 text-secondary">
        <span>1 hour ago</span>
        <span className="max-md:hidden">
          The last hour, a bar per block, against the target (dashed)
        </span>
        <span>Now</span>
      </div>
    </div>
  )
}

/** Memoized, so a new block renders the one bar it brings, not all 300 */
const PulseBar = memo(function PulseBar({
  x,
  height,
  aboveTarget,
  grow,
}: {
  x: number
  height: number
  aboveTarget: boolean
  /** Only the bar a new block brings grows in; the others were there already */
  grow: boolean
}) {
  const ref = useRef<SVGRectElement>(null)
  // straight to its height: past it, it would show more blobs than it had
  // biome-ignore lint/correctness/useExhaustiveDependencies: on mount only
  useLayoutEffect(() => {
    if (!grow || !ref.current) return
    ref.current.animate(
      [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }],
      { duration: 500, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
    )
  }, [])
  return (
    <rect
      ref={ref}
      x={x}
      y={PULSE_HEIGHT - height}
      width={BAR_WIDTH}
      height={height}
      className={aboveTarget ? 'fill-brand' : 'fill-brand/45'}
      style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
    />
  )
})
