import { UnixTime } from '@l2beat/shared-pure'
import {
  areaY,
  type ChartCurve,
  type ChartDefinition,
  type ChartMark,
  type ChartScene,
  createChartRuntime,
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
import { renderChartSvg } from '@tanstack/charts/svg'
import { curveMonotoneX, curveStep, curveStepAfter } from 'd3-shape'
import { type ReactNode, useId, useMemo, useRef, useState } from 'react'
import { cn } from '~/utils/cn'
import { tooltipContentVariants } from '../tooltip/Tooltip'
import { type ChartServerSize, useChart } from './ChartContext'
import { ChartHoverOverlay } from './ChartHoverOverlay'
import { ChartDefIdPrefix, scopePaint } from './defs/chartDefId'
import { NoDataPatternDef } from './defs/NoDataPatternDef'
import { getTickCondition, getTickFormatter } from './utils/xAxisTicks'

type Value = number | null | undefined

export interface ChartSeries<K extends string, T = unknown> {
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

export interface ChartYAxis {
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
export interface ChartXAxis {
  ticks: number[]
  format: (value: number) => string
  domain?: readonly [number, number]
}

export interface ChartReferenceDot {
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

export interface ChartReferenceArea {
  x1: number
  /** The last row by default. */
  x2?: number
  fill: string
  fillOpacity?: number
}

interface Props<T, K extends string> {
  data: T[] | undefined
  series: ChartSeries<K, T>[]
  ariaLabel: string
  /** The row's position on the x axis; `row.timestamp` by default. */
  x?: (row: T) => number
  xAxis?: ChartXAxis
  yAxis?: ChartYAxis
  rightAxis?: ChartYAxis
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
  syncedUntil?: number
  referenceAreas?: ChartReferenceArea[]
  referenceDots?: ChartReferenceDot[]
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
  NonNullable<ChartSeries<string>['curve']>,
  ChartCurve | undefined
> = {
  linear: undefined,
  step: d3Curve(curveStep),
  stepAfter: d3Curve(curveStepAfter),
  monotone: d3Curve(curveMonotoneX),
}

export function TimeSeriesChart<T, K extends string>({
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
  const areas: ChartReferenceArea[] = [
    ...(lastSyncedX !== undefined
      ? [{ x1: lastSyncedX, fill: 'url(#noDataFill)' }]
      : []),
    ...(referenceAreas ?? []),
  ]

  const { serverSize } = useChart()
  const defIdPrefix = useId()
  const scoped = <P extends string | undefined>(paint: P) =>
    scopePaint(paint, defIdPrefix)

  // The hover overlay maps rows to pixels with the last rendered scales.
  const sceneRef = useRef<ChartScene | null>(null)

  // Callers pass inline props; a new definition rebuilds the whole scene, so
  // the memo keys on values and functions are read through refs. Scale
  // factories are stable imports, so they are keyed on directly.
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
    // An axis without visible series shows no ticks.
    const rightSeries = visible.filter((s) => s.axis === 'right')
    const right =
      rightAxis && rightSeries.length > 0
        ? getY(plotted, rightSeries, rightAxis)
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
              fill: scoped(s.fill),
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
              stroke: scoped(s.stroke),
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
            fill: scoped(area.fill),
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
            fill: scoped(d.fill),
            fillOpacity: d.fillOpacity,
            stroke: scoped(d.stroke),
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
          // A label centred on the left edge would be cut off.
          values: xAxis.ticks.filter((t) => t > xDomain[0]),
          format: (v: number) => axesRef.current.xAxis?.format(v) ?? String(v),
        }
      : getXTicks(rows.map((row) => xRef.current(row)))

    // Bottom: room for the x axis labels.
    const chartMargin = { top: 20, right: 1, bottom: 25, left: 0, ...margin }
    const plotHeight = (height: number) =>
      height - chartMargin.top - chartMargin.bottom

    // A function of the size, so the y ticks can fit the plot height.
    return defineChart(
      ({ height }) => {
        const leftTicks = fitTicks(left, plotHeight(height), yAxis)
        const rightTicks = right
          ? fitTicks(right, plotHeight(height), rightAxis ?? {})
          : undefined
        return {
          marks: [
            ...areaMarks,
            ...fills,
            ...strokes,
            // A mark rather than the axis grid, so it is drawn over the
            // fills.
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
        // move and searches rows linearly; ChartHoverOverlay replaces it.
        pointer: false,
        keyboard: false,
        tooltip: false,
      },
    )
  }, [plotted, optionsKey, yAxis.scale, rightAxis?.scale])

  const visibleKeys = visible.map((s) => s.key)
  return (
    <>
      {/* Chart-sized, so `userSpaceOnUse` stroke gradients span the plot. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <defs>
          <ChartDefIdPrefix.Provider value={defIdPrefix}>
            {defs}
            {lastSyncedX !== undefined && <NoDataPatternDef />}
          </ChartDefIdPrefix.Provider>
        </defs>
      </svg>
      {serverSize ? (
        <ServerChart
          definition={definition}
          ariaLabel={ariaLabel}
          size={serverSize}
        />
      ) : (
        <>
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
          <ChartHoverOverlay
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
      )}
    </>
  )
}

/**
 * The SVG the server drew, left as it is through hydration. Hydrating
 * `<Chart>` would build every chart again during hydration, including the
 * copies a breakpoint hides.
 */
function ServerChart<TDatum>({
  definition,
  ariaLabel,
  size,
}: {
  definition: ChartDefinition<TDatum, number, number>
  ariaLabel: string
  size: ChartServerSize
}) {
  const id = useId()
  // React sets the HTML whenever this object changes, so it is created once,
  // and in the browser it holds the server's SVG rather than a new drawing.
  const [html] = useState(() => ({
    __html:
      typeof window === 'undefined'
        ? renderServerSvg(definition, ariaLabel, size, id)
        : (document.getElementById(id)?.innerHTML ?? ''),
  }))
  return (
    <div
      id={id}
      className={cn(
        chartClassNames,
        '[&_line]:[vector-effect:non-scaling-stroke]',
      )}
      dangerouslySetInnerHTML={html}
    />
  )
}

function renderServerSvg<TDatum>(
  definition: ChartDefinition<TDatum, number, number>,
  ariaLabel: string,
  size: ChartServerSize,
  id: string,
) {
  const runtime = createChartRuntime()
  const scene = runtime.render(definition, size)
  const idPrefix = `ts-server-chart-${id.replaceAll(/[^a-zA-Z0-9_-]/g, '')}`
  const svg = renderChartSvg(scene, { ariaLabel, tabIndex: -1, idPrefix })
  runtime.destroy()
  return fitToBox(trimPathPrecision(svg), size)
}

/**
 * Fills any box the way the live chart will. A viewBox scales evenly, so in
 * a box of another width the chart would shrink, leave gaps above and below,
 * and jump to full height when the live chart replaced it. Instead the plot
 * stretches (its strokes keep their width) and the labels move to an
 * unscaled layer at the same relative positions.
 */
function fitToBox(svg: string, size: ChartServerSize) {
  const labelsStart = svg.lastIndexOf('<g data-ts-key="axes"')
  const end = svg.lastIndexOf('</svg>')
  if (labelsStart === -1 || end < labelsStart) return svg
  const plot = svg
    .slice(0, labelsStart)
    .replace('<svg ', '<svg preserveAspectRatio="none" ')
  const labels = svg.slice(labelsStart, end).replace(/<text [^>]*>/g, (tag) =>
    tag.replace(/ x="([\d.-]+)" y="([\d.-]+)"/, (_, x: string, y: string) => {
      const top = percent(Number(y) / size.height)
      // Y-axis labels sit a fixed distance in from their edge.
      if (tag.includes('text-anchor="start"')) return ` x="${x}" y="${top}"`
      if (tag.includes('text-anchor="end"')) {
        return ` x="100%" dx="${Number(x) - size.width}" y="${top}"`
      }
      return ` x="${percent(Number(x) / size.width)}" y="${top}"`
    }),
  )
  return `${plot}</svg><svg aria-hidden="true" width="100%" height="100%" style="position:absolute;inset:0;overflow:visible">${labels}</svg>`
}

function percent(fraction: number) {
  return `${Number((fraction * 100).toFixed(2))}%`
}

/**
 * Path coordinates come with two decimals. A tenth of a pixel is invisible,
 * and paths are most of the bytes every server-rendered chart adds to the
 * page's HTML.
 */
function trimPathPrecision(svg: string) {
  return svg.replace(/ d="[^"]*"/g, (path) => path.replace(/(\.\d)\d+/g, '$1'))
}

export function ChartTooltipWrapper({ children }: { children: ReactNode }) {
  return <div className={tooltipContentVariants()}>{children}</div>
}

/**
 * One entry per visible series, in series order. `skipNull` drops series
 * without a value at the row.
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
  visible: ChartSeries<K, T>[],
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
  getAxis: () => ChartYAxis,
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
      // Inside the plot, 8px in from its edge.
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
  series: ChartSeries<K, T>[],
  yAxis: ChartYAxis,
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
  if (min > max) return { domain: [0, 1], ticks: [] }
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
  // A domain the caller fixed keeps its bounds; the others grow to nice
  // ticks.
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
 * From the top tick down, keeps each label that clears the last one kept.
 * Ticks outside the domain are left out.
 */
function fitTicks(
  y: { domain: [number, number]; ticks: number[] },
  plotHeight: number,
  axis: ChartYAxis,
) {
  const [lo, hi] = y.domain
  const scale = (axis.scale ?? scaleLinear)()
    .domain(y.domain)
    .range([plotHeight, 0])
  const minGap = (axis.fontSize ?? 15) * 2
  const inside = y.ticks.filter((t) => t >= lo && t <= hi)
  const kept: number[] = []
  for (const tick of [...inside].reverse()) {
    const last = kept.at(-1)
    const position = scale(tick) ?? 0
    if (
      last === undefined ||
      Math.abs(position - (scale(last) ?? 0)) >= minGap
    ) {
      kept.push(tick)
    }
  }
  return kept.reverse()
}

/**
 * Ticks for a fixed domain: nice steps from `min`, then `max` itself as the
 * last tick.
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
 * `count` nice ticks: the step is the rough step rounded up to a multiple of
 * 0.05 (0.1 for steps of 1-10) of its decade, and the domain grows to fit
 * exactly `count` ticks.
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
  // Labels near the plot edges would be cut off.
  const edge = (last - first) * 0.03
  return {
    values: xs.filter((t) => isTick(t) && t > first + edge && t < last - edge),
    format: getTickFormatter(rangeInDays),
  }
}
