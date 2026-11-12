import { type KeyboardEvent, type PointerEvent, useRef, useState } from 'react'
import { getTimeTicks } from '~/components/core/chart/utils/xAxisTicks'
import { cn } from '~/utils/cn'
import { formatRange } from '~/utils/dates'
import { DAY } from '../derive'

export interface ChartSeries {
  key: string
  label: string
  color: string
  values: (number | undefined)[]
  mark: 'line' | 'area' | 'bar' | 'step'
}

export interface ChartMarker {
  timestamp: number
  label: string
}

/** Drawn in a fixed box and stretched to the panel: strokes don't scale, labels are HTML */
const W = 1000

/**
 * Daily history in the console's language. The last point is today so far
 * when `partial` is set: dashed, hollow, and named so in the tooltip, as the
 * day is not over. Arrow keys walk the days.
 */
export function HistoryChart({
  timestamps,
  series,
  partial,
  format,
  height = 200,
  log = false,
  includeZero = true,
  markers = [],
  className,
  label,
}: {
  timestamps: number[]
  series: ChartSeries[]
  partial: boolean
  format: (value: number) => string
  height?: number
  log?: boolean
  /** Off for levels like supply, where zero is far below anything that moves */
  includeZero?: boolean
  markers?: ChartMarker[]
  className?: string
  label: string
}) {
  const [hover, setHover] = useState<number>()
  const boxRef = useRef<HTMLDivElement>(null)
  const n = timestamps.length
  const H = height
  const plotTop = 22
  const plotBottom = H - 4
  const scale = makeScale(series, log, includeZero, plotTop, plotBottom)
  const x = (i: number) => (n <= 1 ? W / 2 : ((i + 0.5) / n) * W)
  const lastIndex = n - 1
  const first = timestamps[0] ?? 0
  const last = timestamps[lastIndex] ?? 0
  const allTicks = getTimeTicks(timestamps)
  // kept off the edges, where a centred label would hang outside the chart
  const ticks = thin(
    {
      ...allTicks,
      values: allTicks.values.filter((t) => {
        const share = xOfTime(t, first, last, n) / W
        return share > 0.06 && share < 0.94
      }),
    },
    6,
  )
  const shownMarkers = markers.filter(
    (m) => m.timestamp >= first && m.timestamp <= last,
  )

  function indexAt(event: PointerEvent) {
    const rect = boxRef.current?.getBoundingClientRect()
    if (!rect || n === 0) return undefined
    const share = (event.clientX - rect.left) / rect.width
    return Math.max(0, Math.min(lastIndex, Math.floor(share * n)))
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const step = event.key === 'ArrowLeft' ? -1 : 1
    setHover((h) => Math.max(0, Math.min(lastIndex, (h ?? lastIndex) + step)))
  }

  const bars = series.filter((s) => s.mark === 'bar')
  const barWidth = (W / Math.max(1, n)) * (n > 200 ? 1 : 0.72)

  return (
    <div className={cn('relative select-none', className)}>
      <div
        ref={boxRef}
        tabIndex={0}
        role="img"
        aria-label={label}
        onPointerMove={(e) => setHover(indexAt(e))}
        onPointerLeave={() => setHover(undefined)}
        onKeyDown={onKeyDown}
        onBlur={() => setHover(undefined)}
        className="relative rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-brand"
        style={{ height: H }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
          aria-hidden
        >
          {scale.ticks.map((t) => (
            <line
              key={t}
              x1={0}
              x2={W}
              y1={scale.y(t)}
              y2={scale.y(t)}
              stroke="var(--chart-grid)"
              strokeOpacity={0.45}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {shownMarkers.map((m) => (
            <line
              key={m.label}
              x1={xOfTime(m.timestamp, first, last, n)}
              x2={xOfTime(m.timestamp, first, last, n)}
              y1={plotTop - 6}
              y2={plotBottom}
              stroke="var(--secondary)"
              strokeOpacity={0.7}
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {bars.map((s) =>
            s.values.map((v, i) => {
              if (v === undefined) return null
              const isPartial = partial && i === lastIndex
              const y0 = scale.y(scale.base)
              const y1 = scale.y(v)
              return (
                <rect
                  key={`${s.key}-${i}`}
                  x={x(i) - barWidth / 2}
                  width={barWidth}
                  y={Math.min(y0, y1)}
                  height={Math.max(0.5, Math.abs(y1 - y0))}
                  fill={s.color}
                  fillOpacity={isPartial ? 0.18 : hover === i ? 1 : 0.82}
                  stroke={isPartial ? s.color : 'none'}
                  strokeDasharray={isPartial ? '2 2' : undefined}
                  vectorEffect="non-scaling-stroke"
                />
              )
            }),
          )}
          {series
            .filter((s) => s.mark !== 'bar')
            .map((s) => {
              const solidEnd = partial ? lastIndex - 1 : lastIndex
              const solid = pathOf(s.values, x, scale.y, 0, solidEnd, s.mark)
              const tail = partial
                ? pathOf(s.values, x, scale.y, lastIndex - 1, lastIndex, s.mark)
                : ''
              return (
                <g key={s.key}>
                  {s.mark === 'area' && solid && (
                    <path
                      d={`${solid} L${x(solidEnd)},${scale.y(scale.base)} L${x(firstDefined(s.values))},${scale.y(scale.base)} Z`}
                      fill={s.color}
                      fillOpacity={0.12}
                    />
                  )}
                  <path
                    d={solid}
                    fill="none"
                    stroke={s.mark === 'step' ? 'var(--secondary)' : s.color}
                    strokeWidth={s.mark === 'step' ? 1 : 1.75}
                    strokeDasharray={s.mark === 'step' ? '4 3' : undefined}
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {tail && (
                    <path
                      d={tail}
                      fill="none"
                      stroke={s.mark === 'step' ? 'var(--secondary)' : s.color}
                      strokeWidth={s.mark === 'step' ? 1 : 1.75}
                      strokeDasharray="3 3"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </g>
              )
            })}
        </svg>

        {/* Pass 2: HTML on top, so text and dots keep their shape however the box stretches */}
        {scale.ticks.map((t) => (
          <span
            key={t}
            className="-translate-y-full pointer-events-none absolute left-0 rounded-[2px] bg-surface-primary/85 px-0.5 font-mono text-[10px] text-secondary leading-[13px]"
            style={{ top: `${(scale.y(t) / H) * 100}%` }}
          >
            {format(t)}
          </span>
        ))}
        {shownMarkers.map((m, i) => (
          <span
            key={m.label}
            className="-translate-x-1/2 pointer-events-none absolute whitespace-nowrap rounded-[3px] bg-surface-primary px-1 font-mono text-[10px] text-secondary leading-4"
            style={{
              left: `${(xOfTime(m.timestamp, first, last, n) / W) * 100}%`,
              top: i % 2 === 0 ? 0 : 14,
            }}
          >
            {m.label}
          </span>
        ))}
        {series
          .filter((s) => s.mark === 'line' || s.mark === 'area')
          .map((s) => {
            const v = s.values[lastIndex]
            if (v === undefined) return null
            return (
              <span
                key={s.key}
                className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute size-[7px] rounded-full border-[1.5px]"
                style={{
                  left: `${(x(lastIndex) / W) * 100}%`,
                  top: `${(scale.y(v) / H) * 100}%`,
                  borderColor: s.color,
                  background: partial ? 'var(--surface-primary)' : s.color,
                }}
              />
            )
          })}
        {hover !== undefined && (
          <Crosshair
            index={hover}
            leftShare={x(hover) / W}
            timestamp={timestamps[hover] ?? 0}
            isPartial={partial && hover === lastIndex}
            series={series}
            format={format}
            dotTop={(v) => `${(scale.y(v) / H) * 100}%`}
          />
        )}
      </div>
      <div className="relative mt-1 h-4 font-mono text-[10px] text-secondary">
        {ticks.values.map((t) => (
          <span
            key={t}
            className="-translate-x-1/2 absolute whitespace-nowrap"
            style={{ left: `${(xOfTime(t, first, last, n) / W) * 100}%` }}
          >
            {ticks.format(t)}
          </span>
        ))}
      </div>
    </div>
  )
}

function Crosshair({
  index,
  leftShare,
  timestamp,
  isPartial,
  series,
  format,
  dotTop,
}: {
  index: number
  leftShare: number
  timestamp: number
  isPartial: boolean
  series: ChartSeries[]
  format: (value: number) => string
  dotTop: (value: number) => string
}) {
  const flip = leftShare > 0.6
  return (
    <>
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-primary/40"
        style={{ left: `${leftShare * 100}%` }}
      />
      {series
        .filter((s) => s.mark !== 'step' && s.mark !== 'bar')
        .map((s) => {
          const v = s.values[index]
          if (v === undefined) return null
          return (
            <span
              key={s.key}
              className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute size-2 rounded-full border-2 border-surface-primary"
              style={{
                left: `${leftShare * 100}%`,
                top: dotTop(v),
                background: s.color,
              }}
            />
          )
        })}
      <div
        className={cn(
          'pointer-events-none absolute top-6 z-10 min-w-40 rounded-md border border-divider bg-surface-primary px-2.5 py-2 shadow-popover',
          flip ? '-translate-x-full -ml-2' : 'ml-2',
        )}
        style={{ left: `${leftShare * 100}%` }}
      >
        <div className="whitespace-pre-line font-medium text-[11px] text-secondary leading-snug">
          {isPartial
            ? 'Today so far, since 00:00 UTC'
            : formatRange(timestamp, timestamp + DAY)}
        </div>
        <div className="mt-1.5 space-y-1">
          {series.map((s) => {
            const v = s.values[index]
            if (v === undefined) return null
            return (
              <div
                key={s.key}
                className="flex items-center gap-2 text-[11.5px] text-primary"
              >
                <span
                  className={cn(
                    'size-2 shrink-0 rounded-[2px]',
                    s.mark === 'step' &&
                      'h-0 border-secondary border-t border-dashed',
                  )}
                  style={
                    s.mark === 'step' ? undefined : { background: s.color }
                  }
                />
                <span className="text-secondary">{s.label}</span>
                <span className="ml-auto pl-3 font-mono tabular-nums">
                  {format(v)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

function makeScale(
  series: ChartSeries[],
  log: boolean,
  includeZero: boolean,
  top: number,
  bottom: number,
) {
  const values = series.flatMap((s) =>
    s.values.filter((v): v is number => v !== undefined && Number.isFinite(v)),
  )
  if (log) {
    const positive = values.filter((v) => v > 0)
    const lo = Math.floor(Math.log10(Math.min(...positive, 1)))
    const hi = Math.ceil(Math.log10(Math.max(...positive, 10)))
    const span = Math.max(1, hi - lo)
    const ticks: number[] = []
    const every = Math.max(1, Math.ceil(span / 4))
    for (let e = lo; e <= hi; e += every) ticks.push(10 ** e)
    return {
      base: 10 ** lo,
      ticks,
      // rounded: Node and browsers disagree on log10's last digits, and the path must hydrate
      y: (v: number) =>
        round2(
          bottom -
            ((Math.log10(Math.max(v, 10 ** lo)) - lo) / span) * (bottom - top),
        ),
    }
  }
  const min = includeZero ? Math.min(0, ...values) : Math.min(...values)
  const max = includeZero ? Math.max(...values, 0) : Math.max(...values)
  const step = niceStep((max - min) / 4 || 1)
  const lo = Math.floor(min / step) * step
  const hi = Math.ceil(max / step) * step || step
  const ticks: number[] = []
  for (let t = lo; t <= hi + step / 2; t += step) ticks.push(round(t))
  return {
    base: includeZero ? 0 : lo,
    ticks,
    y: (v: number) => bottom - ((v - lo) / (hi - lo || 1)) * (bottom - top),
  }
}

function round2(value: number) {
  return Math.round(value * 100) / 100
}

function niceStep(raw: number) {
  const power = 10 ** Math.floor(Math.log10(raw))
  const unit = raw / power
  const nice =
    unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 2.5 ? 2.5 : unit <= 5 ? 5 : 10
  return nice * power
}

function round(value: number) {
  return Number.parseFloat(value.toPrecision(12))
}

function pathOf(
  values: (number | undefined)[],
  x: (i: number) => number,
  y: (v: number) => number,
  from: number,
  to: number,
  mark: ChartSeries['mark'],
) {
  let d = ''
  let previous: number | undefined
  for (let i = from; i <= to; i++) {
    const v = values[i]
    if (v === undefined) {
      previous = undefined
      continue
    }
    if (previous === undefined) {
      d += `M${x(i)},${y(v)}`
    } else if (mark === 'step') {
      // a limit changes at a fork, between two days, not along a slope
      const mid = (x(i - 1) + x(i)) / 2
      d += ` H${mid} V${y(v)} H${x(i)}`
    } else {
      d += ` L${x(i)},${y(v)}`
    }
    previous = v
  }
  return d
}

function firstDefined(values: (number | undefined)[]) {
  const index = values.findIndex((v) => v !== undefined)
  return Math.max(0, index)
}

function xOfTime(t: number, first: number, last: number, n: number) {
  if (last === first) return W / 2
  const i = ((t - first) / (last - first)) * (n - 1)
  return ((i + 0.5) / n) * W
}

function thin<T extends { values: number[] }>(ticks: T, max: number): T {
  if (ticks.values.length <= max) return ticks
  const every = Math.ceil(ticks.values.length / max)
  return { ...ticks, values: ticks.values.filter((_, i) => i % every === 0) }
}
