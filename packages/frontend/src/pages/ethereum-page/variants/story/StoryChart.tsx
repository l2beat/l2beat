import { type PointerEvent, useMemo, useState } from 'react'
import { cn } from '~/utils/cn'
import { formatRange, formatTimestamp } from '~/utils/dates'
import type { Upgrade } from '../../live/simulatedHistory'
import { DAY_SECONDS } from './facts'

export interface ChartPoint {
  t: number
  v: number
}

export interface ChartSeries {
  id: string
  label: string
  /** Complete days only, oldest first, one per day */
  points: ChartPoint[]
  /** Today's partial day: drawn hollow and dashed, never in the stats */
  today?: ChartPoint
  /** `reference` is a threshold, like a target, so it is dashed and quiet */
  tone: 'ethereum' | 'orange' | 'reference'
  /** Stepped, for limits that change at an upgrade and hold */
  step?: boolean
}

/** Percent of the width before today's mark that still hovers it */
const TODAY_TARGET = 1.5

const STROKE: Record<ChartSeries['tone'], string> = {
  ethereum: 'var(--chart-ethereum)',
  orange: 'var(--chart-orange)',
  reference: 'var(--secondary)',
}

/**
 * The story's chart: a few years of daily history, annotated where the
 * protocol changed, ending on today so far. The plot is an SVG stretched to
 * its box and everything with text is HTML placed in percent, so it renders
 * the same on the server and on any width, with nothing to measure.
 */
