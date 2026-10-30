import {
  areaY,
  type ChartCurve,
  type ChartMark,
  defineChart,
  dot,
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
import { type ReactNode, useId, useMemo, useRef, useState } from 'react'
import { cn } from '~/utils/cn'
import { useChart } from './ChartContext'
import { ChartHoverOverlay, ChartSceneStore } from './ChartHoverOverlay'
import { NoDataPatternDef } from './defs/NoDataPatternDef'
import {
  type FillGradient,
  GradientDef,
  type StrokeGradient,
} from './gradients'
import {
  getExtent,
  getIsolatedPoints,
  getStackedKeys,
  type Plotted,
  plotRows,
} from './utils/plotSeries'
import { getTimeTicks } from './utils/xAxisTicks'
import {
  fitTicks,
  getYAxisTicks,
  type YAxisTicks,
  type YAxisTicksOptions,
} from './utils/yAxisTicks'

type Value = number | null | undefined

export interface ChartSeries<K extends string, T = unknown> {
  key: K
  /** Plotted value; `row[key]` by default. The top edge of a band. */
  value?: (row: T) => Value
  /**
   * The bottom edge, for a band between two values. Both edges are stroked
   * and marked when hovered.
   */
  value0?: (row: T) => Value
  /** Line paint; omit for a fill-only area. */
  stroke?: string | StrokeGradient
  strokeWidth?: number
  strokeOpacity?: number
  strokeDasharray?: string
  /** Area paint; omit for a line without fill. */
  fill?: string | FillGradient
  fillOpacity?: number
  curve?: 'linear' | 'step' | 'stepAfter' | 'monotone'
  /** Draw across missing values instead of leaving a gap. */
  connectNulls?: boolean
  /** A faint line under the series that bridges its gaps. */
  gapStroke?: { stroke: string; strokeOpacity: number }
  /**
   * A dot, in the series' legend color, at each value whose neighbours are
   * missing, which no line would show.
   */
  isolatedDots?: { fillOpacity?: number }
  /**
   * Stacked series sit on the ones declared before them on the same axis;
   * a lone one is drawn like any other.
   */
  stack?: boolean
  axis?: 'right'
  /**
   * Marks the hovered row; by default on every series except stacked ones
   * below the top of their stack.
   */
  activeDot?: boolean
}

export interface ChartYAxis extends YAxisTicksOptions {
  format?: (value: number) => string
  unit?: string
  dy?: number
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

/** Spans the y axis; without a fill it shows the no-data hatch. */
export interface ChartReferenceArea {
  x1: number
  /** The last row by default. */
  x2?: number
  fill?: string
  fillOpacity?: number
}

interface Props<T, K extends string> {
  data: T[] | undefined
  /**
   * Series in the chart meta are drawn while selected in the interactive
   * legend; the others always are.
   */
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
  /** Fades the other series' lines. */
  highlight?: K
  renderTooltip: (row: T, visibleKeys: K[]) => ReactNode
}

const SERIES_STROKE_WIDTH = 1.75
const FADED_STROKE_OPACITY = 0.2
const ISOLATED_DOT_RADIUS = 3
const Y_SCALE = 'y'
const RIGHT_SCALE = 'right-y'

const chartClassNames = cn(
  '[--chart-grid:color-mix(in_oklab,var(--primary)_25%,transparent)] dark:[--chart-grid:color-mix(in_oklab,var(--primary)_40%,transparent)]',
  // The theme's muted color, which paints all tick labels.
  '[--chart-tick-label:color-mix(in_oklab,var(--primary)_50%,transparent)] dark:[--chart-tick-label:color-mix(in_oklab,var(--primary)_70%,transparent)]',
  // The axis options have no per-axis label color, so the x labels are
  // matched by their scene keys, which are not a documented API.
  '[&_text[data-ts-key^="x-tick-label"]]:fill-secondary',
  '[&_svg]:outline-none',
  // Only `highlight` changes a line's opacity.
  '[&_path]:transition-[stroke-opacity] [&_path]:duration-200 motion-reduce:[&_path]:transition-none',
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
  highlight,
  renderTooltip,
}: Props<T, K>) {
  const { meta, interactiveLegend } = useChart()
  const rows = data ?? EMPTY
  const visible = series.filter(
    (s) =>
      !interactiveLegend ||
      meta[s.key] === undefined ||
      interactiveLegend.dataKeys.includes(s.key),
  )
  const plotted = usePlotted(rows, visible)
  const stacked = getStackedKeys(visible)
  // An axis without visible series has no scale and shows no ticks.
  const hasRightAxis = !!rightAxis && visible.some((s) => s.axis === 'right')
  const scaleOf = (s: { axis?: 'right' }) =>
    s.axis === 'right' && hasRightAxis ? RIGHT_SCALE : Y_SCALE
  const ids = useIds()

  const lastSyncedX =
    syncedUntil !== undefined
      ? (() => {
          const row = rows.findLast((d) => x(d) <= syncedUntil)
          return row !== undefined ? x(row) : undefined
        })()
      : undefined
  const areas: ChartReferenceArea[] = [
    ...(lastSyncedX !== undefined ? [{ x1: lastSyncedX }] : []),
    ...(referenceAreas ?? []),
  ]
  const gradients = visible.flatMap((s) => [
    ...(typeof s.fill === 'object'
      ? [{ id: ids.fill(s.key), gradient: s.fill }]
      : []),
    ...(typeof s.stroke === 'object'
      ? [{ id: ids.stroke(s.key), gradient: s.stroke }]
      : []),
  ])
  const isolatedColors = visible.map((s) =>
    s.isolatedDots ? meta[s.key]?.color : undefined,
  )

  // The hover overlay maps rows to pixels with the last rendered scales.
  const [sceneRef] = useState(() => new ChartSceneStore())

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
    highlight,
    isolatedColors,
  ])

  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on values, see above
  const definition = useMemo(() => {
    const getX = (point: Plotted<T>) => xRef.current(point.row)
    const leftSeries = visible.filter((s) => s.axis !== 'right')
    const rightSeries = visible.filter((s) => s.axis === 'right')
    const left = getYAxisTicks(
      getExtent(
        plotted,
        leftSeries.map((s) => s.key),
      ),
      yAxis,
      leftSeries.length,
    )
    const right =
      rightAxis && hasRightAxis
        ? getYAxisTicks(
            getExtent(
              plotted,
              rightSeries.map((s) => s.key),
            ),
            rightAxis,
            rightSeries.length,
          )
        : undefined

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
    const isolatedDots: Mark[] = []
    visible.forEach((s, i) => {
      const curve = s.curve ? CURVES[s.curve] : undefined
      const yScale = scaleOf(s)
      const top = (p: Plotted<T>) => p.top[s.key] ?? null
      const edges = [
        { id: s.key, y: top },
        ...(s.value0 && s.stroke
          ? [
              {
                id: `${s.key}-bottom`,
                y: (p: Plotted<T>) => p.bottom[s.key] ?? null,
              },
            ]
          : []),
      ]
      const withValue = (y: (p: Plotted<T>) => number | null) =>
        plotted.filter((p) => y(p) !== null)
      const line = (
        id: string,
        y: (p: Plotted<T>) => number | null,
        stroke: string,
        strokeOpacity: number | undefined,
        source: Plotted<T>[],
      ) =>
        decorative(
          lineY(source, {
            id,
            x: getX,
            y,
            stroke,
            strokeWidth: s.strokeWidth ?? SERIES_STROKE_WIDTH,
            strokeOpacity,
            strokeDasharray: s.strokeDasharray,
            curve,
            yScale,
          }),
        )

      if (s.fill) {
        const base = baseOf(s)
        const source = s.connectNulls ? withValue(top) : plotted
        fills.push(
          decorative(
            areaY(source, {
              id: `${s.key}-fill`,
              x: getX,
              y1: (p) =>
                p.top[s.key] === null ? null : (p.bottom[s.key] ?? base),
              y2: top,
              fill: paint(s.fill, ids.fill(s.key)),
              fillOpacity: s.fillOpacity ?? 1,
              curve,
              yScale,
            }),
          ),
        )
      }
      if (s.gapStroke) {
        for (const edge of edges) {
          strokes.push(
            line(
              `${edge.id}-gap`,
              edge.y,
              s.gapStroke.stroke,
              s.gapStroke.strokeOpacity,
              withValue(edge.y),
            ),
          )
        }
      }
      if (s.stroke) {
        const stroke = paint(s.stroke, ids.stroke(s.key))
        const strokeOpacity =
          highlight !== undefined && s.key !== highlight
            ? FADED_STROKE_OPACITY
            : s.strokeOpacity
        for (const edge of edges) {
          strokes.push(
            line(
              `${edge.id}-stroke`,
              edge.y,
              stroke,
              strokeOpacity,
              s.connectNulls ? withValue(edge.y) : plotted,
            ),
          )
        }
      }
      const color = isolatedColors[i]
      if (s.isolatedDots && color) {
        const points = getIsolatedPoints(plotted, s.key)
        for (const edge of edges) {
          isolatedDots.push(
            decorative(
              dot(points, {
                id: `${edge.id}-isolated`,
                x: getX,
                y: edge.y,
                r: ISOLATED_DOT_RADIUS,
                fill: color,
                fillOpacity: s.isolatedDots.fillOpacity,
                stroke: color,
                yScale,
              }),
            ),
          )
        }
      }
    })

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
            fill: area.fill ?? `url(#${ids.noData})`,
            fillOpacity: area.fillOpacity,
            inset: 0,
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
          // A label centred on the left edge would be cut off.
          values: xAxis.ticks.filter((t) => t > xDomain[0]),
          format: (v: number) => axesRef.current.xAxis?.format(v) ?? String(v),
        }
      : getTimeTicks(rows.map((row) => xRef.current(row)))

    // Bottom: room for the x axis labels.
    const chartMargin = { top: 20, right: 1, bottom: 25, left: 0, ...margin }
    const plotHeight = (height: number) =>
      height - chartMargin.top - chartMargin.bottom

    return defineChart({
      // A function of the size, so the y ticks can fit the plot height.
      chart: ({ height }) => {
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
            decorative(
              ruleY(leftTicks, {
                id: 'y-grid',
                y: (v) => v,
                stroke: 'var(--chart-grid)',
                strokeOpacity: 1,
              }),
            ),
            ...isolatedDots,
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
                tickLabels: { fontSize: 10, fontWeight: 500, opacity: 1 },
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
          theme: { muted: 'var(--chart-tick-label)' },
          margin: chartMargin,
          // Not clipped, so lines at the domain's ends keep their full width;
          // every domain contains its data.
        }
      },
      // The library's hover host restyles the whole chart on every pointer
      // move and searches rows linearly; ChartHoverOverlay replaces it.
      focus: false,
      pointer: false,
      keyboard: false,
    })
  }, [plotted, optionsKey, yAxis.scale, rightAxis?.scale])

  // Within a stack, only its top series marks the hovered row.
  const stackTops = new Map(
    visible.filter((s) => stacked.has(s.key)).map((s) => [s.axis, s.key]),
  )
  const dots = visible
    .filter(
      (s) =>
        s.activeDot ?? (!stacked.has(s.key) || stackTops.get(s.axis) === s.key),
    )
    .flatMap((s) => [
      {
        key: s.key,
        value: (_row: T, index: number) => plotted[index]?.top[s.key],
        scale: scaleOf(s),
      },
      ...(s.value0 && s.stroke
        ? [
            {
              key: `${s.key}-bottom`,
              value: (_row: T, index: number) => plotted[index]?.bottom[s.key],
              scale: scaleOf(s),
            },
          ]
        : []),
    ])

  const visibleKeys = visible.map((s) => s.key)
  return (
    <>
      {/* Chart-sized, so stroke gradients across the plot span it. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <defs>
          {gradients.map(({ id, gradient }) => (
            <GradientDef key={id} id={id} gradient={gradient} />
          ))}
          {areas.some((area) => area.fill === undefined) && (
            <NoDataPatternDef id={ids.noData} />
          )}
        </defs>
      </svg>
      <Chart
        definition={definition}
        ariaLabel={ariaLabel}
        className={chartClassNames}
        // Overrides the adapter's own size, so the chart fills the box.
        style={{
          position: 'absolute',
          inset: 0,
          width: 'auto',
          height: 'auto',
        }}
        onRender={({ scene }) => sceneRef.set(scene)}
      />
      <ChartHoverOverlay
        rows={rows}
        x={x}
        dots={dots}
        sceneRef={sceneRef}
        ariaLabel={ariaLabel}
        syncId={syncId}
        renderTooltip={(row) => renderTooltip(row, visibleKeys)}
      />
    </>
  )
}

/** Plotted rows, recomputed when the rows or the series' shape change. */
function usePlotted<T, K extends string>(
  rows: T[],
  visible: ChartSeries<K, T>[],
): Plotted<T>[] {
  const key = visible
    .map((s) => `${s.key}:${s.stack ? 's' : ''}:${s.axis ?? ''}`)
    .join()
  const seriesRef = useRef(visible)
  seriesRef.current = visible
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the series shape
  return useMemo(() => plotRows(rows, seriesRef.current), [rows, key])
}

/** Document-unique ids for this chart's gradients and hatch. */
function useIds() {
  // React's ids contain characters that are awkward inside `url(#…)`.
  const prefix = `chart${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return {
    fill: (key: string) => `${prefix}-${key}-fill`,
    stroke: (key: string) => `${prefix}-${key}-stroke`,
    noData: `${prefix}-no-data`,
  }
}

function paint(value: string | FillGradient | StrokeGradient, id: string) {
  return typeof value === 'string' ? value : `url(#${id})`
}

function getTimestamp<T>(row: T) {
  return (row as { timestamp: number }).timestamp
}

function yScaleOptions(
  y: YAxisTicks,
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
        opacity: 1,
        thin: false,
      },
    },
  }
}

const EMPTY: never[] = []
