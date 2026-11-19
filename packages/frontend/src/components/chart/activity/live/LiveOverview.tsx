import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ProjectLiveWindow } from '~/server/features/layer2s/activity/live/getProjectLiveActivity'
import { cn } from '~/utils/cn'
import { countOf, type LiveMetric } from './liveSteps'
import { clampTo } from './liveView'

const HEIGHT = 40
/** Keys let go closer together than this move the window once, after the last */
const KEYS_SETTLE_MS = 400
const MOVE_KEYS = [
  'ArrowLeft',
  'ArrowDown',
  'ArrowRight',
  'ArrowUp',
  'Home',
  'End',
]

/**
 * The whole buffer, a bar a bucket, with the window the chart below shows.
 * Pressing or dragging on it, or the arrow keys, move the window. While they
 * go on only the strip's window moves, and the chart reads where it ends once
 * they stop, rather than every window passed on the way
 */
export function LiveOverview({
  overview,
  buffer,
  window,
  windowText,
  length,
  metric,
  onMove,
  onSeeking,
  className,
}: {
  overview: ProjectLiveWindow['overview']
  /** The buffer's edges */
  buffer: { from: number; to: number }
  /** The edges of the window shown below */
  window: [number, number]
  /** What the range picked spans, which a move reads */
  length: number
  /** The window as a screen reader says it */
  windowText: string
  metric: LiveMetric
  /** Where the window should end, once it stops moving */
  onMove: (to: number) => void
  /** Whether the window is being moved, before it is read */
  onSeeking: (seeking: boolean) => void
  className?: string
}) {
  const ref = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(settle.current), [])
  // a move is clamped as the view is when it is made, as the range may have
  // changed since it started
  const move = useRef(onMove)
  move.current = onMove
  const seeking = useRef(onSeeking)
  seeking.current = onSeeking
  const target = useRef<number | undefined>(undefined)
  const keys = useRef(new Set<string>())
  const [seekTo, setSeekTo] = useState<number>()
  const { from, to } = buffer
  const span = to - from
  /** Where a window asked to end at `end` will, as it is read */
  const clamp = (end: number) => clampTo(end, buffer, length) ?? to
  const end = seekTo === undefined ? window[1] : clamp(seekTo)
  // while moved, as it will be read, which a range just picked may not be yet
  const [shownFrom, shownTo] =
    seekTo === undefined ? window : [end - length, end]
  const busiest = Math.max(
    1,
    ...overview.buckets.map((b) => countOf(b, metric)),
  )
  // the window and the first bar start on their buckets, so can before `from`
  const xOf = (t: number) =>
    Math.min(100, Math.max(0, ((t - from) / span) * 100))

  const seek = (next: number) => {
    if (target.current === undefined) seeking.current(true)
    target.current = next
    setSeekTo(next)
  }
  const stop = (read: boolean) => {
    clearTimeout(settle.current)
    const next = target.current
    target.current = undefined
    setSeekTo(undefined)
    if (next === undefined) return
    if (read) move.current(Math.round(next))
    seeking.current(false)
  }
  const pointTo = (event: PointerEvent) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    seek(from + ((event.clientX - box.left) / box.width) * span + length / 2)
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const step = length / 10
    const ends: Record<string, number> = {
      ArrowLeft: end - step,
      ArrowDown: end - step,
      ArrowRight: end + step,
      ArrowUp: end + step,
      Home: from + length,
      End: to,
    }
    const next = ends[event.key]
    if (next === undefined) return
    event.preventDefault()
    keys.current.add(event.key)
    clearTimeout(settle.current)
    seek(next)
  }
  // a held key repeats, so the window is read only once all are let go
  const onKeyUp = (event: KeyboardEvent) => {
    if (!MOVE_KEYS.includes(event.key)) return
    keys.current.delete(event.key)
    if (keys.current.size > 0 || target.current === undefined) return
    if (dragging.current) return
    clearTimeout(settle.current)
    settle.current = setTimeout(() => stop(true), KEYS_SETTLE_MS)
  }
  const release = (read: boolean) => {
    if (!dragging.current) return
    dragging.current = false
    stop(read)
  }

  return (
    <svg
      ref={ref}
      className={cn(
        'h-10 w-full cursor-pointer touch-none select-none overflow-visible rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-solid focus-visible:outline-offset-2',
        className,
      )}
      viewBox={`0 0 100 ${HEIGHT}`}
      preserveAspectRatio="none"
      role="slider"
      tabIndex={0}
      aria-label="Look back through the last hours"
      // a window longer than what is stored can't move
      aria-valuemin={Math.min(from + length, to)}
      aria-valuemax={to}
      aria-valuenow={Math.round(clamp(end))}
      aria-valuetext={windowText}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      // a key let go elsewhere would leave the window unread
      onBlur={() => {
        keys.current.clear()
        if (!dragging.current) stop(true)
      }}
      onPointerDown={(event) => {
        dragging.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        pointTo(event)
      }}
      onPointerMove={(event) => dragging.current && pointTo(event)}
      onPointerUp={() => release(true)}
      onPointerCancel={() => release(false)}
      onLostPointerCapture={() => release(true)}
    >
      {overview.buckets.map((bucket) => {
        const height = (countOf(bucket, metric) / busiest) * (HEIGHT - 2)
        return (
          <rect
            key={bucket.timestamp}
            x={xOf(bucket.timestamp)}
            y={HEIGHT - height}
            width={(overview.bucket / span) * 100 * 0.8}
            height={height}
            className="fill-secondary opacity-40"
          />
        )
      })}
      <rect
        x={xOf(shownFrom)}
        y={0}
        width={Math.max(0.5, xOf(shownTo) - xOf(shownFrom))}
        height={HEIGHT}
        className="fill-brand/15 stroke-brand"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
