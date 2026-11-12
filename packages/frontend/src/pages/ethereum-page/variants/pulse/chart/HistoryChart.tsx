import { type PointerEvent, useId, useMemo, useRef, useState } from 'react'
import { getTimeTicks } from '~/components/core/chart/utils/xAxisTicks'
import { useElementSize } from '~/hooks/useElementSize'
import { cn } from '~/utils/cn'
import { formatRange, formatTimestamp } from '~/utils/dates'
import type { Upgrade } from '../../../live/simulatedHistory'

const DAY = 86_400
const PAD = { top: 44, right: 12, bottom: 26, left: 0 }

export interface ChartPoint {
  /** Unix seconds, 00:00 UTC of the day */
  t: number
  v: number
}

export type ChartColor = 'brand' | 'ethereum' | 'positive'

const STROKE: Record<ChartColor, string> = {
  brand: 'stroke-brand',
  ethereum: 'stroke-chart-ethereum',
  positive: 'stroke-positive',
}
const FILL: Record<ChartColor, string> = {
  brand: 'fill-brand',
  ethereum: 'fill-chart-ethereum',
  positive: 'fill-positive',
}
const STOP: Record<ChartColor, string> = {
  brand: 'var(--brand)',
  ethereum: 'var(--chart-ethereum)',
  positive: 'var(--positive)',
}

/**
 * Complete days as a line, today's partial day as a hollow point at the end
 * of a dashed stretch: it is still filling, so it must not read as a drop.
 * Upgrades are marked where they shipped, since they explain most steps.
 */
export function HistoryChart({
  points,
  today,
  format,
  kind,
  scale = 'linear',
  color = 'brand',
  upgrades = [],
  label,
  className,
}: {
  points: ChartPoint[]
  today: ChartPoint | undefined
  format: (value: number) => string
  /** A bucket sums or averages a day; a snapshot is the value at its end */
  kind: 'bucket' | 'snapshot'
  scale?: 'linear' | 'log' | 'fit'
  color?: ChartColor
  upgrades?: Upgrade[]
  label: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const gradientId = useId()
  const { width, height } = useElementSize(ref)
  const [hover, setHover] = useState<number>()

  const all = today ? [...points, today] : points
  const layout = useMemo(
    () => toLayout(points, today, scale, width, height),
    [points, today, scale, width, height],
  )
  const ticks = useMemo(() => getTimeTicks(points.map((p) => p.t)), [points])

  const onPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!layout) return
    const box = event.currentTarget.getBoundingClientRect()
    const t = layout.tOf(event.clientX - box.left)
    let best = 0
    for (let i = 1; i < all.length; i++) {
      if (Math.abs((all[i]?.t ?? 0) - t) < Math.abs((all[best]?.t ?? 0) - t))
        best = i
    }
    setHover(best)
  }

  const hovered = hover === undefined ? undefined : all[hover]
  const isToday = hovered !== undefined && hovered === today

  return (
    <div ref={ref} className={cn('relative h-64 md:h-80', className)}>
      {layout && (
        <svg
          width={width}
          height={height}
          className="block touch-pan-y overflow-visible"
          role="img"
          aria-label={label}
          onPointerMove={onPointer}
          onPointerDown={onPointer}
          onPointerLeave={() => setHover(undefined)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={STOP[color]} stopOpacity={0.22} />
              <stop offset="100%" stopColor={STOP[color]} stopOpacity={0} />
            </linearGradient>
          </defs>
          {layout.yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={0}
                x2={width}
                y1={layout.y(tick)}
                y2={layout.y(tick)}
                className="stroke-divider"
                strokeWidth={1}
              />
              <text
                x={0}
                y={layout.y(tick) - 6}
                className="fill-secondary text-[11px] tabular-nums"
              >
                {format(tick)}
              </text>
            </g>
          ))}
          {spaced(ticks.values, layout.x).map((t) => (
            <text
              key={t}
              x={layout.x(t)}
              y={height - 6}
              textAnchor="middle"
              className="fill-secondary text-[11px]"
            >
              {ticks.format(t)}
            </text>
          ))}
          {placeUpgrades(upgrades, points[0]?.t ?? 0, layout.x).map(
            ({ upgrade, x, row }) => (
              <g key={upgrade.name}>
                <line
                  x1={x}
                  x2={x}
                  y1={4 + row * 12}
                  y2={height - PAD.bottom}
                  className="stroke-secondary/60"
                  strokeDasharray="2 4"
                />
                <text
                  x={x + 4}
                  y={10 + row * 12}
                  className="fill-secondary font-medium text-[11px]"
                >
                  {upgrade.name}
                </text>
              </g>
            ),
          )}
          <path d={layout.area} fill={`url(#${gradientId})`} />
          <path
            d={layout.line}
            className={cn('fill-none', STROKE[color])}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {layout.todayLine && today && (
            <>
              <path
                d={layout.todayLine}
                className={cn('fill-none', STROKE[color])}
                strokeWidth={2}
                strokeDasharray="3 4"
              />
              <circle
                cx={layout.x(today.t)}
                cy={layout.y(today.v)}
                r={4.5}
                className={cn('fill-surface-primary', STROKE[color])}
                strokeWidth={2}
              />
            </>
          )}
          {hovered && (
            <g>
              <line
                x1={layout.x(hovered.t)}
                x2={layout.x(hovered.t)}
                y1={PAD.top}
                y2={height - PAD.bottom}
                className="stroke-primary/40"
              />
              <circle
                cx={layout.x(hovered.t)}
                cy={layout.y(hovered.v)}
                r={4}
                className={isToday ? 'fill-surface-primary' : FILL[color]}
              />
            </g>
          )}
        </svg>
      )}
      {layout && hovered && (
        <div
          className="pointer-events-none absolute top-6 z-10 rounded-lg border border-divider bg-surface-primary px-3 py-2 shadow-popover"
          style={{
            left: Math.min(
              Math.max(0, layout.x(hovered.t) - 90),
              Math.max(0, width - 180),
            ),
            width: 180,
          }}
        >
          <div className="whitespace-pre-line text-label-value-12 text-secondary">
            {isToday
              ? 'Today so far, since 00:00 UTC'
              : kind === 'bucket'
                ? formatRange(hovered.t, hovered.t + DAY)
                : formatTimestamp(hovered.t + DAY - 1)}
          </div>
          <div className="mt-1.5 font-bold text-label-value-16 text-primary tabular-nums">
            {format(hovered.v)}
          </div>
        </div>
      )}
    </div>
  )
}

