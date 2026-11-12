import { type PointerEvent, useId, useMemo, useRef, useState } from 'react'
import { getTimeTicks } from '~/components/core/chart/utils/xAxisTicks'
import { useElementSize } from '~/hooks/useElementSize'
import { cn } from '~/utils/cn'
import { formatRange, formatTimestamp } from '~/utils/dates'
import type { Upgrade } from '../../../live/simulatedHistory'
import { useUpgradeFocus } from '../state/upgradeFocus'
import { WINDOW_DAYS } from '../upgradeStory'

export interface DailyValue {
  /** Unix seconds, 00:00 UTC */
  t: number
  v: number
}

const DAY = 86_400
const TOP = 30
const BOTTOM = 22
const RIGHT = 10
const MIN_TICK_GAP = 58

/**
 * One series of daily history, drawn by hand so the partial day can end it
 * the way this page needs: complete days as a solid line, today so far as a
 * dashed step to a hollow point, and the anchored block's day marked.
 */
export function DailyChart({
  points,
  today,
  highlightDay,
  highlightLabel,
  format,
  kind,
  scale = 'linear',
  baseline = 'zero',
  upgrades = [],
  height = 220,
  seriesName,
  todayNote,
}: {
  /** Complete days only, oldest first */
  points: DailyValue[]
  /** Today so far, if the stream has it */
  today: DailyValue | undefined
  /** The day of the block the page is anchored to */
  highlightDay: number | undefined
  highlightLabel: string | undefined
  format: (value: number) => string
  /** A bucket sums or averages a day; a snapshot is the value at one moment */
  kind: 'bucket' | 'snapshot'
  scale?: 'linear' | 'log'
  /** 'auto' fits the data, for slow-moving totals like supply that would sit flat on zero */
  baseline?: 'zero' | 'auto'
  upgrades?: Upgrade[]
  height?: number
  seriesName: string
  /** What today's point is, e.g. that it's an average rather than a median */
  todayNote?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(ref)
  const [hover, setHover] = useState<number>()
  const gradientId = useId()

  const geometry = useMemo(
    () =>
      width > 0
        ? layout(points, today, width, height, scale, baseline)
        : undefined,
    [points, today, width, height, scale, baseline],
  )

  const all = today ? [...points, today] : points
  const hovered = hover !== undefined ? all[hover] : undefined

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!geometry) return
    const rect = e.currentTarget.getBoundingClientRect()
    const t = geometry.invertX(e.clientX - rect.left)
    setHover(nearestIndex(all, t))
  }

  return (
    <div
      ref={ref}
      className="relative touch-pan-y select-none"
      style={{ height }}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerMove}
      onPointerLeave={() => setHover(undefined)}
    >
      {geometry && (
        <svg
          width={width}
          height={height}
          className="overflow-visible"
          role="img"
          aria-label={`${seriesName}, daily`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--chart-ethereum)"
                stopOpacity={0.22}
              />
              <stop
                offset="100%"
                stopColor="var(--chart-ethereum)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          {geometry.yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={0}
                x2={width}
                y1={geometry.y(tick)}
                y2={geometry.y(tick)}
                className="stroke-(--chart-grid)"
                strokeOpacity={0.5}
                strokeDasharray={
                  tick === geometry.yTicks[0] ? undefined : '2 3'
                }
              />
              <text
                x={0}
                y={geometry.y(tick) - 4}
                className="fill-(--chart-tick-label) text-[11px] tabular-nums"
              >
                {format(tick)}
              </text>
            </g>
          ))}
          <XTicks points={points} x={geometry.x} height={height} />
          <Upgrades
            upgrades={upgrades}
            x={geometry.x}
            from={points[0]?.t ?? 0}
            to={(today ?? points.at(-1))?.t ?? 0}
            height={height}
          />
          {highlightDay !== undefined && (
            <Highlight
              x={geometry.x(highlightDay)}
              dayWidth={geometry.dayWidth}
              height={height}
              label={highlightLabel}
            />
          )}
          <path d={geometry.area} fill={`url(#${gradientId})`} />
          <path
            d={geometry.line}
            fill="none"
            strokeWidth={2}
            strokeLinejoin="round"
            className="stroke-chart-ethereum"
          />
          {today && geometry.todayPoint && geometry.lastPoint && (
            <g>
              <line
                x1={geometry.lastPoint.x}
                y1={geometry.lastPoint.y}
                x2={geometry.todayPoint.x}
                y2={geometry.todayPoint.y}
                strokeWidth={2}
                strokeDasharray="3 3"
                className="stroke-chart-ethereum"
              />
              <circle
                cx={geometry.todayPoint.x}
                cy={geometry.todayPoint.y}
                r={4.5}
                strokeWidth={2}
                className="fill-surface-primary stroke-chart-ethereum"
              />
            </g>
          )}
          {hovered && (
            <g>
              <line
                x1={geometry.x(hovered.t)}
                x2={geometry.x(hovered.t)}
                y1={TOP}
                y2={height - BOTTOM}
                className="stroke-primary/40"
              />
              <circle
                cx={geometry.x(hovered.t)}
                cy={geometry.y(hovered.v)}
                r={4}
                strokeWidth={2}
                className="fill-chart-ethereum stroke-surface-primary"
              />
            </g>
          )}
        </svg>
      )}
      {geometry && hovered && (
        <div
          className="pointer-events-none absolute z-10 w-max max-w-[240px] rounded-lg bg-surface-primary p-3 text-paragraph-13 shadow-popover dark:bg-header-secondary"
          style={{
            top: 8,
            ...(geometry.x(hovered.t) > width / 2
              ? { right: width - geometry.x(hovered.t) + 12 }
              : { left: geometry.x(hovered.t) + 12 }),
          }}
        >
          <div className="mb-1 text-secondary">
            {hovered === today
              ? `Today so far, ${formatTimestamp(hovered.t)}`
              : kind === 'bucket'
                ? formatRange(hovered.t, hovered.t + DAY)
                : formatTimestamp(hovered.t)}
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 rounded-full bg-chart-ethereum" />
              {seriesName}
            </span>
            <span className="font-bold tabular-nums">{format(hovered.v)}</span>
          </div>
          {hovered === today && todayNote && (
            <div className="mt-1.5 text-secondary text-xs">{todayNote}</div>
          )}
        </div>
      )}
    </div>
  )
}

