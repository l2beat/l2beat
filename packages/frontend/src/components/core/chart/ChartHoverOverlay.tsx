import type { ChartScene } from '@tanstack/charts'
import {
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { placeBeside, useChartTooltip } from './useChartTooltip'

const ACTIVE_DOT_RADIUS = 3

export interface OverlayDot<T> {
  key: string
  value: (row: T, index: number) => number | null | undefined
  /** The scene scale the value maps through. */
  scale: string
}

/** The last rendered scene, and who to tell when the chart renders again. */
export class ChartSceneStore {
  current: ChartScene | null = null
  private listeners = new Set<() => void>()

  set(scene: ChartScene) {
    this.current = scene
    for (const listener of this.listeners) listener()
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}

type SyncListener = (x: number | null, source: object) => void
/** Hover shared between charts with the same sync id, by x value. */
const syncListeners = new Map<string, Set<SyncListener>>()

/**
 * Crosshair, active dots and tooltip for a time series. React renders only
 * when the hovered row changes; moves within a row just translate the
 * tooltip. The tooltip sits below and right of the pointer (left past the
 * middle of the plot), may leave the chart but not the window. Arrow keys
 * move it between rows, Home and End jump to the ends, Escape closes it.
 */
export function ChartHoverOverlay<T>({
  rows,
  x: getX,
  dots,
  sceneRef,
  ariaLabel,
  syncId,
  renderTooltip,
}: {
  rows: T[]
  x: (row: T) => number
  dots: OverlayDot<T>[]
  sceneRef: ChartSceneStore
  ariaLabel: string
  syncId?: string
  renderTooltip: (row: T) => ReactNode
}) {
  const [self] = useState(() => ({}))
  const scene = sceneRef.current

  function broadcast(index: number | null) {
    if (!syncId) return
    const row = index === null ? undefined : rows[index]
    const value = row === undefined ? null : getX(row)
    for (const listener of syncListeners.get(syncId) ?? []) {
      listener(value, self)
    }
  }

  const latest = useRef({ rows, getX, dots })
  latest.current = { rows, getX, dots }

  /** Where a row's tooltip hangs from: its first dot, or mid-plot. */
  function anchorOf(index: number) {
    const current = sceneRef.current
    const { rows, getX, dots } = latest.current
    const target = rows[index]
    if (!current || target === undefined) return { x: 0, y: 0 }
    const first = dots
      .map((d) => ({ d, value: d.value(target, index) }))
      .find(({ value }) => isNumber(value))
    return {
      x: current.scales.x?.map(getX(target)) ?? 0,
      y:
        first && isNumber(first.value)
          ? (current.scales[first.d.scale]?.map(first.value) ?? 0)
          : current.chart.y + current.chart.height / 2,
    }
  }

  const tooltip = useChartTooltip({
    // Not gated on the scene: it is published after this first renders.
    count: rows.length,
    anchorOf,
    place: (anchor, size) =>
      sceneRef.current
        ? placeBeside(sceneRef.current.chart)(anchor, size)
        : anchor,
    onSelect: broadcast,
    fitHeight: true,
  })
  const { active, setActive } = tooltip
  const row = active ? rows[active.index] : undefined

  // A resize lays the chart out again; an open tooltip (left by a tap or
  // the keyboard) follows its row.
  const activeRef = useRef(active)
  activeRef.current = active
  // biome-ignore lint/correctness/useExhaustiveDependencies: anchorOf reads refs
  useEffect(
    () =>
      sceneRef.subscribe(() => {
        const current = activeRef.current
        if (current) {
          setActive({ index: current.index, ...anchorOf(current.index) })
        }
      }),
    [sceneRef],
  )

  useEffect(() => {
    if (!syncId) return
    const listeners = syncListeners.get(syncId) ?? new Set()
    syncListeners.set(syncId, listeners)
    const listener: SyncListener = (value, source) => {
      if (source === self) return
      const scene = sceneRef.current
      const { rows, getX } = latest.current
      if (value === null || !scene || rows.length === 0) {
        setActive(null)
        return
      }
      // Only the same x: a nearest row would show another day's values.
      const index = nearestIndex(rows, getX, value)
      const row = rows[index]
      if (row === undefined || getX(row) !== value) {
        setActive(null)
        return
      }
      setActive({
        index,
        x: scene.scales.x?.map(getX(row)) ?? 0,
        y: scene.chart.y + scene.chart.height / 2,
      })
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [syncId, self, sceneRef, setActive])

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const invert = sceneRef.current?.scales.x?.invert
    if (!invert || rows.length === 0) return
    // Layout is clean between moves (only transforms change), so this
    // does not force one.
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    tooltip.select(nearestIndex(rows, getX, Number(invert(x))), { x, y })
  }

  const xScale = scene?.scales.x
  const plot = scene?.chart
  const cx = row !== undefined && xScale ? xScale.map(getX(row)) : 0

  return (
    <div
      ref={tooltip.rootRef}
      {...tooltip.interactiveProps}
      // The chart's image already carries the bare name.
      aria-label={`${ariaLabel}: arrow keys show values`}
      className="absolute inset-0 outline-none"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerMove}
    >
      {row !== undefined && active && plot && (
        <>
          <div
            className="pointer-events-none absolute w-0.5 bg-primary"
            style={{
              top: plot.y,
              height: plot.height,
              transform: `translateX(${cx - 1}px)`,
            }}
          />
          {dots.map((d) => {
            const value = d.value(row, active.index)
            const scale = scene?.scales[d.scale]
            if (!isNumber(value) || !scale) return null
            return (
              <div
                key={d.key}
                className="pointer-events-none absolute rounded-full bg-primary"
                style={{
                  width: ACTIVE_DOT_RADIUS * 2,
                  height: ACTIVE_DOT_RADIUS * 2,
                  transform: `translate(${cx - ACTIVE_DOT_RADIUS}px, ${scale.map(value) - ACTIVE_DOT_RADIUS}px)`,
                }}
              />
            )
          })}
        </>
      )}
      <div {...tooltip.tooltipProps}>
        {row !== undefined && renderTooltip(row)}
      </div>
    </div>
  )
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/** Index of the row closest to `x`; rows are sorted by x. */
function nearestIndex<T>(rows: T[], getX: (row: T) => number, x: number) {
  let lo = 0
  let hi = rows.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (getX(rows[mid] as T) < x) lo = mid + 1
    else hi = mid
  }
  const prev = rows[lo - 1]
  const at = rows[lo]
  if (prev !== undefined && at !== undefined && x - getX(prev) < getX(at) - x) {
    return lo - 1
  }
  return lo
}
