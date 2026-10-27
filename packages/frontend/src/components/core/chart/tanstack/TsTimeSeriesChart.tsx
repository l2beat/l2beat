import { UnixTime } from '@l2beat/shared-pure'
import {
  areaY,
  type ChartMark,
  crosshair,
  defineChart,
  lineY,
  rect,
} from '@tanstack/charts'
import { focusGuideX } from '@tanstack/charts/focus/guide'
import { decorative } from '@tanstack/charts/mark/decorative'
import { Chart } from '@tanstack/charts/react/tooltip'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { tooltip } from '@tanstack/charts/tooltip'
import { portal } from '@tanstack/charts/tooltip/portal'
import { type ReactNode, useMemo, useRef } from 'react'
import { cn } from '~/utils/cn'
import { tooltipContentVariants } from '../../tooltip/Tooltip'
import { NoDataPatternDef } from '../defs/NoDataPatternDef'
import { getTickCondition, getTickFormatter } from '../utils/getXAxisProps'

export interface TsSeries<K extends string> {
  key: K
  /** Line paint; omit for a fill-only area. */
  stroke?: string
  /** Area paint; omit for a line without fill. */
  fill?: string
  hidden?: boolean
}

type YDomain =
  | 'zero'
  | 'auto'
  | ((min: number, max: number) => readonly [number, number])

export interface TsYAxis {
  format?: (value: number) => string
  unit?: string
  domain?: YDomain
  /** Compact linear by default; pass e.g. d3's `scaleSymlog`. */
  scale?: () => ContinuousScale
  dy?: number
  fontSize?: number
  fontWeight?: number
}

interface ContinuousScale {
  domain(domain: readonly number[]): ContinuousScale
  domain(): number[]
  ticks(count?: number): number[]
}

interface Props<T extends { timestamp: number }, K extends keyof T & string> {
  data: T[] | undefined
  series: TsSeries<K>[]
  ariaLabel: string
  yAxis?: TsYAxis
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
  syncedUntil?: number
  /** Gradient defs referenced by `url(#id)` paints in `series`. */
  defs?: ReactNode
  renderTooltip: (row: T, visibleKeys: K[]) => ReactNode
}

const SERIES_STROKE_WIDTH = 1.75
const ACTIVE_DOT_RADIUS = 3

const chartClassNames = cn(
  'absolute! inset-0',
  // Grid
  '[&_[data-ts-key^="y-grid"]]:stroke-primary/25 dark:[&_[data-ts-key^="y-grid"]]:stroke-primary/40',
  '[&_[data-ts-key^="y-grid"]]:[stroke-opacity:1]',
  // Tick labels
  '[&_text[data-ts-key^="x-tick-label"]]:fill-secondary [&_text[data-ts-key^="x-tick-label"]]:[fill-opacity:1]',
  '[&_text[data-ts-key^="y-tick-label"]]:fill-primary/50 [&_text[data-ts-key^="y-tick-label"]]:[fill-opacity:1] dark:[&_text[data-ts-key^="y-tick-label"]]:fill-primary/70',
  '[&_svg]:outline-none',
  // The surface scrolls overflow, which clips our tooltip's shadow.
  '[&_.ts-chart-tooltip]:overflow-visible!',
)

export function TsTimeSeriesChart<
  T extends { timestamp: number },
  K extends keyof T & string,
