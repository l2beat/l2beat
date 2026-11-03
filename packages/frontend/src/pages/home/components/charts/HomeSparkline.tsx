import { areaY, defineChart, dot, lineY, ruleY, text } from '@tanstack/charts'
import { d3Curve } from '@tanstack/charts/d3/shape'
import { decorative } from '@tanstack/charts/mark/decorative'
import { Chart } from '@tanstack/charts/react'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { curveMonotoneX } from 'd3-shape'
import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartSceneStore } from '~/components/core/chart/ChartHoverOverlay'
import { AREA_FILL_OPACITY } from '~/components/core/chart/tint'
import type { HomeSparklineSeries } from '~/server/features/home/homeSeries'
import { cn } from '~/utils/cn'
import { HOME_CHART_HEIGHT_CLASS } from '../../homeStyles'
import { SparklineTooltip } from './SparklineTooltip'
import { getSparklineScale, type SparklinePoint } from './sparklineScale'

interface Props {
  series: HomeSparklineSeries
  /** What the chart shows, for screen readers: the figure's label. */
  label: string
  formatValue: (value: number) => string
}

/** Every home sparkline shares the brand colour, so the cards read as a set. */
const STROKE = 'var(--chart-pink)'

/** ChartContainer needs a series; the card names it beside the chart. */
const META: ChartMeta = {
  value: { label: '', color: STROKE, indicatorType: { shape: 'line' } },
}

/**
 * A chart reduced to its line and a soft fill: no axes, a hairline at the
 * period's high and low with their values, and a dot on the latest value.
 * The high and low hairlines bound the plot; their values sit outside it,
 * above and below, so the line never runs through them.
 */
export function HomeSparkline({ series, label, formatValue }: Props) {
  const data = useMemo(
    () =>
      series.points.map(
        ([timestamp, value, ...parts]): SparklinePoint => ({
          timestamp,
          value,
          parts,
        }),
      ),
    [series],
  )

  return (
    <div className={cn('relative', HOME_CHART_HEIGHT_CLASS)}>
      {/* Filling an absolutely positioned box keeps the chart from ever
          pushing its wrapper taller. */}
      <div className="absolute inset-0">
        <ChartContainer
          meta={META}
          data={data}
          isLoading={false}
          isPlaceholderData={false}
          size="fill"
          loaderClassName="scale-50"
        >
          <SparklineChart
            data={data}
            series={series}
            label={label}
            formatValue={formatValue}
          />
        </ChartContainer>
      </div>
    </div>
  )
}

function SparklineChart({
  data,
  series,
  label,
  formatValue,
}: Props & { data: SparklinePoint[] }) {
  // The scrub area maps points to pixels with the last rendered scales. It
  // is a sibling, so scrubbing does not render the chart again.
  const [sceneRef] = useState(() => new ChartSceneStore())
  // A weekly series has few enough points to show its corners.
  const curve = series.kind === 'weekly' ? 'monotone' : 'linear'
  const perDay = series.kind === 'weekly' && series.perDay
  const definition = useMemo(
    () =>
      getDefinition(data, curve, (value) =>
        perDay ? `${formatValue(value)}/day` : formatValue(value),
      ),
    [data, curve, formatValue, perDay],
  )

  return (
    <>
      <Chart
        definition={definition}
        ariaLabel={label}
        className={CHART_CLASS}
        // Overrides the adapter's own size, so the chart fills the box.
        style={{
          position: 'absolute',
          inset: 0,
          width: 'auto',
          height: 'auto',
        }}
        onRender={({ scene }) => sceneRef.set(scene)}
      />
      <ScrubArea
        data={data}
        series={series}
        label={label}
        sceneRef={sceneRef}
        formatValue={formatValue}
      />
    </>
  )
}

/**
 * Where the pointer, a finger or the arrow keys pick a point: a cursor line,
 * a dot on the point and its tooltip, off the chart.
 */
