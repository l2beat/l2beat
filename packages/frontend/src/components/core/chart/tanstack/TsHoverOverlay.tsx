import type { ChartScene } from '@tanstack/charts'
import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

const TOOLTIP_OFFSET = 16
/** The least room left between a tooltip and the window's edge. */
const TOOLTIP_WINDOW_MARGIN = 8
const ACTIVE_DOT_RADIUS = 3

interface Active {
  index: number
  /** Where the tooltip hangs from, in overlay pixels. */
  x: number
  y: number
}

/**
 * Crosshair, active dots and tooltip for a time series. React renders only
 * when the hovered row changes; moves within a row just translate the
 * tooltip. Like the Recharts charts, the tooltip sits below and right of the
 * pointer (left past the middle of the plot), may leave the chart but not
 * the window, and arrow keys move it between rows.
 */
export function TsHoverOverlay<T extends { timestamp: number }>({
  rows,
  keys,
  sceneRef,
  ariaLabel,
  renderTooltip,
}: {
  rows: T[]
  keys: (keyof T & string)[]
  sceneRef: RefObject<ChartScene | null>
  ariaLabel: string
  renderTooltip: (row: T) => ReactNode
}) {
  const [active, setActive] = useState<Active | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const scene = sceneRef.current
  const row = active ? rows[active.index] : undefined

  function placeTooltip(x: number, y: number) {
    const tooltip = tooltipRef.current
    const root = rootRef.current
    const plot = sceneRef.current?.chart
    if (!tooltip || !root || !plot) return
    const rootLeft = root.getBoundingClientRect().left
    const width = tooltip.offsetWidth
    const onLeft = x > plot.x + plot.width / 2
    let left = onLeft ? x - TOOLTIP_OFFSET - width : x + TOOLTIP_OFFSET
    const max = document.documentElement.clientWidth - TOOLTIP_WINDOW_MARGIN
    if (rootLeft + left + width > max) left = max - width - rootLeft
    if (rootLeft + left < TOOLTIP_WINDOW_MARGIN) {
      left = TOOLTIP_WINDOW_MARGIN - rootLeft
    }
    tooltip.style.transform = `translate(${left}px, ${y + TOOLTIP_OFFSET}px)`
  }

  // A new row means new tooltip content, so it is measured and placed after
  // React has rendered it, before the frame is painted.
  // biome-ignore lint/correctness/useExhaustiveDependencies: placeTooltip reads refs
  useLayoutEffect(() => {
    if (active) placeTooltip(active.x, active.y)
  }, [active])

  function activate(index: number, x: number, y: number) {
    if (index === active?.index) {
      placeTooltip(x, y)
      return
    }
    setActive({ index, x, y })
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const invert = sceneRef.current?.scales.x?.invert
    if (!invert || rows.length === 0) return
    // Layout is clean between moves (only transforms change), so this
    // does not force one.
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    activate(nearestIndex(rows, Number(invert(x))), x, y)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    const current = sceneRef.current
    if (step === 0 || !current || rows.length === 0) return
    event.preventDefault()
    // The first press starts from the end it points away from.
    const from = active ? active.index : step > 0 ? -1 : rows.length
    const index = Math.min(rows.length - 1, Math.max(0, from + step))
    const target = rows[index]
    if (!target) return
    const value = keys.map((key) => target[key]).find(isNumber)
    activate(
      index,
      current.scales.x?.map(target.timestamp) ?? 0,
      value !== undefined
        ? (current.scales.y?.map(value) ?? 0)
        : current.chart.y + current.chart.height / 2,
    )
  }

  const xScale = scene?.scales.x
  const yScale = scene?.scales.y
  const plot = scene?.chart
  const cx = row && xScale ? xScale.map(row.timestamp) : 0

  return (
    <div
      ref={rootRef}
      role="application"
      aria-label={ariaLabel}
      tabIndex={0}
      className="absolute inset-0 outline-none"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerMove}
      onPointerLeave={(event) => {
        // A lifted finger also leaves; the tooltip stays until a tap
        // elsewhere blurs the chart.
        if (event.pointerType !== 'touch') setActive(null)
      }}
      onKeyDown={onKeyDown}
      onBlur={() => setActive(null)}
    >
      {row && plot && yScale && (
        <>
          <div
            className="pointer-events-none absolute w-0.5 bg-primary"
            style={{
              top: plot.y,
              height: plot.height,
              transform: `translateX(${cx - 1}px)`,
            }}
          />
          {keys.map((key) => {
            const value = row[key]
            if (!isNumber(value)) return null
            return (
              <div
                key={key}
                className="pointer-events-none absolute rounded-full bg-primary"
                style={{
                  width: ACTIVE_DOT_RADIUS * 2,
                  height: ACTIVE_DOT_RADIUS * 2,
                  transform: `translate(${cx - ACTIVE_DOT_RADIUS}px, ${yScale.map(value) - ACTIVE_DOT_RADIUS}px)`,
                }}
              />
            )
          })}
        </>
      )}
      <div
        ref={tooltipRef}
        data-chart-tooltip=""
        className="pointer-events-none absolute top-0 left-0 z-110"
        style={{ visibility: row ? 'visible' : 'hidden' }}
      >
        {row && renderTooltip(row)}
      </div>
    </div>
  )
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/** Index of the row closest to `x`; rows are sorted by timestamp. */
function nearestIndex<T extends { timestamp: number }>(rows: T[], x: number) {
  let lo = 0
  let hi = rows.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if ((rows[mid]?.timestamp ?? 0) < x) lo = mid + 1
    else hi = mid
  }
  const prev = rows[lo - 1]
  const at = rows[lo]
  if (prev && at && x - prev.timestamp < at.timestamp - x) return lo - 1
  return lo
}
