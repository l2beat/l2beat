import { UnixTime } from '@l2beat/shared-pure'
import {
  areaY,
  type ChartCurve,
  type ChartMark,
  type ChartScene,
  defineChart,
  dot,
  type InferableScaleLike,
  lineY,
  rect,
  ruleY,
  text,
} from '@tanstack/charts'
import { d3Curve } from '@tanstack/charts/d3/shape'
import { decorative } from '@tanstack/charts/mark/decorative'
import { Chart } from '@tanstack/charts/react'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { curveMonotoneX, curveStep, curveStepAfter } from 'd3-shape'
import { type ReactNode, useMemo, useRef } from 'react'
import { cn } from '~/utils/cn'
import { tooltipContentVariants } from '../../tooltip/Tooltip'
import { NoDataPatternDef } from '../defs/NoDataPatternDef'
import { getTickCondition, getTickFormatter } from '../utils/getXAxisProps'
import { TsHoverOverlay } from './TsHoverOverlay'

type Value = number | null | undefined

export interface TsSeries<K extends string, T = unknown> {
  key: K
  /** Plotted value; `row[key]` by default. The top edge of a band. */
  value?: (row: T) => Value
  /** The bottom edge, for a band between two values. */
  value0?: (row: T) => Value
  /** Line paint; omit for a fill-only area. */
  stroke?: string
  strokeWidth?: number
  strokeOpacity?: number
  strokeDasharray?: string
  /** Area paint; omit for a line without fill. */
  fill?: string
  fillOpacity?: number
  curve?: 'linear' | 'step' | 'stepAfter' | 'monotone'
  /** Draw across missing values instead of leaving a gap. */
  connectNulls?: boolean
  /** Stacked series sit on the ones declared before them. */
  stack?: boolean
  axis?: 'right'
  /** Marks the hovered row; true by default. */
  activeDot?: boolean
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
  /** Fixed ticks instead of computed ones. */
  ticks?: number[]
  tickCount?: number
  /** Whole-number ticks only. */
  integer?: boolean
  dy?: number
  fontSize?: number
  fontWeight?: number
}

/** A numeric x axis instead of the time axis. */
export interface TsXAxis {
  ticks: number[]
  format: (value: number) => string
  domain?: readonly [number, number]
}

export interface TsReferenceDot {
  x: number
  y: number
  axis?: 'right'
  r: number
  fill?: string
  fillOpacity?: number
  stroke?: string
  strokeWidth?: number
  label?: {
    text: string
    position: 'top' | 'bottom'
    offset?: number
    fill?: string
    fontSize?: number
    fontWeight?: number
  }
}

export interface TsReferenceArea {
  x1: number
  /** The last row by default. */
  x2?: number
  fill: string
  fillOpacity?: number
}

interface Props<T, K extends string> {
  data: T[] | undefined
  series: TsSeries<K, T>[]
  ariaLabel: string
  /** The row's position on the x axis; `row.timestamp` by default. */
  x?: (row: T) => number
  xAxis?: TsXAxis
  yAxis?: TsYAxis
  rightAxis?: TsYAxis
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
  syncedUntil?: number
  referenceAreas?: TsReferenceArea[]
  referenceDots?: TsReferenceDot[]
  /** Charts with the same id show their hover together, by x value. */
  syncId?: string
  /** Gradient defs referenced by `url(#id)` paints in `series`. */
  defs?: ReactNode
  renderTooltip: (row: T, visibleKeys: K[]) => ReactNode
}

const SERIES_STROKE_WIDTH = 1.75
const Y_SCALE = 'y'
// Its tick labels' keys contain "y-tick-label", which the styles match.
const RIGHT_SCALE = 'right-y'

const chartClassNames = cn(
  'absolute! inset-0',
  // Grid
  '[&_[data-ts-key^="y-grid"]]:stroke-primary/25 dark:[&_[data-ts-key^="y-grid"]]:stroke-primary/40',
  '[&_[data-ts-key^="y-grid"]]:[stroke-opacity:1]',
  // Tick labels
  '[&_text[data-ts-key^="x-tick-label"]]:fill-secondary [&_text[data-ts-key^="x-tick-label"]]:[fill-opacity:1]',
  '[&_text[data-ts-key*="y-tick-label"]]:fill-primary/50 [&_text[data-ts-key*="y-tick-label"]]:[fill-opacity:1] dark:[&_text[data-ts-key*="y-tick-label"]]:fill-primary/70',
  '[&_svg]:outline-none',
)

const CURVES: Record<
  NonNullable<TsSeries<string>['curve']>,
  ChartCurve | undefined
> = {
  linear: undefined,
  step: d3Curve(curveStep),
  stepAfter: d3Curve(curveStepAfter),
  monotone: d3Curve(curveMonotoneX),
}

