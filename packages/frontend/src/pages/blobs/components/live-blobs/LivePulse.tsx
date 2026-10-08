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
import { cn } from '~/utils/cn'
import { formatClock, formatWhole } from './blocks/format'
import { usePrefersReducedMotion } from './hooks'
import { earliestView } from './lookBack'
import type { BlockLimits } from './model'
import { useLiveBlobs } from './useLiveBlobs'

/** What of the hour the belt shows, for the pulse to show where that is */
export interface PulseBrush {
  /** The slot in the bay, looking back; undefined while live */
  view: number | undefined
  /** Racks the belt shows left of the bay, and right of it */
  before: number
  after: number
  /** Takes the belt to `slot`, or back to live for undefined */
  onView: (slot: number | undefined) => void
}

/** The hour behind the belt, under it, with what of it the belt shows */
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
      blobsPerSlot={data.window.blobsPerSlot}
      head={data.head}
      limits={limits}
      brush={brush}
    />
  )
}

const PULSE_HEIGHT = 48
const BAR_STEP = 4
const BAR_WIDTH = 3
const SLOTS_SHOWN = 300
/** Slots a Page Up or Page Down moves the belt: five minutes */
const PAGE_SLOTS = 25
/** Pixels a finger moves sideways before it drags, rather than taps or scrolls */
const DRAG_FROM = 4

/**
 * Every block of the hour as a bar of its blobs, newest on the right. Each
 * new block slides the hour along by one and grows in at the end, so the
 * hour reads as passing, block by block.
 *
 * It works as a brush over the belt: the band is what the belt shows, and
 * dragging it, or pressing anywhere on the hour, takes the belt back there.
 */
function BlobPulse({
  blobsPerSlot,
  head,
  limits,
  brush,
}: {
  blobsPerSlot: (number | null)[]
  head: number
  limits: BlockLimits
  brush: PulseBrush
}) {
  const barsRef = useRef<SVGGElement>(null)
  const bandRef = useRef<SVGRectElement>(null)
  const bayRef = useRef<SVGLineElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  // Bars keep their place by slot and the group moves, so a new block
  // moves one element rather than all 300
  const firstHead = useRef(head)
  const width = SLOTS_SHOWN * BAR_STEP
  const scale = PULSE_HEIGHT / limits.maxBlobsPerBlock
  const targetY = PULSE_HEIGHT - limits.targetBlobsPerBlock * scale
  const drag = useBrushDrag(head, brush)
  const { view, before, after } = brush
  // live, the bay holds the newest block for most of its slot
  const bay = view ?? head
  const xOf = (slot: number) => width - (head - slot + 1) * BAR_STEP

  // A band on slots of the past slides with their bars. Live, it stays put
  // at the right end, where the slot being made always is
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new head is what slides it
  useLayoutEffect(() => {
    if (reducedMotion) return
    const sliding = [barsRef.current]
    if (view !== undefined) sliding.push(bandRef.current, bayRef.current)
    for (const element of sliding) {
      element?.animate(
        [{ transform: `translateX(${BAR_STEP}px)` }, { transform: 'none' }],
        { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      )
    }
  }, [head, reducedMotion])

  // as far back as the belt can be taken, or live while the hour is too short
  const earliest = Math.min(
    earliestView({ head, slots: blobsPerSlot.length }, before),
    head,
  )
  // the belt's caption has the slot's number, so this says when it was
  const viewTime = view === undefined ? '' : formatClock(slotStart(view))
  const describeView =
    view === undefined ? 'Live' : `${viewTime} · ${ago(view, head)}`

  return (
    <div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Look back through the last hour"
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
          aria-label={`Blobs in each of the last ${formatWhole(blobsPerSlot.length)} slots`}
        >
          <rect
            ref={bandRef}
            x={xOf(bay - before)}
            width={(before + 1 + after) * BAR_STEP}
            y={0}
            height={PULSE_HEIGHT}
            className="fill-brand/10 stroke-brand/40"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
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
          {/* the bay, as on the belt: where the block looked at sits */}
          <line
            ref={bayRef}
            x1={xOf(bay) + BAR_WIDTH / 2}
            x2={xOf(bay) + BAR_WIDTH / 2}
            y1={0}
            y2={PULSE_HEIGHT}
            className="stroke-primary"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
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
        <span>1 hour ago</span>
        {view === undefined ? (
          <span className="max-md:hidden">
            The last hour, a bar per block, against the target (dashed). Drag to
            look back
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
function useBrushDrag(head: number, brush: PulseBrush) {
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
    const fromRight = 1 - (event.clientX - box.left) / box.width
    return head - Math.floor(fromRight * SLOTS_SHOWN)
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

/** Arrows step a block, Page Up and Down five minutes; End or Escape is live */
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
 * "4 min ago", counted in slots back from the head rather than by the
 * device's clock, which may be off
 */
function ago(slot: number, head: number) {
  const minutes = Math.floor(((head - slot) * SLOT_SECONDS) / 60)
  return minutes < 1 ? 'under a minute ago' : `${minutes} min ago`
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