function XTicks({
  points,
  x,
  height,
}: {
  points: DailyValue[]
  x: (t: number) => number
  height: number
}) {
  const ticks = useMemo(() => getTimeTicks(points.map((p) => p.t)), [points])
  // on a phone a year of ticks would collide; keep every n-th so they breathe
  const spacing =
    ticks.values.length > 1
      ? x(ticks.values[1] ?? 0) - x(ticks.values[0] ?? 0)
      : Number.POSITIVE_INFINITY
  const every = Math.max(1, Math.ceil(MIN_TICK_GAP / spacing))
  return (
    <g>
      {ticks.values
        .filter((_, i) => i % every === 0)
        .map((t) => (
          <text
            key={t}
            x={x(t)}
            y={height - 4}
            textAnchor="middle"
            className="fill-(--chart-tick-label) text-[11px]"
          >
            {ticks.format(t)}
          </text>
        ))}
    </g>
  )
}

/** Labels of upgrades close together step down a row, so none overlap */
function Upgrades({
  upgrades,
  x,
  from,
  to,
  height,
}: {
  upgrades: Upgrade[]
  x: (t: number) => number
  from: number
  to: number
  height: number
}) {
  const { focused } = useUpgradeFocus()
  let lastX = Number.NEGATIVE_INFINITY
  let row = 0
  return (
    <g>
      {upgrades
        .filter((u) => u.timestamp >= from && u.timestamp <= to)
        .map((u) => {
          const ux = x(u.timestamp)
          row = ux - lastX < 64 ? (row + 1) % 2 : 0
          lastX = ux
          return (
            <g
              key={u.name}
              className={cn(
                'transition-opacity duration-200',
                focused && focused !== u.name && 'opacity-30',
              )}
            >
              {/* the timeline stop being pointed at, widened into its 60-day window */}
              {focused === u.name && (
                <rect
                  x={x(u.timestamp - WINDOW_DAYS * DAY)}
                  width={
                    x(u.timestamp + WINDOW_DAYS * DAY) -
                    x(u.timestamp - WINDOW_DAYS * DAY)
                  }
                  y={TOP - 4}
                  height={height - BOTTOM - TOP + 4}
                  className="fill-chart-ethereum/10"
                />
              )}
              <line
                x1={ux}
                x2={ux}
                y1={4 + row * 12}
                y2={height - BOTTOM}
                strokeDasharray={focused === u.name ? undefined : '2 2'}
                strokeWidth={focused === u.name ? 2 : 1}
                className={
                  focused === u.name
                    ? 'stroke-chart-ethereum'
                    : 'stroke-primary/45'
                }
              />
              <text
                x={ux + 4}
                y={11 + row * 12}
                className={cn(
                  'font-medium text-[11px]',
                  focused === u.name
                    ? 'fill-chart-ethereum font-bold'
                    : 'fill-primary',
                )}
              >
                {u.name}
              </text>
            </g>
          )
        })}
    </g>
  )
}

