import { UnixTime } from '@l2beat/shared-pure'
import {
  areaY,
  type ChartMark,
  type ChartScene,
  defineChart,
  type InferableScaleLike,
  lineY,
  rect,
  ruleY,
} from '@tanstack/charts'
import { decorative } from '@tanstack/charts/mark/decorative'
import { Chart } from '@tanstack/charts/react'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { type ReactNode, useMemo, useRef } from 'react'
import { cn } from '~/utils/cn'
import { tooltipContentVariants } from '../../tooltip/Tooltip'
import { NoDataPatternDef } from '../defs/NoDataPatternDef'
import { getTickCondition, getTickFormatter } from '../utils/getXAxisProps'
import { TsHoverOverlay } from './TsHoverOverlay'

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
  scale?: () => InferableScaleLike<number>
  dy?: number
  fontSize?: number
  fontWeight?: number
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

const chartClassNames = cn(
  'absolute! inset-0',
  // Grid
  '[&_[data-ts-key^="y-grid"]]:stroke-primary/25 dark:[&_[data-ts-key^="y-grid"]]:stroke-primary/40',
  '[&_[data-ts-key^="y-grid"]]:[stroke-opacity:1]',
  // Tick labels
  '[&_text[data-ts-key^="x-tick-label"]]:fill-secondary [&_text[data-ts-key^="x-tick-label"]]:[fill-opacity:1]',
  '[&_text[data-ts-key^="y-tick-label"]]:fill-primary/50 [&_text[data-ts-key^="y-tick-label"]]:[fill-opacity:1] dark:[&_text[data-ts-key^="y-tick-label"]]:fill-primary/70',
  '[&_svg]:outline-none',
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
  const visibleKey = visible.map((s) => `${s.key}:${s.stroke}:${s.fill}`).join()

  const lastSyncedTimestamp =
    syncedUntil !== undefined
      ? rows.findLast((d) => d.timestamp <= syncedUntil)?.timestamp
      : undefined

  // The hover overlay maps rows to pixels with the last rendered scales.
  const sceneRef = useRef<ChartScene | null>(null)

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
    for (const s of visible) {
      if (s.stroke) {
        marks.push(
          decorative(
            lineY(rows, {
              id: `${s.key}-stroke`,
              x,
              y: y(s.key),
              stroke: s.stroke,
              strokeWidth: SERIES_STROKE_WIDTH,
            }),
          ),
        )
      }
    }

    const notSynced =
      lastSyncedTimestamp !== undefined && rows.length > 0
        ? [
            decorative(
              // A rect without y endpoints is skipped, so it spans the y domain.
              rect(
                [
                  {
                    x1: lastSyncedTimestamp,
                    x2: rows.at(-1)?.timestamp,
                    y1: yDomain[0],
                    y2: yDomain[1],
                  },
                ],
                {
                  id: 'not-synced',
                  x1: 'x1',
                  x2: 'x2',
                  y1: 'y1',
                  y2: 'y2',
                  fill: 'url(#noDataFill)',
                  key: () => 'not-synced',
                },
              ),
            ),
          ]
        : []

    const xTicks = getXTicks(rows)
    // Bottom: where a Recharts x-axis puts the plot's bottom edge.
    const chartMargin = { top: 20, right: 1, bottom: 25, left: 0, ...margin }
    const yFontSize = yAxis.fontSize ?? 15
    // A function of the size, so the y ticks can fit the plot height.
    return defineChart(
      ({ height }) => {
        const yTicksShown = fitTicks(
          yTicks,
          height - chartMargin.top - chartMargin.bottom,
          yFontSize,
        )
        return {
          marks: [
            ...notSynced,
            ...marks,
            // A mark rather than the axis grid, so it is drawn over the
            // fills, as Recharts draws its grid.
            decorative(ruleY(yTicksShown, { id: 'y-grid', y: (v) => v })),
          ],
          // Scale instances, not factories: a factory's domain is inferred
          // from the marks, which would drop the tick-aligned y domain.
          scales: {
            x: {
              scale: scaleLinear().domain([
                rows[0]?.timestamp ?? 0,
                rows.at(-1)?.timestamp ?? 1,
              ]),
              axis: {
                line: false,
                ticks: {
                  values: xTicks.values,
                  size: 0,
                  format: xTicks.format,
                },
                tickLabels: { fontSize: 10, fontWeight: 500 },
              },
            },
            y: {
              scale: (yAxis.scale ?? scaleLinear)().domain(yDomain),
              axis: {
                line: false,
                ticks: {
                  values: yTicksShown,
                  size: 0,
                  padding: 0,
                  format: (value: number) => {
                    const { format, unit = '' } = yAxisRef.current
                    return `${format ? format(value) : value}${unit}`
                  },
                },
                // Where Recharts' mirrored axis puts them: 8px in from the edge.
                tickLabels: {
                  anchor: 'start',
                  dx: 8,
                  dy: yAxis.dy ?? -10,
                  fontSize: yFontSize,
                  fontWeight: yAxis.fontWeight,
                  thin: false,
                },
              },
            },
          },
          margin: chartMargin,
          clip: true,
        }
      },
      {
        // The library's hover host restyles the whole chart on every pointer
        // move and searches rows linearly; TsHoverOverlay replaces it.
        pointer: false,
        keyboard: false,
        tooltip: false,
      },
    )
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
      {/* Chart-sized, so `userSpaceOnUse` stroke gradients span the plot. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
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
        tabIndex={-1}
        onRender={({ scene }) => {
          sceneRef.current = scene
        }}
      />
      <TsHoverOverlay
        rows={rows}
        keys={visible.map((s) => s.key)}
        sceneRef={sceneRef}
        ariaLabel={ariaLabel}
        renderTooltip={(row) =>
          renderTooltip(
            row,
            visible.map((s) => s.key),
          )
        }
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
      ticks: [...(scale.ticks?.(Y_TICK_COUNT) ?? [lo, hi])],
    }
  }
  // Like Recharts: a domain the caller fixed keeps its bounds, the others
  // grow to nice ticks.
  if (typeof domain === 'function') {
    return {
      domain: [lo, hi],
      ticks: getFixedDomainTicks(lo, hi, Y_TICK_COUNT),
    }
  }
  const ticks = getNiceTicks(lo, hi, Y_TICK_COUNT)
  return { domain: [ticks[0] ?? lo, ticks.at(-1) ?? hi], ticks }
}

/**
 * Like Recharts, drops the ticks between the ends (labels and grid lines)
 * when their labels would touch.
 */
function fitTicks(ticks: number[], plotHeight: number, fontSize: number) {
  if (ticks.length <= 2) return ticks
  const gap = plotHeight / (ticks.length - 1)
  if (gap >= fontSize * 2) return ticks
  return [ticks[0], ticks.at(-1)].filter((tick) => tick !== undefined)
}

/**
 * Recharts' getTickValuesFixedDomain: nice steps from `min`, then `max`
 * itself as the last tick.
 */
function getFixedDomainTicks(min: number, max: number, count: number) {
  if (max <= min) return [min]
  const step = getNiceStep((max - min) / (count - 1))
  const ticks: number[] = []
  for (let tick = min; tick < max - step * 1e-9; tick += step) {
    ticks.push(round(tick))
  }
  ticks.push(max)
  return ticks
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
