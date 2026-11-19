import { type KeyboardEvent, type PointerEvent, useEffect, useRef } from 'react'
import type { ProjectLiveWindow } from '~/server/features/layer2s/activity/live/getProjectLiveActivity'
import { LIVE_METRICS, type LiveMetric } from './liveMetrics'
import { getKeyEnd, isMoveKey } from './liveView'

const HEIGHT = 40
/** Keys let go closer together than this move the window once, after the last */
const KEYS_SETTLE_MS = 400

/**
 * The whole buffer, a bar a bucket, with the window the chart below shows.
 * Pressing or dragging on it, or the arrow keys, move the window. While they
 * go on only the strip's window moves, and the chart reads where it ends once
 * they stop, rather than every window passed on the way
 */
export function LiveOverview({
  overview,
  buffer,
  selection,
  selectionText,
  length,
  metric,
  onSeek,
  onMove,
}: {
  overview: ProjectLiveWindow['overview']
  /** The buffer's edges */
  buffer: { from: number; to: number }
  /** The edges of the window, where it is moved to while it is */
  selection: [number, number]
  /** The window as a screen reader says it */
  selectionText: string
  /** What the range picked spans, which a move reads */
  length: number
  metric: LiveMetric
  /** Where the window is moved to before it is read, undefined once it stops */
  onSeek: (to: number | undefined) => void
  /** Where the window should end, once it stops moving */
  onMove: (to: number) => void
}) {
  const ref = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined)
  // a move is read as the view is when it stops, as the range may have
  // changed since it started
  const handlers = useRef({ onSeek, onMove })
  handlers.current = { onSeek, onMove }
  const target = useRef<number | undefined>(undefined)
  const keys = useRef(new Set<string>())
  // gone mid-move, it would leave the view waiting for the move to stop
  useEffect(
    () => () => {
      clearTimeout(settle.current)
      handlers.current.onSeek(undefined)
    },
    [],
  )
  const { from, to } = buffer
  const span = to - from
  const { count } = LIVE_METRICS[metric]
  const busiest = Math.max(1, ...overview.buckets.map(count))
  // the window and the first bar start on their buckets, so can before `from`
  const xOf = (t: number) =>
    Math.min(100, Math.max(0, ((t - from) / span) * 100))
  // a window longer than what is stored can't move
  const earliest = Math.min(from + length, to)

  const seek = (next: number) => {
    target.current = next
    handlers.current.onSeek(next)
  }
  const stop = (read: boolean) => {
    clearTimeout(settle.current)
    const next = target.current
    target.current = undefined
    if (next === undefined) return
    if (read) handlers.current.onMove(Math.round(next))
    handlers.current.onSeek(undefined)
  }
  const pointTo = (event: PointerEvent) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    seek(from + ((event.clientX - box.left) / box.width) * span + length / 2)
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const next = getKeyEnd(event.key, selection[1], buffer, length)
    if (next === undefined) return
    event.preventDefault()
    keys.current.add(event.key)
    clearTimeout(settle.current)
    seek(next)
  }
  // a held key repeats, so the window is read only once all are let go
  const onKeyUp = (event: KeyboardEvent) => {
    if (!isMoveKey(event.key)) return
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
      className="h-10 w-full cursor-pointer touch-none select-none overflow-visible rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-solid focus-visible:outline-offset-2"
      viewBox={`0 0 100 ${HEIGHT}`}
      preserveAspectRatio="none"
      role="slider"
      tabIndex={0}
      aria-label="Look back through the last hours"
      aria-valuemin={earliest}
      aria-valuemax={to}
      aria-valuenow={Math.round(Math.min(Math.max(selection[1], earliest), to))}
      aria-valuetext={selectionText}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      // a key let go elsewhere would leave the window unread
      onBlur={() => {
        keys.current.clear()
        if (!dragging.current) stop(true)
      }}
      onPointerDown={(event) => {
        clearTimeout(settle.current)
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
        const height = (count(bucket) / busiest) * (HEIGHT - 2)
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
        x={xOf(selection[0])}
        y={0}
        width={Math.max(0.5, xOf(selection[1]) - xOf(selection[0]))}
        height={HEIGHT}
        className="fill-brand/15 stroke-brand"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