>({
  data,
  series,
  ariaLabel,
  yAxis = {},
  margin,
  syncedUntil,
  defs,
  renderTooltip,
}: Props<T, K>) {
  const rows = data ?? EMPTY
  const visible = series.filter((s) => !s.hidden)
  const visibleKey = visible.map((s) => s.key).join()

  const lastSyncedTimestamp =
    syncedUntil !== undefined
      ? rows.findLast((d) => d.timestamp <= syncedUntil)?.timestamp
      : undefined

  // Callers pass inline props; a new definition rebuilds the whole scene, so
  // the memo keys on values and formatters are read through a ref.
  const yAxisRef = useRef(yAxis)
  yAxisRef.current = yAxis
  const marginKey = JSON.stringify(margin)
  const domainKey =
    typeof yAxis.domain === 'function' ? yAxis.domain.toString() : yAxis.domain

  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on values, see above
  const definition = useMemo(() => {
    const { domain: yDomain, ticks: yTicks } = getY(rows, visible, yAxis)
    const base = yDomain[0]
    const y = (key: K) => (row: T) => row[key] as number | null
    const x = (row: T) => row.timestamp

    const marks: ChartMark<T, number, number>[] = []
    for (const s of visible) {
      if (s.fill) {
        marks.push(
          decorative(
            areaY(rows, {
              id: `${s.key}-fill`,
              x,
              y1: base,
              y2: y(s.key),
              fill: s.fill,
              fillOpacity: 1,
            }),
          ),
        )
      }
    }
    // The lines carry focus: interaction points cost no DOM nodes, unlike
    // a dot mark, which paints a circle per row even at radius 0.
    for (const s of visible) {
      if (s.stroke) {
        marks.push(
          lineY(rows, {
            id: `${s.key}-stroke`,
            x,
            y: y(s.key),
            stroke: s.stroke,
            strokeWidth: SERIES_STROKE_WIDTH,
            key: (row) => row.timestamp,
          }),
        )
      }
    }
    // Focus guides paint a marker only at the focused x.
    for (const s of visible) {
      marks.push(
        focusGuideX(rows, {
          id: `${s.key}-active`,
          x,
          y: y(s.key),
          key: (row) => row.timestamp,
          match: 'x',
          xRule: false,
          marker: { radius: ACTIVE_DOT_RADIUS, fill: 'var(--primary)' },
        }),
      )
    }

    const notSynced = []
    if (lastSyncedTimestamp !== undefined && rows.length > 0) {
      notSynced.push(
        decorative(
          rect([{ x1: lastSyncedTimestamp, x2: rows.at(-1)?.timestamp }], {
            id: 'not-synced',
            x1: 'x1',
            x2: 'x2',
            fill: 'url(#noDataFill)',
            key: () => 'not-synced',
          }),
        ),
      )
    }

    const xTicks = getXTicks(rows)
    return defineChart({
      marks: [
        ...notSynced,
        ...marks,
        crosshair({
          x: { stroke: 'var(--primary)', strokeWidth: 2, strokeOpacity: 1 },
          y: false,
        }),
      ],
      scales: {
        x: {
          scale: () =>
            scaleLinear().domain([
              rows[0]?.timestamp ?? 0,
              rows.at(-1)?.timestamp ?? 1,
            ]),
          axis: {
            line: false,
            ticks: { values: xTicks.values, size: 0, format: xTicks.format },
            tickLabels: { fontSize: 10, fontWeight: 500 },
          },
        },
        y: {
          scale: () => (yAxis.scale ?? scaleLinear)().domain(yDomain),
          grid: true,
          axis: {
            line: false,
            ticks: {
              values: yTicks,
              size: 0,
              padding: 0,
              format: (value: number) => {
                const { format, unit = '' } = yAxisRef.current
                return `${format ? format(value) : value}${unit}`
              },
            },
            tickLabels: {
              anchor: 'start',
              dy: yAxis.dy ?? -10,
              fontSize: yAxis.fontSize ?? 15,
              fontWeight: yAxis.fontWeight,
              thin: false,
            },
          },
        },
      },
      margin: { top: 20, right: 1, left: 0, ...margin },
      clip: true,
      focus: 'group-x',
      maxFocusDistance: Number.POSITIVE_INFINITY,
      focusRing: false,
      tooltip: {
        use: tooltip,
        portal,
        className: 'ts-chart-tooltip',
        anchor: 'pointer',
        placement: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
        offset: 16,
        sticky: false,
        motion: false,
      },
    })
  }, [
    rows,
    visibleKey,
    lastSyncedTimestamp,
    domainKey,
    yAxis.scale,
    yAxis.dy,
    yAxis.fontSize,
    yAxis.fontWeight,
    marginKey,
  ])

  return (
    <>
      <svg aria-hidden className="absolute size-0">
        <defs>
          {defs}
          {lastSyncedTimestamp !== undefined && <NoDataPatternDef />}
        </defs>
      </svg>
      <Chart
        definition={definition}
        ariaLabel={ariaLabel}
        className={chartClassNames}
        style={{ width: 'auto', height: 'auto' }}
        renderTooltipBody={({ points }) => {
          // Only the series lines are focusable, so the datum is a row.
          const row = points[0]?.datum as T | undefined
          if (!row) return null
          return renderTooltip(
            row,
            visible.map((s) => s.key),
          )
        }}
      />
    </>
  )
}