function ScrubArea({
  data,
  series,
  label,
  sceneRef,
  formatValue,
}: Props & {
  data: SparklinePoint[]
  sceneRef: ChartSceneStore
}) {
  const id = useId()
  const [active, setActive] = useState<number>()
  // Asked per gesture, not of the device: a tablet can have a trackpad too.
  // A pen covers the chart like a finger does.
  const [touch, setTouch] = useState(false)
  // Hidden, the tooltip and the dot under it go together.
  const hidden = useSyncExternalStore(subscribe, getShown, getNoneShown) !== id

  // A resize lays the chart out again; an open tooltip follows its point.
  const [, setLayout] = useState(0)
  const activeRef = useRef(active)
  activeRef.current = active
  useEffect(
    () =>
      sceneRef.subscribe(() => {
        if (activeRef.current !== undefined) setLayout((n) => n + 1)
      }),
    [sceneRef],
  )

  const lastIndex = data.findLastIndex((d) => d.value !== null)

  function scrub(event: PointerEvent<HTMLDivElement>) {
    const xScale = sceneRef.current?.scales.x
    if (!xScale?.invert || data.length === 0) return
    const rect = event.currentTarget.getBoundingClientRect()
    setTouch(event.pointerType !== 'mouse')
    setActive(
      nearestIndex(data, Number(xScale.invert(event.clientX - rect.left))),
    )
    show(id)
  }

  // Arrow keys walk the points, Enter brings the tooltip back after a
  // scroll has hidden it; Tab, Escape and the rest leave it be.
  function onKeyDown(event: KeyboardEvent) {
    const step =
      event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
    if (step === 0 && event.key !== 'Enter') return
    event.preventDefault()
    const from = active ?? lastIndex
    setTouch(false)
    setActive(Math.min(Math.max(from + step, 0), data.length - 1))
    show(id)
  }

  const scene = sceneRef.current
  const point = active !== undefined ? data[active] : undefined
  const x = point && scene?.scales.x?.map(point.timestamp)
  const y =
    point && point.value !== null
      ? scene?.scales.y?.map(point.value)
      : undefined
  const plot = scene?.chart

  return (
    <div
      // As on the other charts: the arrow keys walk the points.
      role="application"
      tabIndex={0}
      aria-label={`${label}: arrow keys show values`}
      className={cn(
        'absolute inset-0 rounded-sm',
        // A sideways drag scrubs the chart, an upright one scrolls the page;
        // a long press would select the labels.
        'touch-pan-y touch-pinch-zoom select-none [-webkit-touch-callout:none]',
        // ChartContainer hides chart outlines; a sparkline shows its own on
        // keyboard focus.
        'outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2',
      )}
      onPointerDown={scrub}
      onPointerMove={scrub}
      onPointerLeave={(event) => {
        // A lifted finger also leaves; its tooltip stays until a tap
        // elsewhere.
        if (event.pointerType === 'mouse') setActive(undefined)
      }}
      onFocus={() => show(id)}
      onBlur={() => setActive(undefined)}
      onKeyDown={onKeyDown}
    >
      {!hidden && point && x !== undefined && plot && (
        <>
          <div
            className="pointer-events-none absolute w-0.5 bg-primary"
            style={{
              top: plot.y,
              height: plot.height,
              transform: `translateX(${x - 1}px)`,
            }}
          />
          {y !== undefined && (
            <div
              className="pointer-events-none absolute rounded-full"
              style={{
                width: ACTIVE_DOT_RADIUS * 2,
                height: ACTIVE_DOT_RADIUS * 2,
                background: STROKE,
                transform: `translate(${x - ACTIVE_DOT_RADIUS}px, ${y - ACTIVE_DOT_RADIUS}px)`,
              }}
            />
          )}
          <SparklineTooltip
            point={point}
            anchorX={x}
            side={touch ? 'above' : 'below'}
            formatValue={formatValue}
            series={series}
          />
        </>
      )}
    </div>
  )
}

/**
 * Series strokes are round-ended; the high and low hairlines land on whole
 * device pixels, so the 1px lines stay sharp instead of straddling two.
 */
const CHART_CLASS = cn(
  '[&_svg]:overflow-visible [&_svg]:outline-none',
  '[&_[data-ts-key^="extreme-"]]:[shape-rendering:crispEdges]',
)

const ACTIVE_DOT_RADIUS = 3.5

/** The high and low labels sit outside the plot, in margins this tall. */
const LABEL_HEIGHT = 18

/** Between a label and its hairline. */
const LABEL_GAP = 5

const LABEL_FONT_SIZE = 12

