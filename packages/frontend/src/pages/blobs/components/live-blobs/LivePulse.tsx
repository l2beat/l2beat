import { SLOT_SECONDS, slotStart } from '@l2beat/shared-pure'
import {
  type KeyboardEvent,
  memo,
  type PointerEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import type { Pulse } from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
import {
  PULSE_BUCKET_SLOTS,
  PULSE_BUCKETS,
  WINDOW_SLOTS,
} from '~/server/features/data-availability/live-blobs/liveBlobsSlots'
import { cn } from '~/utils/cn'
import { formatClock } from './blocks/format'
import { usePrefersReducedMotion } from './hooks'
import { earliestView } from './lookBack'
import type { BlockLimits } from './model'
import { useLiveBlobs } from './useLiveBlobs'

/** What of the day the belt shows, for the pulse to show where that is */
export interface PulseBrush {
  /** The slot in the bay, looking back; undefined while live */
  view: number | undefined
  /** Racks the belt shows left of the bay, and right of it */
  before: number
  after: number
  /** Takes the belt to `slot`, or back to live for undefined */
  onView: (slot: number | undefined) => void
}

/** The day behind the belt, under it, with what of it the belt shows */
export function LivePulse({
  limits,
  brush,
}: {
  limits: BlockLimits
  brush: PulseBrush
}) {
  const { data } = useLiveBlobs()
  if (!data) return <Skeleton className="h-14 w-full" />
  return (
    <BlobPulse
      pulse={data.window.pulse}
      slots={data.window.slots}
      head={data.head}
      limits={limits}
      brush={brush}
    />
  )
}

const PULSE_HEIGHT = 48
const BAR_STEP = 4
const BAR_WIDTH = 3
const BAR_MINUTES = (PULSE_BUCKET_SLOTS * SLOT_SECONDS) / 60
/** Slots a Page Up or Page Down moves the belt: an hour */
const PAGE_SLOTS = 300
/**
 * The band is at least this wide, in bars: true to scale, the few blocks the
 * belt shows would be a sliver of the day
 */
const MIN_BAND_BARS = 2
/** Pixels a finger moves sideways before it drags, rather than taps or scrolls */
const DRAG_FROM = 4

/**
 * The day as a bar per five minutes of its blobs per block, newest on the
 * right. The bars are fixed in time: the last fills in as blocks come, and
 * each new five minutes slides the day along by one bar and grows in at the
 * end, so the day reads as passing.
 *
 * It works as a brush over the belt: the band is what the belt shows, and
 * dragging it, or pressing anywhere on the day, takes the belt back there.
 */
function BlobPulse({
  pulse,
  slots,
  head,
  limits,
  brush,
}: {
  pulse: Pulse
  /** Slots of the day the server has, back from the head */
  slots: number
  head: number
  limits: BlockLimits
  brush: PulseBrush
}) {
  const slidingRef = useRef<SVGGElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  // Bars keep their place by bucket and the group moves, so a new bucket
  // moves one element rather than all of them
  const firstBucketEver = useRef(pulse.firstBucket)
  const width = PULSE_BUCKETS * BAR_STEP
  const scale = PULSE_HEIGHT / limits.maxBlobsPerBlock
  const targetY = PULSE_HEIGHT - limits.targetBlobsPerBlock * scale
  const firstSlot = pulse.firstBucket * PULSE_BUCKET_SLOTS
  const drag = useBrushDrag(head, firstSlot, brush)
  const { view, before, after } = brush
  // live, the bay holds the newest block for most of its slot
  const bay = view ?? head
  const xOf = (slot: number) =>
    ((slot - firstSlot) / PULSE_BUCKET_SLOTS) * BAR_STEP
  const shownLeft = xOf(bay - before)
  const shownRight = xOf(bay + after + 1)
  const bandWidth = Math.max(shownRight - shownLeft, MIN_BAND_BARS * BAR_STEP)
  const bayX = xOf(bay + 0.5)

  // The bars, the band and the bay slide together as a new bucket starts
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new bucket is what slides them
  useLayoutEffect(() => {
    if (reducedMotion) return
    slidingRef.current?.animate(
      [{ transform: `translateX(${BAR_STEP}px)` }, { transform: 'none' }],
      { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )
  }, [pulse.firstBucket, reducedMotion])

  // as far back as the belt can be taken, or live while the day is too short
  const earliest = Math.min(earliestView({ head, slots }, before), head)
  // the belt's caption has the slot's number, so this says when it was
  const viewTime = view === undefined ? '' : formatClock(slotStart(view))
  const describeView =
    view === undefined ? 'Live' : `${viewTime} · ${ago(view, head)}`

  return (
    <div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Look back through the last 24 hours"
        aria-valuemin={earliest}
        aria-valuemax={head}
        aria-valuenow={bay}
        aria-valuetext={describeView}
        // sideways drags are the brush's; up and down still scroll the page
        className={cn(
          'touch-pan-y select-none rounded-sm focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2',
          drag.dragging ? 'cursor-grabbing' : 'cursor-pointer',
        )}
        onKeyDown={(event) => onBrushKey(event, head, earliest, brush)}
        {...drag.handlers}
      >
        <svg
          viewBox={`0 0 ${width} ${PULSE_HEIGHT}`}
          preserveAspectRatio="none"
          className="block h-10 w-full"
          role="img"
          aria-label={`Average blobs per block in each ${BAR_MINUTES} minutes of the last 24 hours`}
        >
          <g ref={slidingRef}>
            <rect
              x={(shownLeft + shownRight - bandWidth) / 2}
              width={bandWidth}
              y={0}
              height={PULSE_HEIGHT}
              className="fill-brand/10 stroke-brand/40"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <g
              transform={`translate(${(firstBucketEver.current - pulse.firstBucket) * BAR_STEP} 0)`}
            >
              {pulse.buckets.map(({ blocks, blobs }, i) => {
                if (blocks === 0 || blobs === 0) return null
                const perBlock = blobs / blocks
                const bucket = pulse.firstBucket + i
                return (
                  <PulseBar
                    key={bucket}
                    x={(bucket - firstBucketEver.current) * BAR_STEP}
                    height={perBlock * scale}
                    aboveTarget={perBlock > limits.targetBlobsPerBlock}
                    grow={i === pulse.buckets.length - 1 && !reducedMotion}
                  />
                )
              })}
            </g>
            {/* the bay, as on the belt: where the block looked at sits */}
            <line
              x1={bayX}
              x2={bayX}
              y1={0}
              y2={PULSE_HEIGHT}
              className="stroke-primary"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
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
      </div>
      <div className="mt-1 flex items-center justify-between gap-4 font-medium text-label-value-12 text-secondary">
        <span>24 hours ago</span>
        {view === undefined ? (
          <span className="max-md:hidden">
            Average blobs per block every {BAR_MINUTES} minutes, against the
            target (dashed), above which the blob fee rises. Drag to look back
          </span>
        ) : (
          // on a phone, the time alone fits between the ends
          <span>
            <span className="text-primary tabular-nums">{viewTime}</span>
            <span className="max-md:hidden"> · {ago(view, head)}</span>
          </span>
        )}
        {view === undefined ? (
          <span>Now</span>
        ) : (
          <button
            type="button"
            onClick={() => brush.onView(undefined)}
            className="font-bold text-brand"
          >
            Back to live
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Drags the brush. A mouse takes the belt to where it is pressed at once,
 * unless pressed on the band, which it then carries. A finger does nothing
 * on the way down, as that may start a scroll: a tap takes the belt there,
 * and a sideways drag carries the band.
 */
function useBrushDrag(head: number, firstSlot: number, brush: PulseBrush) {
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{
    pointerId: number
    startX: number
    startY: number
    /** Slots from the pointer to the bay, kept as the band is carried */
    offset: number
    touch: boolean
    moved: boolean
  }>(undefined)

  const slotUnder = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const across = (event.clientX - box.left) / box.width
    return firstSlot + Math.floor(across * WINDOW_SLOTS)
  }

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    const slot = slotUnder(event)
    const bay = brush.view ?? head
    const onBand = slot >= bay - brush.before && slot <= bay + brush.after
    const touch = event.pointerType === 'touch'
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offset: onBand ? bay - slot : 0,
      touch,
      moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    if (!touch) {
      setDragging(true)
      if (!onBand) brush.onView(slot)
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = drag.current
    if (current?.pointerId !== event.pointerId) return
    if (!current.moved) {
      const across = Math.abs(event.clientX - current.startX)
      const down = Math.abs(event.clientY - current.startY)
      // a finger going more down than across is scrolling the page, and the
      // browser takes it over; it must not move the belt on its way
      if (current.touch && down > across) {
        if (down >= DRAG_FROM) drag.current = undefined
        return
      }
      if (across < DRAG_FROM) return
      current.moved = true
      setDragging(true)
    }
    brush.onView(slotUnder(event) + current.offset)
  }

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const current = drag.current
    if (current?.pointerId !== event.pointerId) return
    if (current.touch && !current.moved) brush.onView(slotUnder(event))
    drag.current = undefined
    setDragging(false)
  }

  const onPointerCancel = () => {
    drag.current = undefined
    setDragging(false)
  }

  return {
    dragging,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  }
}

/** Arrows step a block, Page Up and Down an hour; End or Escape is live */
function onBrushKey(
  event: KeyboardEvent<HTMLElement>,
  head: number,
  earliest: number,
  brush: PulseBrush,
) {
  const bay = brush.view ?? head
  const to: Record<string, number | undefined> = {
    ArrowLeft: bay - 1,
    ArrowDown: bay - 1,
    ArrowRight: bay + 1,
    ArrowUp: bay + 1,
    PageDown: bay - PAGE_SLOTS,
    PageUp: bay + PAGE_SLOTS,
    Home: earliest,
    End: undefined,
    Escape: undefined,
  }
  if (!(event.key in to)) return
  // Escape while live is left to whatever else listens for it
  if (event.key === 'Escape' && brush.view === undefined) return
  event.preventDefault()
  brush.onView(to[event.key])
}

/**
 * "4 min ago" or "3 h 20 min ago", counted in slots back from the head rather
 * than by the device's clock, which may be off
 */
function ago(slot: number, head: number) {
  const minutes = Math.floor(((head - slot) * SLOT_SECONDS) / 60)
  if (minutes < 1) return 'under a minute ago'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} h ago` : `${hours} h ${rest} min ago`
}

/** Memoized, so a new block renders the one bar it changes, not all of them */
const PulseBar = memo(function PulseBar({
  x,
  height,
  aboveTarget,
  grow,
}: {
  x: number
  height: number
  aboveTarget: boolean
  /** Only the bar a new bucket brings grows in; the others were there already */
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
