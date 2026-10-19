import { UnixTime } from '@l2beat/shared-pure'
import { useId, useMemo } from 'react'
import {
  Area,
  AreaChart,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { cn } from '~/utils/cn'
import { formatRange, formatTimestamp } from '~/utils/dates'
import { toWeeklyAverages } from './toWeeklyAverages'

export interface HomeSparklineDataPoint {
  timestamp: number
  value: number | null
  tvsBreakdown?: {
    rollups: number | null
    validiumsAndOptimiums: number | null
  }
}

interface Props {
  data: HomeSparklineDataPoint[]
  tooltipLabel: string
  formatValue: (value: number) => string
  /**
   * Daily figures that swing day to day (activity, deposits): drawn as weekly
   * averages, so the line shows the trend the yearly change describes.
   */
  weeklyAverage?: boolean
  className?: string
}

/** Every home sparkline shares one colour, so the cards read as a set. */
const STROKE = 'var(--chart-pink)'

/**
 * ChartContainer has fixed heights (114px at its smallest), both on its
 * settled-size box and on the recharts wrapper. Filling an absolutely
 * positioned box instead lets the sparkline take its wrapper's height, and
 * keeps the svg from ever pushing that wrapper taller. The container also
 * pins series strokes to 1.75px; a sparkline drawn this small wants 2px.
 */
const FILL_HEIGHT_CLASS = cn(
  'absolute inset-0 [&>div]:h-full',
  '[&>div>div:first-child]:h-full! [&>div>div:first-child]:min-h-0!',
  '[&_.recharts-wrapper]:aspect-auto! [&_.recharts-wrapper]:h-full! [&_.recharts-wrapper]:min-h-0!',
  '[&_.recharts-area-curve]:stroke-2!',
  // The chart is a tab stop (arrow keys walk the tooltip), but ChartContainer
  // hides every chart's outline; a sparkline shows it on keyboard focus.
  '[&_.recharts-surface:focus-visible]:outline-2! [&_.recharts-surface:focus-visible]:outline-solid! [&_.recharts-surface:focus-visible]:outline-offset-2!',
)

/**
 * A chart reduced to its line and a soft fill: no axes, a hairline at the
 * period's high and low with their values, a dashed line where it started
 * and a dot on the latest value. The high and low hairlines bound the plot;
 * their values sit outside it, above and below, so the line never runs
 * through them.
 */
export function HomeSparkline({
  data: dailyData,
  tooltipLabel,
  formatValue,
  weeklyAverage,
  className,
}: Props) {
  const fillId = useId()
  const data = useMemo(
    () => (weeklyAverage ? toWeeklyAverages(dailyData) : dailyData),
    [dailyData, weeklyAverage],
  )
  const domain = useMemo(() => getDomain(data), [data])
  const first = useMemo(() => data.find((d) => d.value !== null), [data])
  const last = useMemo(() => data.findLast((d) => d.value !== null), [data])
  const range = useMemo(() => getRange(data), [data])
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
    <div className={cn('relative h-24', className)}>
      <div className={FILL_HEIGHT_CLASS}>
        <ChartContainer
          meta={meta}
          data={data}
          isLoading={false}
          size="small"
          loaderClassName="scale-50"
        >
          <AreaChart
            responsive
            data={data}
            // Room above and below the plot for the high and low labels, and
            // on the right for the end dot, which sits on the last point.
            margin={{
              top: LABEL_HEIGHT,
              right: 6,
              bottom: LABEL_HEIGHT,
              left: 0,
            }}
          >
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={STROKE} stopOpacity={0.18} />
                <stop offset="100%" stopColor={STROKE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="timestamp" hide />
            <YAxis hide domain={domain} />
            {/* Where the period started, so the change beside the number
                shows in the line's shape. */}
            {first && first.value !== null && (
              <ReferenceLine
                y={first.value}
                stroke="var(--divider)"
                strokeOpacity={0.7}
                strokeDasharray="2 3"
                ifOverflow="extendDomain"
                zIndex={BEHIND_SERIES}
              />
            )}
            {range &&
              (['max', 'min'] as const).map((key) => (
                <ReferenceLine
                  key={key}
                  y={range[key]}
                  stroke="var(--divider)"
                  // Softer than the page's hairlines: a reference, not a frame.
                  strokeOpacity={0.5}
                  zIndex={BEHIND_SERIES}
                  label={
                    <ExtremeLabel
                      value={formatValue(range[key])}
                      side={key === 'max' ? 'above' : 'below'}
                    />
                  }
                />
              ))}
            <Area
              dataKey="value"
              // A weekly series has few enough points to show its corners.
              type={weeklyAverage ? 'monotone' : 'linear'}
              stroke={STROKE}
              fill={`url(#${fillId})`}
              fillOpacity={1}
              baseValue="dataMin"
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
              activeDot={{ r: 3.5, stroke: 'none', fill: STROKE }}
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
            <ChartTooltip
              content={
                <SparklineTooltip
                  formatValue={formatValue}
                  weeklyAverage={weeklyAverage}
                />
              }
              filterNull={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}

/** Recharts' grid layer: guide lines go under the series, not across it. */
const BEHIND_SERIES = -100

/** The high and low labels sit outside the plot, in margins this tall. */
const LABEL_HEIGHT = 18

/** Between a label and its hairline. */
const LABEL_GAP = 5

const LABEL_FONT_SIZE = 12

/** The extremes, or nothing for a flat or empty series. */
function getRange(data: HomeSparklineDataPoint[]) {
  const [min, max] = getExtremes(data)
  return min < max ? { min, max } : undefined
}

/**
 * The series' own range: a sparkline shows the shape, not the size. The
 * high and low hairlines are the plot's top and bottom; a flat series draws
 * near the top, where a real series would peak.
 */
function getDomain(data: HomeSparklineDataPoint[]): [number, number] {
  const [min, max] = getExtremes(data)
  if (min > max) {
    return [0, 1]
  }
  if (min === max) {
    const padding = Math.abs(min) || 1
    return [min - padding, max + padding * 0.1]
  }
  return [min, max]
}

/** [min, max] of the values; [Infinity, -Infinity] when there are none. */
function getExtremes(data: HomeSparklineDataPoint[]): [number, number] {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const { value } of data) {
    if (value === null) continue
    min = Math.min(min, value)
    max = Math.max(max, value)
  }
  return [min, max]
}

/**
 * A hairline's value at its right end, above the line for the high and below
 * it for the low. Recharts passes the line's `viewBox`.
 */
function ExtremeLabel({
  value,
  side,
  viewBox,
}: {
  value: string
  side: 'above' | 'below'
  viewBox?: { x: number; y: number; width: number }
}) {
  if (!viewBox) return null
  return (
    <text
      x={viewBox.x + viewBox.width}
      // Placed by the baseline, which Safari aligns reliably: a cap height
      // under the gap for the low label.
      y={
        side === 'above'
          ? viewBox.y - LABEL_GAP
          : viewBox.y + LABEL_GAP + LABEL_FONT_SIZE * 0.75
      }
      textAnchor="end"
      fontSize={LABEL_FONT_SIZE}
      fill="var(--secondary)"
    >
      {value}
    </text>
  )
}

function SparklineTooltip({
  payload,
  label,
  formatValue,
  weeklyAverage,
}: CustomChartTooltipProps & {
  formatValue: (value: number) => string
  weeklyAverage?: boolean
}) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null
  const entry = payload[0]
  const config = entry?.name !== undefined ? meta[entry.name] : undefined
  if (!entry || !config) return null
  const breakdown = (entry.payload as HomeSparklineDataPoint | undefined)
    ?.tvsBreakdown
  const rows = [
    {
      id: 'value',
      label: weeklyAverage ? `${config.label}, daily average` : config.label,
      value: entry.value,
      indicator: true,
    },
    ...(breakdown
      ? [
          {
            id: 'rollups',
            label: 'Rollups',
            value: breakdown.rollups,
            indicator: false,
          },
          {
            id: 'validiumsAndOptimiums',
            label: 'Validiums & Optimiums',
            value: breakdown.validiumsAndOptimiums,
            indicator: false,
          },
        ]
      : []),
  ]
  return (
    <ChartTooltipWrapper>
      <div className="flex w-50 flex-col gap-2 sm:w-60">
        <div className="mb-1 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {weeklyAverage
            ? formatRange(label, label + 6 * UnixTime.DAY)
            : formatTimestamp(label, { longMonthName: true })}
        </div>
        {rows.map((row, index) => (
          <div key={row.id}>
            {index === 1 && <HorizontalSeparator className="mb-2" />}
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {row.indicator && (
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                )}
                <span className="font-medium text-label-value-14">
                  {row.label}
                </span>
              </div>
              <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                {typeof row.value === 'number'
                  ? formatValue(row.value)
                  : 'No data'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ChartTooltipWrapper>
  )
}
