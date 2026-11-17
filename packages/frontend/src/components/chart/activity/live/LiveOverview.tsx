import { type KeyboardEvent, type PointerEvent, useEffect, useRef } from 'react'
import type { LiveActivityPoint } from '~/server/features/layer2s/activity/live/liveRanges'
import { cn } from '~/utils/cn'
import { type LiveMetric, METRIC_INDEX } from './liveSteps'

const HEIGHT = 40
const MOVE_EVERY_MS = 200

/**
 * The whole buffer, a bar a minute, with the window the chart below shows.
 * Pressing or dragging on it, or the arrow keys, move the window
 */
export function LiveOverview({
  points,
  from,
  to,
  window,
  windowText,
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
  /** The window as a screen reader says it */
  windowText: string
  metric: LiveMetric
  /** Where the window should end */
  onMove: (to: number) => void
  className?: string
}) {
  const ref = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const sentAt = useRef(0)
  const queued = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(queued.current), [])
  // a queued move is clamped as the view is when it is sent, as the range
  // may have changed since
  const move = useRef(onMove)
  move.current = onMove
  const span = to - from
  const busiest = Math.max(1, ...points.map((p) => metricOf(p, metric)))
  // the window and the first bar start on their buckets, so can before `from`
  const xOf = (t: number) =>
    Math.min(100, Math.max(0, ((t - from) / span) * 100))
  const length = window[1] - window[0]

  // a drag or a held key reads a window at most every MOVE_EVERY_MS, the
  // last one too
  const moveTo = (end: number) => {
    const send = () => {
      sentAt.current = performance.now()
      move.current(Math.round(end))
    }
    clearTimeout(queued.current)
    const wait = sentAt.current + MOVE_EVERY_MS - performance.now()
    if (wait <= 0) send()
    else queued.current = setTimeout(send, wait)
  }
  const pointTo = (event: PointerEvent) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    moveTo(from + ((event.clientX - box.left) / box.width) * span + length / 2)
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const step = length / 10
    const ends: Record<string, number> = {
      ArrowLeft: window[1] - step,
      ArrowDown: window[1] - step,
      ArrowRight: window[1] + step,
      ArrowUp: window[1] + step,
      Home: from + length,
      End: to,
    }
    const end = ends[event.key]
    if (end === undefined) return
    event.preventDefault()
    moveTo(end)
  }
  const stop = () => {
    dragging.current = false
  }

  return (
    <svg
      ref={ref}
      className={cn(
        'h-10 w-full cursor-pointer touch-none select-none overflow-visible rounded-sm focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2',
        className,
      )}
      viewBox={`0 0 100 ${HEIGHT}`}
      preserveAspectRatio="none"
      role="slider"
      tabIndex={0}
      aria-label="Look back through the last hours"
      aria-valuemin={from + length}
      aria-valuemax={to}
      aria-valuenow={Math.round(
        Math.min(to, Math.max(from + length, window[1])),
      )}
      aria-valuetext={windowText}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => {
        dragging.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        pointTo(event)
      }}
      onPointerMove={(event) => dragging.current && pointTo(event)}
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