function getDefinition(
  data: SparklinePoint[],
  curveType: 'monotone' | 'linear',
  formatLabel: (value: number) => string,
) {
  const { domain, range } = getSparklineScale(data)
  const curve = curveType === 'monotone' ? d3Curve(curveMonotoneX) : undefined
  const getX = (d: SparklinePoint) => d.timestamp
  const getY = (d: SparklinePoint) => d.value
  const first = data[0]
  const lastPoint = data.findLast((d) => d.value !== null)
  const xDomain: [number, number] = [
    first?.timestamp ?? 0,
    data.at(-1)?.timestamp ?? 1,
  ]

  const extremes = range
    ? [
        // The low is the plot's baseline, the high a gridline.
        { key: 'max', value: range.max, stroke: 'var(--chart-grid)' },
        { key: 'min', value: range.min, stroke: 'var(--chart-baseline)' },
      ]
    : []

  return defineChart({
    marks: [
      // Guide lines go under the series, not across it.
      ...extremes.map((e) =>
        decorative(
          ruleY([e.value], {
            id: `extreme-${e.key}`,
            y: (v) => v,
            stroke: e.stroke,
            strokeOpacity: 1,
            strokeWidth: 1,
          }),
        ),
      ),
      decorative(
        areaY(data, {
          id: 'fill',
          x: getX,
          y1: (d) => (d.value === null ? null : domain[0]),
          y2: getY,
          fill: STROKE,
          fillOpacity: AREA_FILL_OPACITY,
          curve,
        }),
      ),
      decorative(
        lineY(data, {
          id: 'line',
          x: getX,
          y: getY,
          stroke: STROKE,
          strokeWidth: 2,
          curve,
        }),
      ),
      // The high above the right end of its line, the low below the left
      // end of its, in opposite corners of the plot. Placed by the
      // baseline: a cap height under the gap for the low label.
      ...(range
        ? [
            decorative(
              text([{ x: xDomain[1], y: range.max }], {
                id: 'label-max',
                x: 'x',
                y: 'y',
                text: () => formatLabel(range.max),
                anchor: 'end',
                dy: -LABEL_GAP,
                fontSize: LABEL_FONT_SIZE,
                fill: 'var(--muted)',
              }),
            ),
            decorative(
              text([{ x: xDomain[0], y: range.min }], {
                id: 'label-min',
                x: 'x',
                y: 'y',
                text: () => formatLabel(range.min),
                anchor: 'start',
                dy: LABEL_GAP + LABEL_FONT_SIZE * 0.75,
                fontSize: LABEL_FONT_SIZE,
                fill: 'var(--muted)',
              }),
            ),
          ]
        : []),
      // The end dot on the last point hangs into the card's padding.
      ...(lastPoint
        ? [
            decorative(
              dot([lastPoint], {
                id: 'last',
                x: getX,
                y: getY,
                r: 3,
                fill: STROKE,
              }),
            ),
          ]
        : []),
    ],
    // Scale instances keep the domains: the plot runs to the right edge,
    // like the figures and tables, and its height is the series' range.
    scales: {
      x: { scale: scaleLinear().domain(xDomain), axis: false },
      y: { scale: scaleLinear().domain(domain), axis: false },
    },
    // Room above and below the plot for the high and low labels.
    margin: { top: LABEL_HEIGHT, right: 0, bottom: LABEL_HEIGHT, left: 0 },
    // The chart's own hover host is replaced by the scrub area above it.
    focus: false,
    pointer: false,
    keyboard: false,
  })
}

/** Index of the point closest to `x`; points are sorted by time. */
function nearestIndex(points: SparklinePoint[], x: number) {
  let lo = 0
  let hi = points.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if ((points[mid] as SparklinePoint).timestamp < x) lo = mid + 1
    else hi = mid
  }
  const prev = points[lo - 1]
  const at = points[lo]
  if (prev && at && x - prev.timestamp < at.timestamp - x) return lo - 1
  return lo
}

/**
 * The one sparkline whose tooltip may show. A tap leaves a tooltip up, so
 * without this, tapping the next chart would leave two; touching a chart
 * claims it, and scrolling the page or touching anything else hides every
 * tooltip.
 */
let shownId: string | undefined
const listeners = new Set<() => void>()

function show(id: string | undefined) {
  if (shownId === id) return
  shownId = id
  for (const listener of listeners) listener()
}

const hide = () => show(undefined)

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener('scroll', hide, { passive: true })
    // Before the chart's own handler, which claims it back.
    window.addEventListener('pointerdown', hide, { capture: true })
  }
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener('scroll', hide)
      window.removeEventListener('pointerdown', hide, { capture: true })
    }
  }
}

const getShown = () => shownId
const getNoneShown = () => undefined