function toLayout(
  points: ChartPoint[],
  today: ChartPoint | undefined,
  scale: 'linear' | 'log' | 'fit',
  width: number,
  height: number,
) {
  const first = points[0]
  const last = points.at(-1)
  if (!first || !last || width === 0 || height === 0) return undefined
  const end = today ? today.t : last.t
  const values = [...points.map((p) => p.v), ...(today ? [today.v] : [])]
  const max = Math.max(...values)
  const min = Math.min(...values)
  const innerH = height - PAD.top - PAD.bottom
  const innerW = width - PAD.left - PAD.right
  const x = (t: number) =>
    PAD.left + ((t - first.t) / Math.max(1, end - first.t)) * innerW
  const tOf = (px: number) =>
    first.t + ((px - PAD.left) / innerW) * (end - first.t)

  let y: (v: number) => number
  let yTicks: number[]
  if (scale === 'log') {
    const lo = Math.floor(Math.log10(Math.max(min, 1e-9)))
    const hi = Math.ceil(Math.log10(Math.max(max, 1e-9)))
    const span = Math.max(1, hi - lo)
    y = (v) =>
      PAD.top + innerH * (1 - (Math.log10(Math.max(v, 1e-9)) - lo) / span)
    const step = Math.max(1, Math.ceil(span / 3))
    yTicks = []
    for (let e = lo; e <= hi; e += step) yTicks.push(10 ** e)
  } else {
    const lo = scale === 'fit' ? min - (max - min) * 0.1 : 0
    const hi = niceCeil(max * (scale === 'fit' ? 1 : 1.08), lo)
    y = (v) => PAD.top + innerH * (1 - (v - lo) / Math.max(1e-9, hi - lo))
    yTicks = [lo, lo + (hi - lo) / 2, hi].map((v) =>
      scale === 'fit' ? Math.round(v) : v,
    )
    if (scale === 'fit') yTicks = yTicks.slice(1)
  }

  const coords = points.map((p) => `${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`)
  const line = `M${coords.join('L')}`
  const bottom = height - PAD.bottom
  const area = `${line}L${x(last.t).toFixed(1)},${bottom}L${x(first.t).toFixed(1)},${bottom}Z`
  const todayLine = today
    ? `M${x(last.t)},${y(last.v)}L${x(today.t)},${y(today.v)}`
    : undefined
  return { x, y, tOf, line, area, todayLine, yTicks }
}

/** Fusaka and BPO2 shipped a month apart: a label that would run into the one before drops a row */
function placeUpgrades(
  upgrades: Upgrade[],
  from: number,
  x: (t: number) => number,
) {
  const LABEL_WIDTH = 56
  let lastX = Number.NEGATIVE_INFINITY
  let lastRow = 1
  return upgrades
    .filter((u) => u.timestamp > from)
    .map((upgrade) => {
      const at = x(upgrade.timestamp)
      const row = at - lastX < LABEL_WIDTH && lastRow === 0 ? 1 : 0
      lastX = at
      lastRow = row
      return { upgrade, x: at, row }
    })
}

function niceCeil(value: number, floor: number) {
  const span = value - floor
  if (span <= 0) return value
  const magnitude = 10 ** Math.floor(Math.log10(span))
  const step = magnitude / 2
  return floor + Math.ceil(span / step) * step
}

/** On a phone three years of ticks would overlap, so each keeps a label's width from the last */
function spaced(ticks: number[], x: (t: number) => number) {
  const MIN_GAP = 56
  let last = Number.NEGATIVE_INFINITY
  return ticks.filter((t) => {
    if (x(t) - last < MIN_GAP) return false
    last = x(t)
    return true
  })
}