export function StoryChart({
  series,
  from,
  to,
  scale = 'linear',
  format,
  upgrades,
  label,
  className,
}: {
  series: ChartSeries[]
  from: number
  to: number
  scale?: 'linear' | 'log'
  format: (value: number) => string
  upgrades: Upgrade[]
  label: string
  className?: string
}) {
  const y = useMemo(() => toYScale(series, scale), [series, scale])
  const x = (t: number) => ((t - from) / (to - from)) * 100
  const [hover, setHover] = useState<number>()
  const main = series[0]
  const lastComplete = main?.points.at(-1)

  const paths = useMemo(
    () =>
      series.map((s) => ({
        id: s.id,
        tone: s.tone,
        line: toPath(s.points, s.step, from, to, y.fraction),
        area:
          s.tone !== 'reference' && series.length === 1
            ? toArea(s.points, from, to, y.fraction)
            : undefined,
      })),
    [series, from, to, y],
  )

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const fraction = (event.clientX - rect.left) / rect.width
    const t = from + fraction * (to - from)
    if (!main || !lastComplete) return
    // today is under a day wide on a three-year axis, so it gets a wider target
    if (main.today && fraction * 100 >= x(main.today.t) - TODAY_TARGET) {
      setHover(-1)
      return
    }
    const first = main.points[0]?.t ?? from
    const index = Math.round((t - first) / DAY_SECONDS - 0.5)
    setHover(Math.max(0, Math.min(main.points.length - 1, index)))
  }

  const hovered =
    hover === undefined
      ? undefined
      : hover === -1
        ? { t: main?.today?.t, today: true as const }
        : { t: main?.points[hover]?.t, today: false as const }

  return (
    <div className={cn('relative select-none', className)}>
      <UpgradeLabels upgrades={upgrades} x={x} />
      <div
        className="relative h-[220px] touch-pan-y md:h-[300px]"
        role="img"
        aria-label={label}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHover(undefined)}
      >
        {y.ticks.map((tick) => (
          <div
            key={tick}
            className="absolute inset-x-0 border-(--chart-grid) border-t"
            style={{ top: `${(1 - y.fraction(tick)) * 100}%` }}
          >
            <span className="absolute top-[-18px] left-0 z-[2] rounded-sm bg-surface-primary/85 pr-1 text-[11px] text-secondary tabular-nums">
              {format(tick)}
            </span>
          </div>
        ))}
        {upgrades.map((u) => (
          <div
            key={u.name}
            className="absolute inset-y-0 w-px bg-primary/25"
            style={{ left: `${x(u.timestamp)}%` }}
          />
        ))}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
          aria-hidden
        >
          {paths.map((p) => (
            <g key={p.id}>
              {p.area && (
                <path d={p.area} fill={STROKE[p.tone]} fillOpacity={0.09} />
              )}
              <path
                d={p.line}
                fill="none"
                stroke={STROKE[p.tone]}
                strokeWidth={p.tone === 'reference' ? 1.25 : 1.75}
                strokeDasharray={p.tone === 'reference' ? '5 4' : undefined}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
          {series.map((s) => {
            const last = s.points.at(-1)
            if (!s.today || !last) return null
            return (
              <path
                key={`${s.id}-today`}
                d={`M${x(last.t + DAY_SECONDS / 2)},${(1 - y.fraction(last.v)) * 100}L${x(s.today.t)},${(1 - y.fraction(s.today.v)) * 100}`}
                fill="none"
                stroke={STROKE[s.tone]}
                strokeWidth={1.75}
                strokeDasharray="2 3"
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </svg>
        {series.map(
          (s) =>
            s.today && (
              <TodayMark
                key={s.id}
                left={x(s.today.t)}
                top={(1 - y.fraction(s.today.v)) * 100}
                tone={s.tone}
              />
            ),
        )}
        {hovered?.t !== undefined && (
          <Crosshair
            left={x(hovered.today ? hovered.t : hovered.t + DAY_SECONDS / 2)}
            series={series}
            index={hover ?? -1}
            y={y.fraction}
            format={format}
            t={hovered.t}
            today={hovered.today}
          />
        )}
      </div>
      <TimeAxis from={from} to={to} x={x} />
    </div>
  )
}

function TodayMark({
  left,
  top,
  tone,
}: {
  left: number
  top: number
  tone: ChartSeries['tone']
}) {
  return (
    <span
      aria-hidden
      className="-translate-x-1/2 -translate-y-1/2 absolute size-[11px] rounded-full border-2 bg-surface-primary transition-[top,left] duration-700 ease-out-quint"
      style={{ left: `${left}%`, top: `${top}%`, borderColor: STROKE[tone] }}
    >
      <span className="absolute inset-[-5px] animate-ping rounded-full border border-brand/60 motion-reduce:hidden" />
    </span>
  )
}

function Crosshair({
  left,
  series,
  index,
  y,
  format,
  t,
  today,
}: {
  left: number
  series: ChartSeries[]
  index: number
  y: (v: number) => number
  format: (v: number) => string
  t: number
  today: boolean
}) {
  const rows = series.map((s) => ({
    s,
    point: today ? s.today : s.points[index],
  }))
  const flip = left > 62
  const date = today
    ? `Today so far, ${formatTimestamp(Math.floor(t / DAY_SECONDS) * DAY_SECONDS, { mode: 'time' }).replace(' UTC', '')} — ${formatTimestamp(t, { mode: 'time' })}`
    : formatRange(t, t + DAY_SECONDS).replace('\n', ' ')
  return (
    <>
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-primary/60"
        style={{ left: `${left}%` }}
      />
      {rows.map(
        ({ s, point }) =>
          point && (
            <span
              key={s.id}
              className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute size-2.5 rounded-full border-2 border-surface-primary"
              style={{
                left: `${left}%`,
                top: `${(1 - y(point.v)) * 100}%`,
                background: STROKE[s.tone],
              }}
            />
          ),
      )}
      <div
        className={cn(
          'pointer-events-none absolute top-2 z-10 min-w-44 rounded-md border border-divider bg-surface-primary px-3 py-2 shadow-popover',
          flip ? '-translate-x-full -ml-3' : 'ml-3',
        )}
        style={{ left: `${left}%` }}
      >
        <div className="mb-1.5 font-medium text-[12px] text-secondary">
          {date}
        </div>
        {rows.map(
          ({ s, point }) =>
            point && (
              <div
                key={s.id}
                className="flex items-center justify-between gap-4 text-[13px]"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-0.5 w-3 rounded-full"
                    style={{ background: STROKE[s.tone] }}
                  />
                  {s.label}
                </span>
                <span className="font-semibold tabular-nums">
                  {format(point.v)}
                </span>
              </div>
            ),
        )}
      </div>
    </>
  )
}

/**
 * Names sit on two rows: upgrades a few weeks apart, like Fusaka and its first
 * blob-parameter fork, would otherwise print over each other
 */
function UpgradeLabels({
  upgrades,
  x,
}: {
  upgrades: Upgrade[]
  x: (t: number) => number
}) {
  let lastLeft = Number.NEGATIVE_INFINITY
  let row = 0
  const placed = upgrades.map((u) => {
    const left = x(u.timestamp)
    row = left - lastLeft < 14 ? 1 - row : 0
    lastLeft = left
    return { u, left, row }
  })
  return (
    <div className="relative h-11" aria-hidden>
      {placed.map(({ u, left, row }) => (
        <div
          key={u.name}
          className={cn(
            'absolute flex h-full flex-col',
            row === 0 ? 'pt-0' : 'pt-[18px]',
          )}
          style={{ left: `${left}%` }}
        >
          <span
            className={cn(
              'whitespace-nowrap font-semibold text-[12px] leading-4',
              left > 85 ? '-translate-x-full pr-1.5' : 'pl-1.5',
            )}
          >
            {u.name}
          </span>
          <span className="w-px flex-1 bg-primary/25" />
        </div>
      ))}
    </div>
  )
}

function TimeAxis({
  from,
  to,
  x,
}: {
  from: number
  to: number
  x: (t: number) => number
}) {
  const ticks: { t: number; label: string; major: boolean }[] = []
  const start = new Date(from * 1000)
  for (
    let month = Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1);
    month / 1000 <= to;
    month = nextMonth(month)
  ) {
    const date = new Date(month)
    if (date.getUTCMonth() === 0) {
      ticks.push({
        t: month / 1000,
        label: String(date.getUTCFullYear()),
        major: true,
      })
    } else if (date.getUTCMonth() === 6) {
      ticks.push({ t: month / 1000, label: 'Jul', major: false })
    }
  }
  return (
    <div className="relative h-6 border-primary/40 border-t" aria-hidden>
      {ticks.map((tick) => (
        <span
          key={tick.t}
          className={cn(
            '-translate-x-1/2 absolute top-1.5 text-[11px] tabular-nums',
            tick.major
              ? 'font-medium text-primary'
              : 'text-secondary max-sm:hidden',
          )}
          style={{ left: `${x(tick.t)}%` }}
        >
          {tick.label}
        </span>
      ))}
    </div>
  )
}

function nextMonth(ms: number) {
  const date = new Date(ms)
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1)
}

interface YScale {
  fraction: (v: number) => number
  ticks: number[]
}

function toYScale(series: ChartSeries[], scale: 'linear' | 'log'): YScale {
  const values = series.flatMap((s) => [
    ...s.points.map((p) => p.v),
    ...(s.today ? [s.today.v] : []),
  ])
  const max = Math.max(...values, 0)
  if (scale === 'log') {
    const positive = values.filter((v) => v > 0)
    const low = 10 ** Math.floor(Math.log10(Math.min(...positive)))
    const high = 10 ** Math.ceil(Math.log10(max))
    const ticks: number[] = []
    for (let v = low; v <= high * 1.001; v *= 10) ticks.push(v)
    const span = Math.log10(high) - Math.log10(low)
    return {
      fraction: (v) => (Math.log10(Math.max(v, low)) - Math.log10(low)) / span,
      ticks: ticks.slice(1),
    }
  }
  const step = niceStep(max / 4)
  const top = Math.ceil((max * 1.05) / step) * step
  const ticks: number[] = []
  for (let v = step; v <= top + step / 2; v += step) ticks.push(v)
  return { fraction: (v) => v / top, ticks }
}

function niceStep(raw: number) {
  if (raw <= 0) return 1
  const power = 10 ** Math.floor(Math.log10(raw))
  const unit = raw / power
  const nice =
    unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 2.5 ? 2.5 : unit <= 5 ? 5 : 10
  return nice * power
}

/** A day's value is drawn at its middle, so the line meets today's mark fairly */
function toPath(
  points: ChartPoint[],
  step: boolean | undefined,
  from: number,
  to: number,
  y: (v: number) => number,
) {
  let d = ''
  let previousY: number | undefined
  for (const p of points) {
    const px = (((p.t + DAY_SECONDS / 2 - from) / (to - from)) * 100).toFixed(3)
    const py = ((1 - y(p.v)) * 100).toFixed(3)
    if (!d) d = `M${px},${py}`
    else if (step && previousY !== undefined) d += `H${px}V${py}`
    else d += `L${px},${py}`
    previousY = Number(py)
  }
  return d
}

function toArea(
  points: ChartPoint[],
  from: number,
  to: number,
  y: (v: number) => number,
) {
  const first = points[0]
  const last = points.at(-1)
  if (!first || !last) return ''
  const line = toPath(points, false, from, to, y)
  const x = (t: number) =>
    (((t + DAY_SECONDS / 2 - from) / (to - from)) * 100).toFixed(3)
  return `${line}L${x(last.t)},100L${x(first.t)},100Z`
}
