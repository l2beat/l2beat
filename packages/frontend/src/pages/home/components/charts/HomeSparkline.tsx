import {
  type ComponentProps,
  type PointerEvent,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import {
  AreaChart,
  ReferenceDot,
  ReferenceLine,
  useActiveTooltipCoordinate,
  usePlotArea,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartMeta } from '~/components/core/chart/Chart'
import { ChartContainer, ChartTooltip } from '~/components/core/chart/Chart'
import { ChartTintedArea } from '~/components/core/chart/ChartTintedArea'
import {
  type HomeSeriesPoint,
  toWeeklyAverages,
} from '~/server/features/home/homeSeries'
import { cn } from '~/utils/cn'
import { HOME_CHART_HEIGHT_CLASS } from '../../homeStyles'
import { SparklineTooltip } from './SparklineTooltip'
import { getSparklineScale, type SparklinePoint } from './sparklineScale'

interface Props {
  data: HomeSeriesPoint[]
  tooltipLabel: string
  formatValue: (value: number) => string
  /** The tooltip's names for the parts each point breaks down into. */
  partLabels?: string[]
  /**
   * Daily figures that swing day to day (activity, deposits): drawn as weekly
   * averages, so the line shows the trend the yearly change describes.
   */
  weeklyAverage?: boolean
  /**
   * Amounts per day (deposits, blob data) beside a yearly total: the high and
   * low say "/day", so the chart's scale does not read as the figure's.
   */
  perDay?: boolean
}

/**
 * ChartContainer pins series strokes to 1.75px; a sparkline drawn this small
 * wants 2px. Filling an absolutely positioned box keeps the svg from ever
 * pushing its wrapper taller.
 */
const SPARKLINE_CLASS = cn(
  'absolute inset-0',
  '[&_.recharts-area-curve]:stroke-2!',
  '[&_.recharts-surface]:overflow-visible!',
  // A sideways drag scrubs the chart, an upright one scrolls the page; a
  // long press would select the labels.
  'touch-pan-y touch-pinch-zoom select-none [-webkit-touch-callout:none]',
  // The chart is a tab stop (arrow keys walk the tooltip), but ChartContainer
  // hides every chart's outline; a sparkline shows it on keyboard focus.
  '[&_.recharts-surface:focus-visible]:outline-2! [&_.recharts-surface:focus-visible]:outline-solid! [&_.recharts-surface:focus-visible]:outline-offset-2!',
)

const CHART_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'Enter'])

/** Every home sparkline shares the brand colour, so the cards read as a set. */
const STROKE = 'var(--chart-pink)'

/**
 * A chart reduced to its line and a soft fill: no axes, a hairline at the
 * period's high and low with their values, and a dot on the latest value.
 * The high and low hairlines bound the plot; their values sit outside it,
 * above and below, so the line never runs through them.
 */