export function TsChartTooltipWrapper({ children }: { children: ReactNode }) {
  return <div className={tooltipContentVariants()}>{children}</div>
}

const EMPTY: never[] = []

const Y_TICK_COUNT = 3

function getY<T, K extends keyof T & string>(
  rows: T[],
  visible: TsSeries<K>[],
  yAxis: TsYAxis,
): { domain: [number, number]; ticks: number[] } {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const row of rows) {
    for (const s of visible) {
      const value = row[s.key]
      if (typeof value !== 'number' || !Number.isFinite(value)) continue
      if (value < min) min = value
      if (value > max) max = value
    }
  }
  if (min > max) return { domain: [0, 1], ticks: [0, 1] }
  const domain = yAxis.domain ?? 'zero'
  const [lo, hi] =
    typeof domain === 'function'
      ? domain(min, max)
      : domain === 'auto'
        ? [min, max]
        : [Math.min(0, min), max]
  if (yAxis.scale) {
    const scale = yAxis.scale().domain([lo, hi])
    return {
      domain: scale.domain() as [number, number],
      ticks: scale.ticks(Y_TICK_COUNT),
    }
  }
  const ticks = getNiceTicks(lo, hi, Y_TICK_COUNT)
  return { domain: [ticks[0] ?? lo, ticks.at(-1) ?? hi], ticks }
}

/**
 * Recharts' fixed-count tick algorithm (getNiceTickValues): the step is the
 * rough step rounded up to a multiple of 0.05 (0.1 for steps of 1-10) of its
 * decade, and the domain grows to fit exactly `count` ticks.
 */
function getNiceTicks(min: number, max: number, count: number): number[] {
  if (max <= min) return [min, min + 1]
  let step = getNiceStep((max - min) / (count - 1))
  for (let i = 0; i < 10; i++) {
    const start = Math.floor(min / step) * step
    if (start + step * (count - 1) >= max - step * 1e-9) {
      return Array.from({ length: count }, (_, j) => round(start + j * step))
    }
    step = getNiceStep(step * 1.05)
  }
  return [min, max]
}

function getNiceStep(roughStep: number) {
  const digitCount = Math.floor(Math.log10(roughStep)) + 1
  const decade = 10 ** digitCount
  const scale = digitCount !== 1 ? 0.05 : 0.1
  return Math.ceil(roughStep / decade / scale - 1e-9) * scale * decade
}

function round(value: number) {
  return Number.parseFloat(value.toPrecision(12))
}

function getXTicks<T extends { timestamp: number }>(rows: T[]) {
  const first = rows[0]?.timestamp
  const last = rows.at(-1)?.timestamp
  if (first === undefined || last === undefined) {
    return { values: [], format: String }
  }
  const rangeInDays =
    (UnixTime.toStartOf(UnixTime(last), 'day') -
      UnixTime.toStartOf(UnixTime(first), 'day')) /
    UnixTime.DAY
  const isTick = getTickCondition(rangeInDays)
  // Recharts hides labels that would overflow the plot edges.
  const edge = (last - first) * 0.03
  return {
    values: rows
      .map((row) => row.timestamp)
      .filter((t) => isTick(t) && t > first + edge && t < last - edge),
    format: getTickFormatter(rangeInDays),
  }
}
