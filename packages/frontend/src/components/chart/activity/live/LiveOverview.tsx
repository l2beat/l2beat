import { type KeyboardEvent, type PointerEvent, useEffect, useRef } from 'react'
import type { ProjectLiveWindow } from '~/server/features/layer2s/activity/live/getProjectLiveActivity'
import { LIVE_METRICS, type LiveMetric } from './liveMetrics'
import {
  getEdgeAt,
  getKeyEnd,
  getKeyLength,
  getResizedFrom,
  getResizedTo,
  getTouchEdges,
  holdEnd,
  isMoveKey,
  type LiveTarget,
} from './liveView'

const HEIGHT = 40
/** How far outside the window, in pixels, its edges can be taken to resize it */
const EDGE_REACH = 8
/** How far, in pixels, a pressed edge is dragged before it resizes */
const DRAG_PX = 3
/** Keys let go closer together than this move the window once, after the last */
const KEYS_SETTLE_MS = 400

/**
 * The whole buffer, a bar a bucket, with the window the chart below shows.
 * Pressing or dragging on it, or the arrow keys, move the window, and
 * dragging its edges, or the arrow keys with Shift, resize it. While they go
 * on only the strip's window changes, and the chart reads it once they stop,
 * rather than every window passed on the way
 */
export function LiveOverview({
  overview,
  buffer,
  selection,
  selectionText,
  length,
  following,
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
  /** The length asked for, which a move keeps */
  length: number
  /** Whether the window ends at the newest block */
  following: boolean
  metric: LiveMetric
  /** The window as moved or resized before it is read, undefined once it stops */
  onSeek: (target: LiveTarget | undefined) => void
  /** The window to read, once it stops moving */
  onMove: (target: LiveTarget) => void
}) {
  const ref = useRef<SVGSVGElement>(null)
  /** A drag going on: a move, or a resize by an edge with the other held */
  const dragging = useRef<
    | {
        /** The pointer's x when pressed, and whether it has been dragged since */
        x: number
        dragged: boolean
        resize?:
          | {
              edge: 'from'
              end: number | undefined
              moved: boolean
              /**
               * The pointer's x and seconds per pixel when pressed, fixed so
               * the buffer moving on isn't read as a drag; the length drawn
               * and asked for
               */
              x: number
              scale: number
              drawn: number
              seconds: number
            }
          | { edge: 'to'; start: number; grab: number }
      }
    | undefined
  >(undefined)
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined)
  // timers and pointer handlers call the latest callbacks
  const handlers = useRef({ onSeek, onMove })
  handlers.current = { onSeek, onMove }
  const target = useRef<LiveTarget | undefined>(undefined)
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

  // where the strip shows the window ending, undefined at the newest block
  const shownEnd = following ? undefined : selection[1]
  const end = shownEnd ?? to
  const seek = (next: LiveTarget) => {
    target.current = next
    handlers.current.onSeek(next)
  }
  const stop = (read: boolean) => {
    clearTimeout(settle.current)
    const next = target.current
    target.current = undefined
    if (next === undefined) return
    if (read) {
      handlers.current.onMove({
        ...next,
        end: next.end === undefined ? undefined : Math.round(next.end),
      })
    }
    handlers.current.onSeek(undefined)
  }
  const timeAt = (event: PointerEvent) => {
    const box = ref.current?.getBoundingClientRect()
    return box && from + ((event.clientX - box.left) / box.width) * span
  }
  const secondsPerPixel = () => {
    const box = ref.current?.getBoundingClientRect()
    return box ? span / box.width : 0
  }
  const edgeAt = (event: PointerEvent) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    // where the edges are drawn, which a window longer than the buffer is not
    const px = (t: number) => (xOf(t) / 100) * box.width
    const edges: [number, number] = [px(selection[0]), px(selection[1])]
    // a finger covers a narrow window, whose middle still moves it
    const touch = event.pointerType === 'touch'
    return getEdgeAt(
      event.clientX - box.left,
      touch ? getTouchEdges(edges, box.width, EDGE_REACH) : edges,
      EDGE_REACH,
      touch ? 0 : EDGE_REACH,
    )
  }
  const pointTo = (event: PointerEvent) => {
    const at = timeAt(event)
    if (at === undefined) return
    const resize = dragging.current?.resize
    // a resize from the keyboard not yet read is kept
    const seconds = target.current?.seconds ?? length
    seek(
      resize
        ? resize.edge === 'from'
          ? getResizedFrom(
              resize.drawn,
              (event.clientX - resize.x) * resize.scale,
              resize.seconds,
              resize.end,
              buffer,
              resize.moved,
            )
          : getResizedTo(
              at + resize.grab,
              resize.start,
              buffer,
              EDGE_REACH * secondsPerPixel(),
            )
        : { end: at + seconds / 2, seconds },
    )
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    // from the window as the strip shows it, so not past the buffer
    const seconds = target.current?.seconds ?? length
    const resized = event.shiftKey
      ? getKeyLength(event.key, seconds, end, buffer)
      : undefined
    const moved =
      resized === undefined
        ? getKeyEnd(event.key, end, buffer, seconds)
        : undefined
    const next: LiveTarget | undefined =
      resized !== undefined
        ? holdEnd(shownEnd, resized, isMoved(target.current))
        : moved !== undefined
          ? { end: moved, seconds }
          : undefined
    if (!next) return
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
    if (dragging.current !== undefined) return
    clearTimeout(settle.current)
    settle.current = setTimeout(() => stop(true), KEYS_SETTLE_MS)
  }
  const release = (read: boolean) => {
    if (dragging.current === undefined) return
    dragging.current = undefined
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
      aria-keyshortcuts="Shift+ArrowLeft Shift+ArrowRight"
      aria-valuemin={earliest}
      aria-valuemax={to}
      aria-valuenow={Math.round(Math.min(Math.max(selection[1], earliest), to))}
      aria-valuetext={selectionText}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      // a key let go elsewhere would leave the window unread
      onBlur={() => {
        keys.current.clear()
        if (dragging.current === undefined) stop(true)
      }}
      onPointerDown={(event) => {
        clearTimeout(settle.current)
        const edge = edgeAt(event)
        const at = timeAt(event) ?? 0
        // as drawn, which a window longer than the buffer is not
        const shownFrom = Math.max(selection[0], from)
        // where the edge is from the pointer, kept through the drag
        dragging.current = {
          x: event.clientX,
          dragged: false,
          resize:
            edge === 'from'
              ? {
                  edge,
                  end: shownEnd,
                  moved: isMoved(target.current),
                  x: event.clientX,
                  scale: secondsPerPixel(),
                  drawn: selection[1] - shownFrom,
                  seconds: target.current?.seconds ?? length,
                }
              : edge === 'to'
                ? { edge, start: shownFrom, grab: selection[1] - at }
                : undefined,
        }
        event.currentTarget.setPointerCapture(event.pointerId)
        // a press on an edge resizes from where the window is
        if (!edge) pointTo(event)
      }}
      onPointerMove={(event) => {
        const drag = dragging.current
        if (drag !== undefined) {
          // an edge resizes once dragged, not with a hand's tremor on a press
          if (drag.resize && !drag.dragged) {
            if (Math.abs(event.clientX - drag.x) < DRAG_PX) return
            drag.dragged = true
          }
          return pointTo(event)
        }
        event.currentTarget.style.cursor = edgeAt(event) ? 'ew-resize' : ''
      }}
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
      {selection.map((edge) => (
        <line
          key={edge}
          x1={xOf(edge)}
          x2={xOf(edge)}
          y1={HEIGHT / 2 - 8}
          y2={HEIGHT / 2 + 8}
          className="stroke-brand"
          strokeWidth={4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}

/** Whether the strip shows a window moved, not yet read, rather than one resized by its left edge */
function isMoved(target: LiveTarget | undefined) {
  return target !== undefined && !target.holdsEnd
}