export function HomeSparkline({
  data: dailyData,
  tooltipLabel,
  formatValue,
  partLabels,
  weeklyAverage,
  perDay,
}: Props) {
  const data = useMemo(
    () =>
      (weeklyAverage ? toWeeklyAverages(dailyData) : dailyData).map(
        ([timestamp, value, ...parts]): SparklinePoint => ({
          timestamp,
          value,
          parts,
        }),
      ),
    [dailyData, weeklyAverage],
  )
  const { domain, range } = useMemo(() => getSparklineScale(data), [data])
  const id = useId()
  // Asked per gesture, not of the device: a tablet can have a trackpad too.
  // A pen covers the chart like a finger does.
  const [touch, setTouch] = useState(false)
  const showTooltip = (event: PointerEvent) => {
    setTouch(event.pointerType !== 'mouse')
    show(id)
  }
  // Hidden, the tooltip and the dot under it go together.
  const hidden = useSyncExternalStore(subscribe, getShown, getNoneShown) !== id
  const last = data.findLast((d) => d.value !== null)
  const meta = useMemo<ChartMeta>(
    () => ({
      value: {
        label: tooltipLabel,
        color: STROKE,
        indicatorType: { shape: 'line' },
      },
    }),
    [tooltipLabel],
  )

  return (
    <div className={cn('relative', HOME_CHART_HEIGHT_CLASS)}>
      <div
        className={SPARKLINE_CLASS}
        onPointerDown={showTooltip}
        onPointerMove={showTooltip}
        onFocus={() => show(id)}
        // The keys recharts walks the tooltip with bring it back, also after
        // a scroll has hidden it; Tab, Escape and the rest leave it be.
        onKeyDown={(event) => {
          if (!CHART_KEYS.has(event.key)) return
          setTouch(false)
          show(id)
        }}
      >
        <ChartContainer
          meta={meta}
          data={data}
          isLoading={false}
          size="fill"
          loaderClassName="scale-50"
        >
          <AreaChart
            responsive
            data={data}
            // Room above and below the plot for the high and low labels. The
            // plot runs to the right edge, like the figures and tables, and
            // the end dot on its last point hangs into the card's padding.
            margin={{
              top: LABEL_HEIGHT,
              right: 0,
              bottom: LABEL_HEIGHT,
              left: 0,
            }}
          >
            <XAxis dataKey="timestamp" hide />
            <YAxis hide domain={domain} />
            {range &&
              (['max', 'min'] as const).map((key) => (
                <ReferenceLine
                  key={key}
                  y={range[key]}
                  // The low is the plot's baseline, the high a gridline.
                  stroke={
                    key === 'min'
                      ? 'var(--chart-baseline)'
                      : 'var(--chart-grid)'
                  }
                  // On a whole pixel the 1px line would straddle two and blur
                  // at 1x; crisp edges keep it one device pixel sharp.
                  shapeRendering="crispEdges"
                  zIndex={BEHIND_SERIES}
                  label={
                    <ExtremeLabel
                      value={`${formatValue(range[key])}${perDay ? '/day' : ''}`}
                      extreme={key}
                    />
                  }
                />
              ))}
            <ChartTintedArea
              dataKey="value"
              // A weekly series has few enough points to show its corners.
              type={weeklyAverage ? 'monotone' : 'linear'}
              color={STROKE}
              baseValue="dataMin"
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
              activeDot={!hidden && { r: 3.5, stroke: 'none', fill: STROKE }}
            />
            {last && last.value !== null && (
              <ReferenceDot
                x={last.timestamp}
                y={last.value}
                r={3}
                fill={STROKE}
                stroke="none"
              />
            )}
            <ScrubTooltip
              hidden={hidden}
              touch={touch}
              formatValue={formatValue}
              partLabels={partLabels}
              weeklyAverage={weeklyAverage}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}

/**
 * With a mouse, the tooltip beside the cursor from the plot's top, so the low
 * label under it stays readable, free to leave the chart sideways (see
 * `ChartTooltip`). Under a finger it follows the finger above the chart (see
 * `FingerTooltip`), at once: a slide would trail behind the finger.
 */
function ScrubTooltip({
  hidden,
  touch,
  ...props
}: Omit<ComponentProps<typeof SparklineTooltip>, 'fingerX'> & {
  hidden: boolean
  touch: boolean
}) {
  const plot = usePlotArea()
  const coordinate = useActiveTooltipCoordinate()
  return (
    <ChartTooltip
      content={
        <SparklineTooltip
          {...props}
          fingerX={touch ? coordinate?.x : undefined}
        />
      }
      filterNull={false}
      active={hidden ? false : undefined}
      isAnimationActive={!touch}
      position={touch ? { x: 0, y: 0 } : plot && { y: plot.y }}
    />
  )
}

/** Recharts' grid layer: guide lines go under the series, not across it. */
const BEHIND_SERIES = -100

/** The high and low labels sit outside the plot, in margins this tall. */
const LABEL_HEIGHT = 18

/** Between a label and its hairline. */
const LABEL_GAP = 5

const LABEL_FONT_SIZE = 12

/**
 * A hairline's value, in opposite corners of the plot: the high above the
 * right end of its line, the low below the left end of its. Recharts passes
 * the line's `viewBox`.
 */
function ExtremeLabel({
  value,
  extreme,
  viewBox,
}: {
  value: string
  extreme: 'max' | 'min'
  viewBox?: { x: number; y: number; width: number }
}) {
  if (!viewBox) return null
  const high = extreme === 'max'
  return (
    <text
      x={high ? viewBox.x + viewBox.width : viewBox.x}
      // Placed by the baseline, which Safari aligns reliably: a cap height
      // under the gap for the low label.
      y={
        high
          ? viewBox.y - LABEL_GAP
          : viewBox.y + LABEL_GAP + LABEL_FONT_SIZE * 0.75
      }
      textAnchor={high ? 'end' : 'start'}
      fontSize={LABEL_FONT_SIZE}
      fill="var(--muted)"
    >
      {value}
    </text>
  )
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