export function TsTimeSeriesChart<T, K extends string>({
  data,
  series,
  ariaLabel,
  x = getTimestamp,
  xAxis,
  yAxis = {},
  rightAxis,
  margin,
  syncedUntil,
  referenceAreas,
  referenceDots,
  syncId,
  defs,
  renderTooltip,
}: Props<T, K>) {
  const rows = data ?? EMPTY
  const visible = series.filter((s) => !s.hidden)
  const plotted = usePlotted(rows, visible)

  const lastSyncedX =
    syncedUntil !== undefined
      ? (() => {
          const row = rows.findLast((d) => x(d) <= syncedUntil)
          return row !== undefined ? x(row) : undefined
        })()
      : undefined
  const areas: TsReferenceArea[] = [
    ...(lastSyncedX !== undefined
      ? [{ x1: lastSyncedX, fill: 'url(#noDataFill)' }]
      : []),
    ...(referenceAreas ?? []),
  ]

  // The hover overlay maps rows to pixels with the last rendered scales.
  const sceneRef = useRef<ChartScene | null>(null)

  // Callers pass inline props; a new definition rebuilds the whole scene, so
  // the memo keys on values and functions are read through refs.
  const axesRef = useRef({ yAxis, rightAxis, xAxis })
  axesRef.current = { yAxis, rightAxis, xAxis }
  const xRef = useRef(x)
  xRef.current = x
  const optionsKey = JSON.stringify([
    visible.map(({ value, value0, ...s }) => s),
    yAxis,
    rightAxis,
    xAxis?.ticks,
    xAxis?.domain,
    margin,
    areas,
    referenceDots,
    describeFn(yAxis.domain),
    describeFn(rightAxis?.domain),
  ])

  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on values, see above
  const definition = useMemo(() => {
    const getX = (point: Plotted<T>) => xRef.current(point.row)
    const left = getY(
      plotted,
      visible.filter((s) => s.axis !== 'right'),
      yAxis,
    )
    const right = rightAxis
      ? getY(
          plotted,
          visible.filter((s) => s.axis === 'right'),
          rightAxis,
        )
      : undefined

    const scaleOf = (s: { axis?: 'right' }) =>
      s.axis === 'right' && right ? RIGHT_SCALE : Y_SCALE
    const baseOf = (s: { axis?: 'right' }) =>
      (s.axis === 'right' && right ? right : left).domain[0]

    type Mark = ChartMark<
      Plotted<T>,
      number,
      number,
      number,
      number,
      'x',
      string
    >
    const fills: Mark[] = []
    const strokes: Mark[] = []
    for (const s of visible) {
      const source = s.connectNulls
        ? plotted.filter((p) => p.top[s.key] !== null)
        : plotted
      const top = (p: Plotted<T>) => p.top[s.key] ?? null
      const curve = s.curve ? CURVES[s.curve] : undefined
      if (s.fill) {
        const base = baseOf(s)
        fills.push(
          decorative(
            areaY(source, {
              id: `${s.key}-fill`,
              x: getX,
              y1: (p) =>
                p.top[s.key] === null ? null : (p.bottom[s.key] ?? base),
              y2: top,
              fill: s.fill,
              fillOpacity: s.fillOpacity ?? 1,
              curve,
              yScale: scaleOf(s),
            }),
          ),
        )
      }
      if (s.stroke) {
        strokes.push(
          decorative(
            lineY(source, {
              id: `${s.key}-stroke`,
              x: getX,
              y: top,
              stroke: s.stroke,
              strokeWidth: s.strokeWidth ?? SERIES_STROKE_WIDTH,
              strokeOpacity: s.strokeOpacity,
              strokeDasharray: s.strokeDasharray,
              curve,
              yScale: scaleOf(s),
            }),
          ),
        )
      }
    }

    const lastX = rows.length > 0 ? xRef.current(rows.at(-1) as T) : 0
    const areaMarks = areas.map((area, i) =>
      decorative(
        // A rect without y endpoints is skipped, so it spans the y domain.
        rect(
          [
            {
              x1: area.x1,
              x2: area.x2 ?? lastX,
              y1: left.domain[0],
              y2: left.domain[1],
            },
          ],
          {
            id: `reference-area-${i}`,
            x1: 'x1',
            x2: 'x2',
            y1: 'y1',
            y2: 'y2',
            fill: area.fill,
            fillOpacity: area.fillOpacity,
            key: () => `reference-area-${i}`,
          },
        ),
      ),
    )

    const dotMarks = (referenceDots ?? []).flatMap((d, i) => {
      const yScale = scaleOf(d)
      const marks = [
        decorative(
          dot([d], {
            id: `reference-dot-${i}`,
            x: 'x',
            y: 'y',
            r: d.r,
            fill: d.fill,
            fillOpacity: d.fillOpacity,
            stroke: d.stroke,
            strokeWidth: d.strokeWidth,
            yScale,
          }),
        ),
      ]
      if (d.label) {
        const { position, offset = 8 } = d.label
        marks.push(
          decorative(
            text([d], {
              id: `reference-dot-label-${i}`,
              x: 'x',
              y: 'y',
              text: () => d.label?.text,
              fill: d.label.fill ?? 'var(--primary)',
              fontSize: d.label.fontSize ?? 11,
              fontWeight: d.label.fontWeight ?? 500,
              anchor: 'middle',
              dy: position === 'top' ? -(d.r + offset) : d.r + offset + 8,
              yScale,
            }),
          ),
        )
      }
      return marks
    })

    const xDomain = xAxis?.domain ?? [
      rows.length > 0 ? xRef.current(rows[0] as T) : 0,
      rows.length > 0 ? lastX : 1,
    ]
    const xTicks = xAxis
      ? {
          values: xAxis.ticks,
          format: (v: number) => axesRef.current.xAxis?.format(v) ?? String(v),
        }
      : getXTicks(rows.map((row) => xRef.current(row)))

    // Bottom: where a Recharts x-axis puts the plot's bottom edge.
    const chartMargin = { top: 20, right: 1, bottom: 25, left: 0, ...margin }
    const plotHeight = (height: number) =>
      height - chartMargin.top - chartMargin.bottom

    // A function of the size, so the y ticks can fit the plot height.
    return defineChart(
      ({ height }) => {
        const leftTicks = fitTicks(
          left.ticks,
          plotHeight(height),
          yAxis.fontSize ?? 15,
        )
        const rightTicks = right
          ? fitTicks(right.ticks, plotHeight(height), rightAxis?.fontSize ?? 15)
          : undefined
        return {
          marks: [
            ...areaMarks,
            ...fills,
            ...strokes,
            // A mark rather than the axis grid, so it is drawn over the
            // fills, as Recharts draws its grid.
            decorative(ruleY(leftTicks, { id: 'y-grid', y: (v) => v })),
            ...dotMarks,
          ],
          // Scale instances, not factories: a factory's domain is inferred
          // from the marks, which would drop the tick-aligned y domain.
          scales: {
            x: {
              scale: scaleLinear().domain(xDomain),
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
            [Y_SCALE]: yScaleOptions(
              left,
              leftTicks,
              'left',
              () => axesRef.current.yAxis,
            ),
            ...(right && rightTicks
              ? {
                  [RIGHT_SCALE]: {
                    channel: 'y' as const,
                    side: 'right' as const,
                    ...yScaleOptions(
                      right,
                      rightTicks,
                      'right',
                      () => axesRef.current.rightAxis ?? {},
                    ),
                  },
                }
              : {}),
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
  }, [plotted, optionsKey])

  const visibleKeys = visible.map((s) => s.key)
  return (
    <>
      {/* Chart-sized, so `userSpaceOnUse` stroke gradients span the plot. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <defs>
          {defs}
          {lastSyncedX !== undefined && <NoDataPatternDef />}
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
        x={x}
        dots={visible
          .filter((s) => s.activeDot !== false)
          .map((s) => ({
            key: s.key,
            value: (_row: T, index: number) => plotted[index]?.top[s.key],
            scale: s.axis === 'right' && rightAxis ? RIGHT_SCALE : Y_SCALE,
          }))}
        sceneRef={sceneRef}
        ariaLabel={ariaLabel}
        syncId={syncId}
        renderTooltip={(row) => renderTooltip(row, visibleKeys)}
      />
    </>
  )
}

export function TsChartTooltipWrapper({ children }: { children: ReactNode }) {
  return <div className={tooltipContentVariants()}>{children}</div>
}

/**
 * One entry per visible series, in series order, like the payload Recharts
 * gave tooltips. `skipNull` drops series without a value at the row, as
 * Recharts' default `filterNull` did.
 */
export function getTooltipEntries<T, K extends string>(
  row: T,
  keys: readonly K[],
  { skipNull = false }: { skipNull?: boolean } = {},
): { name: K; value: number | null }[] {
  return keys.flatMap((name) => {
    const value = toNumber((row as Record<string, unknown>)[name])
    return skipNull && value === null ? [] : [{ name, value }]
  })
}

/** A row with each visible series' plotted edges, stacking applied. */
interface Plotted<T> {
  row: T
  top: Record<string, number | null>
  bottom: Record<string, number | null>
}

function usePlotted<T, K extends string>(
  rows: T[],
  visible: TsSeries<K, T>[],
): Plotted<T>[] {
  const key = visible
    .map((s) => `${s.key}:${s.stack ? 's' : ''}:${s.axis ?? ''}`)
    .join()
  const accessorsRef = useRef(visible)
  accessorsRef.current = visible
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the series shape
  return useMemo(() => {
    const series = accessorsRef.current
    return rows.map((row) => {
      const top: Record<string, number | null> = {}
      const bottom: Record<string, number | null> = {}
      const stackTop: Record<string, number> = {}
      for (const s of series) {
        const raw = toNumber(
          s.value ? s.value(row) : (row as Record<string, unknown>)[s.key],
        )
        if (s.stack) {
          const axis = s.axis ?? 'left'
          const below = stackTop[axis] ?? 0
          stackTop[axis] = below + (raw ?? 0)
          top[s.key] = raw === null ? null : below + raw
          bottom[s.key] = raw === null ? null : below
        } else {
          top[s.key] = raw
          bottom[s.key] = s.value0 ? toNumber(s.value0(row)) : null
        }
      }
      return { row, top, bottom }
    })
  }, [rows, key])
}

function toNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function getTimestamp<T>(row: T) {
  return (row as { timestamp: number }).timestamp
}

function describeFn(value: unknown) {
  return typeof value === 'function' ? value.toString() : undefined
}

function yScaleOptions(
  y: { domain: [number, number] },
  ticks: number[],
  side: 'left' | 'right',
  getAxis: () => TsYAxis,
) {
  const axis = getAxis()
  return {
    scale: (axis.scale ?? scaleLinear)().domain(y.domain),
    axis: {
      line: false,
      ticks: {
        values: ticks,
        size: 0,
        padding: 0,
        format: (value: number) => {
          const { format, unit = '' } = getAxis()
          return `${format ? format(value) : value}${unit}`
        },
      },
      // Where Recharts' mirrored axis puts them: 8px in from the edge.
      tickLabels: {
        anchor: side === 'left' ? ('start' as const) : ('end' as const),
        dx: side === 'left' ? 8 : -8,
        dy: axis.dy ?? -10,
        fontSize: axis.fontSize ?? 15,
        fontWeight: axis.fontWeight,
        thin: false,
      },
    },
  }
}

const EMPTY: never[] = []

const Y_TICK_COUNT = 3

function getY<T, K extends string>(
  plotted: Plotted<T>[],
  series: TsSeries<K, T>[],
  yAxis: TsYAxis,
): { domain: [number, number]; ticks: number[] } {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const point of plotted) {
    for (const s of series) {
      for (const value of [point.top[s.key], point.bottom[s.key]]) {
        if (value === null || value === undefined) continue
        if (value < min) min = value
        if (value > max) max = value
      }
    }
  }
  if (min > max) return { domain: [0, 1], ticks: yAxis.ticks ?? [0, 1] }
  const count = yAxis.tickCount ?? Y_TICK_COUNT
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
      ticks: yAxis.ticks ?? [...(scale.ticks?.(count) ?? [lo, hi])],
    }
  }
  // Like Recharts: a domain the caller fixed keeps its bounds, the others
  // grow to nice ticks.
  if (typeof domain === 'function') {
    return {
      domain: [lo, hi],
      ticks: yAxis.ticks ?? getFixedDomainTicks(lo, hi, count, yAxis.integer),
    }
  }
  const ticks = yAxis.ticks ?? getNiceTicks(lo, hi, count, yAxis.integer)
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
function getFixedDomainTicks(
  min: number,
  max: number,
  count: number,
  integer?: boolean,
) {
  if (max <= min) return [min]
  const step = getNiceStep((max - min) / (count - 1), integer)
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
function getNiceTicks(
  min: number,
  max: number,
  count: number,
  integer?: boolean,
): number[] {
  if (max <= min) return [min, min + 1]
  let step = getNiceStep((max - min) / (count - 1), integer)
  for (let i = 0; i < 10; i++) {
    const start = Math.floor(min / step) * step
    if (start + step * (count - 1) >= max - step * 1e-9) {
      return Array.from({ length: count }, (_, j) => round(start + j * step))
    }
    step = getNiceStep(step * 1.05, integer)
  }
  return [min, max]
}

function getNiceStep(roughStep: number, integer?: boolean) {
  const digitCount = Math.floor(Math.log10(roughStep)) + 1
  const decade = 10 ** digitCount
  const scale = digitCount !== 1 ? 0.05 : 0.1
  const step = Math.ceil(roughStep / decade / scale - 1e-9) * scale * decade
  // Recharts' allowDecimals={false}.
  return integer ? Math.max(1, Math.ceil(step)) : step
}

function round(value: number) {
  return Number.parseFloat(value.toPrecision(12))
}

function getXTicks(xs: number[]) {
  const first = xs[0]
  const last = xs.at(-1)
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
    values: xs.filter((t) => isTick(t) && t > first + edge && t < last - edge),
    format: getTickFormatter(rangeInDays),
  }
}
