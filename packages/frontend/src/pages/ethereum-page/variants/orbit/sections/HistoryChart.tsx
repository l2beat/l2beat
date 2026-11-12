import { UnixTime } from '@l2beat/shared-pure'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getTimeTicks } from '~/components/core/chart/utils/xAxisTicks'
import { formatRange } from '~/utils/dates'

export interface ChartPoint {
  /** Unix seconds, 00:00 UTC of the day */
  t: number
  v: number
}

export interface TodayPoint extends ChartPoint {
  /** Unix seconds the partial day runs to */
  until: number
}

interface Props {
  label: string
  points: ChartPoint[]
  /** Today's partial day, drawn hollow and dashed: it is still counting */
  today?: TodayPoint
  format: (value: number) => string
  color: string
  height?: number
  scale?: 'linear' | 'log'
  /** A stepped reference, like the blob target, dashed */
  reference?: { label: string; points: ChartPoint[] }
  markers?: { t: number; label: string }[]
  zeroBased?: boolean
}

const PAD = { top: 14, right: 12, bottom: 24, left: 44 }

/**
 * A daily history line that ends at the head: complete days solid, today so
 * far a dashed step to a hollow point. Hand-drawn SVG, as the shared charts
 * have no partial-day point
 */
export function HistoryChart({
  label,
  points,
  today,
  format,
  color,
  height = 200,
  scale = 'linear',
  reference,
  markers = [],
  zeroBased = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(640)
  const [hover, setHover] = useState<number>()
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.round(entry.contentRect.width))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const all = useMemo(
    () => (today ? [...points, today] : points),
    [points, today],
  )
  const layout = useMemo(() => {
    const first = all[0]?.t ?? 0
    const last = all.at(-1)?.t ?? 1
    const values = [
      ...all.map((p) => p.v),
      ...(reference?.points.map((p) => p.v) ?? []),
    ].filter((v) => scale === 'linear' || v > 0)
    let min = Math.min(...values)
    let max = Math.max(...values)
    if (scale === 'log') {
      min = Math.max(min / 1.4, 1e-9)
      max = max * 1.4
    } else {
      min = zeroBased ? 0 : min - (max - min) * 0.1
      max = max + (max - min) * 0.12
    }
    const plotWidth = Math.max(1, width - PAD.left - PAD.right)
    const plotHeight = height - PAD.top - PAD.bottom
    const x = (t: number) =>
      round(PAD.left + ((t - first) / Math.max(1, last - first)) * plotWidth)
    const y = (v: number) => {
      const f =
        scale === 'log'
          ? (Math.log(Math.max(v, min)) - Math.log(min)) /
            (Math.log(max) - Math.log(min))
          : (v - min) / Math.max(1e-12, max - min)
      return round(PAD.top + (1 - f) * plotHeight)
    }
    return { x, y, min, max, first, last, plotHeight }
  }, [all, reference, scale, zeroBased, width, height])

  const { x, y } = layout
  const line = points
    .map((p, i) => `${i ? 'L' : 'M'}${x(p.t)},${y(p.v)}`)
    .join('')
  const lastComplete = points.at(-1)
  const area =
    points.length > 1
      ? `${line}L${x(lastComplete?.t ?? 0)},${PAD.top + layout.plotHeight}L${x(points[0]?.t ?? 0)},${PAD.top + layout.plotHeight}Z`
      : ''
  const referencePath = reference ? steppedPath(reference.points, x, y) : ''
  const yTicks = getYTicks(layout.min, layout.max, scale)
  const xTicks = getTimeTicks(all.map((p) => p.t))
  const hovered = hover !== undefined ? all[hover] : undefined
  const hoveredIsToday = today !== undefined && hover === all.length - 1

  function onMove(event: React.PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    const px = event.clientX - box.left
    let best = 0
    let distance = Number.POSITIVE_INFINITY
    all.forEach((p, i) => {
      const d = Math.abs(x(p.t) - px)
      if (d < distance) {
        distance = d
        best = i
      }
    })
    setHover(best)
  }

  return (
    <div ref={ref} className="relative w-full select-none">
      <svg
        role="img"
        aria-label={label}
        width="100%"
        height={height}
        className="block touch-pan-y overflow-visible"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(undefined)}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              className="stroke-(--chart-grid)"
              strokeDasharray={tick === layout.min ? undefined : '2 4'}
            />
            <text
              x={PAD.left - 8}
              y={y(tick)}
              dy="0.32em"
              textAnchor="end"
              className="fill-secondary text-[11px] tabular-nums"
            >
              {trimTrailingZero(format(tick))}
            </text>
          </g>
        ))}
        {xTicks.values.map((t) => (
          <text
            key={t}
            x={x(t)}
            y={height - 6}
            textAnchor="middle"
            className="fill-secondary text-[11px]"
          >
            {xTicks.format(t)}
          </text>
        ))}
        {markers
          .filter((m) => m.t >= layout.first && m.t <= layout.last)
          .map((m, i, shownMarkers) => (
            <g key={m.label}>
              <line
                x1={x(m.t)}
                x2={x(m.t)}
                y1={PAD.top - 2}
                y2={PAD.top + layout.plotHeight}
                className="stroke-secondary/50"
                strokeDasharray="1 3"
              />
              <text
                x={x(m.t) + 4}
                y={PAD.top + 6 + (crowdsPrevious(shownMarkers, i, x) ? 13 : 0)}
                className="fill-secondary font-medium text-[11px]"
              >
                {m.label}
              </text>
            </g>
          ))}
        {area && <path d={area} fill={color} opacity={0.1} />}
        {referencePath && (
          <path
            d={referencePath}
            fill="none"
            className="stroke-primary/60"
            strokeWidth={1.25}
            strokeDasharray="4 3"
          />
        )}
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {today && lastComplete && (
          <>
            <line
              x1={x(lastComplete.t)}
              y1={y(lastComplete.v)}
              x2={x(today.t)}
              y2={y(today.v)}
              stroke={color}
              strokeWidth={2}
              strokeDasharray="3 3"
            />
            <circle
              cx={x(today.t)}
              cy={y(today.v)}
              r={4}
              strokeWidth={2}
              stroke={color}
              className="fill-surface-primary"
            />
          </>
        )}
        {hovered && (
          <g>
            <line
              x1={x(hovered.t)}
              x2={x(hovered.t)}
              y1={PAD.top}
              y2={PAD.top + layout.plotHeight}
              className="stroke-primary/40"
            />
            <circle
              cx={x(hovered.t)}
              cy={y(hovered.v)}
              r={4.5}
              fill={hoveredIsToday ? 'var(--surface-primary)' : color}
              stroke={hoveredIsToday ? color : 'var(--surface-primary)'}
              strokeWidth={2}
            />
          </g>
        )}
      </svg>
      {hovered && (
        <div
          className="pointer-events-none absolute top-0 z-10 rounded-md border border-divider bg-surface-primary px-2.5 py-2 shadow-popover"
          style={{
            left: Math.min(Math.max(0, x(hovered.t) - 80), width - 170),
            width: 170,
          }}
        >
          <div className="whitespace-pre-line text-label-value-12 text-secondary leading-snug">
            {hoveredIsToday && today
              ? `Today so far\n${formatRange(today.t, today.until)}`
              : formatRange(hovered.t, hovered.t + UnixTime.DAY)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 font-bold text-label-value-15 tabular-nums">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            {format(hovered.v)}
          </div>
          {reference && !hoveredIsToday && (
            <div className="mt-1 text-label-value-12 text-secondary tabular-nums">
              {reference.label} {format(valueAt(reference.points, hovered.t))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Node and the browser can disagree in the last digits of `Math.log`, and a
 * path that differs by 1e-14 fails hydration
 */
function round(value: number) {
  return Math.round(value * 100) / 100
}

/** Axis ticks are round numbers: "30", not "30.0" */
function trimTrailingZero(label: string) {
  return label.replace(/\.0(?=\D*$)/, '')
}

/** Labels of upgrades days apart would print over each other, so the later one drops a line */
function crowdsPrevious(
  markers: { t: number }[],
  index: number,
  x: (t: number) => number,
): boolean {
  const current = markers[index]
  const previous = markers[index - 1]
  if (!current || !previous) return false
  return (
    x(current.t) - x(previous.t) < 56 && !crowdsPrevious(markers, index - 1, x)
  )
}

function steppedPath(
  points: ChartPoint[],
  x: (t: number) => number,
  y: (v: number) => number,
) {
  let path = ''
  points.forEach((p, i) => {
    const prev = points[i - 1]
    if (!prev) path += `M${x(p.t)},${y(p.v)}`
    else path += `L${x(p.t)},${y(prev.v)}L${x(p.t)},${y(p.v)}`
  })
  return path
}

function valueAt(points: ChartPoint[], t: number) {
  let value = points[0]?.v ?? 0
  for (const p of points) if (p.t <= t) value = p.v
  return value
}

function getYTicks(min: number, max: number, scale: 'linear' | 'log') {
  if (scale === 'log') {
    const ticks: number[] = []
    for (
      let power = Math.ceil(Math.log10(min));
      power <= Math.floor(Math.log10(max));
      power++
    ) {
      ticks.push(10 ** power)
    }
    return ticks
  }
  const step = niceStep((max - min) / 4)
  const ticks: number[] = []
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) ticks.push(v)
  return ticks
}

function niceStep(raw: number) {
  const power = 10 ** Math.floor(Math.log10(raw || 1))
  const f = raw / power
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * power
}
