import { type PointerEvent, useRef } from 'react'
import type { LiveActivityPoint } from '~/server/features/layer2s/activity/live/liveRanges'
import { cn } from '~/utils/cn'
import { type LiveMetric, METRIC_INDEX } from './liveSteps'

const HEIGHT = 40
const MOVE_EVERY_MS = 200

/**
 * The whole buffer, a bar a minute, with the window the chart below shows.
 * Pressing or dragging on it moves the window there
 */
export function LiveOverview({
  points,
  from,
  to,
  window,
  metric,
  onMove,
  className,
}: {
  points: LiveActivityPoint[]
  /** The buffer's edges */
  from: number
  to: number
  /** The edges of the window shown below */
  window: [number, number]
  metric: LiveMetric
  /** Where the window should end */
  onMove: (to: number) => void
  className?: string
}) {
  const ref = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const sentAt = useRef(0)
  const queued = useRef<ReturnType<typeof setTimeout>>(undefined)
  const span = to - from
  const busiest = Math.max(1, ...points.map((p) => metricOf(p, metric)))
  // the window and the first bar start on their buckets, so can before `from`
  const xOf = (t: number) =>
    Math.min(100, Math.max(0, ((t - from) / span) * 100))
  const length = window[1] - window[0]

  // a drag reads a window at most every MOVE_EVERY_MS, the last one too
  const moveTo = (event: PointerEvent) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    const at = from + ((event.clientX - box.left) / box.width) * span
    const send = () => {
      sentAt.current = performance.now()
      onMove(Math.round(at + length / 2))
    }
    clearTimeout(queued.current)
    const wait = sentAt.current + MOVE_EVERY_MS - performance.now()
    if (wait <= 0) send()
    else queued.current = setTimeout(send, wait)
  }
  const stop = () => {
    dragging.current = false
  }

  return (
    <svg
      ref={ref}
      className={cn(
        'h-10 w-full cursor-pointer touch-none select-none overflow-visible',
        className,
      )}
      viewBox={`0 0 100 ${HEIGHT}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="The last hours, a bar a minute; press to look back"
      onPointerDown={(event) => {
        dragging.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        moveTo(event)
      }}
      onPointerMove={(event) => dragging.current && moveTo(event)}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
    >
      {points.map((point) => {
        const height = (metricOf(point, metric) / busiest) * (HEIGHT - 2)
        return (
          <rect
            key={point[0]}
            x={xOf(point[0])}
            y={HEIGHT - height}
            width={(60 / span) * 100 * 0.8}
            height={height}
            className="fill-secondary opacity-40"
          />
        )
      })}
      <rect
        x={xOf(window[0])}
        y={0}
        width={Math.max(0.5, xOf(window[1]) - xOf(window[0]))}
        height={HEIGHT}
        className="fill-brand/15 stroke-brand"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function metricOf(point: LiveActivityPoint, metric: LiveMetric) {
  return point[METRIC_INDEX[metric]]
}