function Highlight({
  x,
  dayWidth,
  height,
  label,
}: {
  x: number
  dayWidth: number
  height: number
  label: string | undefined
}) {
  const w = Math.max(6, dayWidth)
  return (
    <g>
      <rect
        x={x - w / 2}
        y={TOP - 4}
        width={w}
        height={height - BOTTOM - TOP + 4}
        rx={2}
        className="fill-brand/15"
      />
      {label && (
        <text
          x={x - w / 2 - 4}
          y={height - BOTTOM - 6}
          textAnchor="end"
          className="fill-brand-deep font-medium text-[11px]"
        >
          {label}
        </text>
      )}
    </g>
  )
}

function layout(
  points: DailyValue[],
  today: DailyValue | undefined,
  width: number,
  height: number,
  scale: 'linear' | 'log',
  baseline: 'zero' | 'auto',
) {
  const all = today ? [...points, today] : points
  const first = all[0]?.t ?? 0
  const last = all.at(-1)?.t ?? 1
  const plotWidth = width - RIGHT
  const x = (t: number) => ((t - first) / Math.max(1, last - first)) * plotWidth
  const invertX = (px: number) => first + (px / plotWidth) * (last - first)
  const values = all.map((p) => p.v)
  const bottom = height - BOTTOM

  let y: (v: number) => number
  let yTicks: number[]
  if (scale === 'log') {
    const positive = values.filter((v) => v > 0)
    const lo = Math.floor(Math.log10(Math.min(...positive)))
    const hi = Math.ceil(Math.log10(Math.max(...positive)))
    y = (v) =>
      bottom -
      ((Math.log10(Math.max(v, 10 ** lo)) - lo) / Math.max(1, hi - lo)) *
        (bottom - TOP)
    yTicks = []
    for (let p = lo; p <= hi; p++) yTicks.push(10 ** p)
  } else if (baseline === 'auto') {
    const lo = Math.min(...values)
    const hi = Math.max(...values)
    const step = niceCeil((hi - lo) / 4 || 1)
    const min = Math.floor(lo / step) * step
    const max = Math.ceil(hi / step) * step
    y = (v) => bottom - ((v - min) / Math.max(step, max - min)) * (bottom - TOP)
    yTicks = []
    for (let v = min; v <= max + step / 2; v += step) yTicks.push(v)
  } else {
    const step = niceCeil(Math.max(...values, 0) / 4)
    const max = Math.ceil(Math.max(...values, 0) / step) * step || step
    y = (v) => bottom - (v / max) * (bottom - TOP)
    yTicks = []
    for (let v = 0; v <= max + step / 2; v += step) yTicks.push(v)
  }

  const coords = points.map((p) => ({ x: x(p.t), y: y(p.v) }))
  const line = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join('')
  const lastPoint = coords.at(-1)
  const area = lastPoint
    ? `${line}L${lastPoint.x.toFixed(1)},${bottom}L${coords[0]?.x.toFixed(1)},${bottom}Z`
    : ''
  return {
    x,
    y,
    invertX,
    yTicks,
    line,
    area,
    lastPoint,
    todayPoint: today ? { x: x(today.t), y: y(today.v) } : undefined,
    dayWidth: (DAY / Math.max(1, last - first)) * plotWidth,
  }
}

function niceCeil(value: number) {
  if (value <= 0) return 1
  const power = 10 ** Math.floor(Math.log10(value))
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (step * power >= value) return step * power
  }
  return 10 * power
}

function nearestIndex(points: DailyValue[], t: number) {
  let lo = 0
  let hi = points.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if ((points[mid]?.t ?? 0) < t) lo = mid + 1
    else hi = mid
  }
  const prev = points[lo - 1]
  if (prev && Math.abs(prev.t - t) < Math.abs((points[lo]?.t ?? 0) - t))
    return lo - 1
  return lo
}
