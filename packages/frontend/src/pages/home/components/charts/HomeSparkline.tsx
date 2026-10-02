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
 * pins series strokes to 1.75px; a sparkline wants a finer one.
 */
const FILL_HEIGHT_CLASS = cn(
  'absolute inset-0 [&>div]:h-full',
  '[&>div>div:first-child]:h-full! [&>div>div:first-child]:min-h-0!',
  '[&_.recharts-wrapper]:aspect-auto! [&_.recharts-wrapper]:h-full! [&_.recharts-wrapper]:min-h-0!',
  '[&_.recharts-area-curve]:stroke-[1.5px]!',
)

/**
 * A chart reduced to its line and a soft fill: no axes, a hairline at the
 * period's high and low with their values, a dashed line where it started
 * and a dot on the latest value.
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
            // Room for the end dot, which sits on the last point at the edge,
            // and under the plot for the low label.
            margin={{ top: 6, right: 6, bottom: LOW_LABEL_HEIGHT, left: 0 }}
          >
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={STROKE} stopOpacity={0.12} />
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
                  y={range[key].value}
                  stroke="var(--divider)"
                  // Softer than the page's hairlines: a reference, not a frame.
                  strokeOpacity={0.5}
                  zIndex={BEHIND_SERIES}
                  // On the side away from the extreme itself, clear of the line.
                  label={{
                    value: formatValue(range[key].value),
                    position: range[key].early
                      ? 'insideTopRight'
                      : 'insideTopLeft',
                    fontSize: 10,
                    fill: 'var(--secondary)',
                    fillOpacity: 0.7,
                  }}
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

/** The low label hangs under the plot, in a margin this tall. */
const LOW_LABEL_HEIGHT = 16

/**
 * Seven-day buckets counted back from the latest day, so the last point is
 * the latest full week. Each is stamped with its first day and holds the mean
 * of the days that have data.
 */
function toWeeklyAverages(
  data: HomeSparklineDataPoint[],
): HomeSparklineDataPoint[] {
  const weeks: HomeSparklineDataPoint[] = []
  for (let end = data.length; end > 0; end -= 7) {
    const days = data.slice(Math.max(0, end - 7), end)
    const [firstDay] = days
    if (!firstDay) continue
    const values = days.flatMap((d) => (d.value === null ? [] : [d.value]))
    weeks.push({
      timestamp: firstDay.timestamp,
      value:
        values.length > 0
          ? values.reduce((sum, v) => sum + v, 0) / values.length
          : null,
    })
  }
  return weeks.reverse()
}

/** The extremes, and whether each falls in the first half of the period. */
function getRange(data: HomeSparklineDataPoint[]) {
  let min: { value: number; early: boolean } | undefined
  let max: { value: number; early: boolean } | undefined
  data.forEach((d, index) => {
    if (d.value === null) return
    const early = index < data.length / 2
    if (!min || d.value < min.value) min = { value: d.value, early }
    if (!max || d.value > max.value) max = { value: d.value, early }
  })
  return min && max && min.value !== max.value ? { min, max } : undefined
}

/**
 * The series' own range: a sparkline shows the shape, not the size. The low
 * line sits at the bottom of the plot (its label hangs below it); a flat
 * series draws near the top, where a real series would peak.
 */
function getDomain(data: HomeSparklineDataPoint[]): [number, number] {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const { value } of data) {
    if (value === null) continue
    min = Math.min(min, value)
    max = Math.max(max, value)
  }
  if (min > max) {
    return [0, 1]
  }
  if (min === max) {
    const padding = Math.abs(min) || 1
    return [min - padding, max + padding * 0.1]
  }
  const range = max - min
  return [min, max + range * 0.05]
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
            ? formatRange(label, label + 7 * UnixTime.DAY)
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
