import { UnixTime } from '@l2beat/shared-pure'
import { useId, useMemo } from 'react'
import { Area, AreaChart } from 'recharts'
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
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { PinkFillGradientDef } from '~/components/core/chart/defs/PinkGradientDef'
import { getXAxisProps } from '~/components/core/chart/utils/getXAxisProps'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { cn } from '~/utils/cn'
import { formatRange, formatTimestamp } from '~/utils/dates'

export interface HomeKpiChartDataPoint {
  timestamp: number
  value: number | null
  tvsBreakdown?: {
    rollups: number | null
    validiumsAndOptimiums: number | null
  }
}

interface Props {
  data: HomeKpiChartDataPoint[]
  tooltipLabel: string
  formatValue: (value: number) => string
  /**
   * Daily figures that swing day to day (activity, deposits): drawn as weekly
   * averages, so the line shows the trend the yearly change describes.
   */
  weeklyAverage?: boolean
  className?: string
}

/** Every home chart shares one colour, so the cards read as a set. */
const STROKE = 'var(--chart-pink)'

/**
 * ChartContainer has fixed heights (114px at its smallest), both on its
 * settled-size box and on the recharts wrapper. Filling an absolutely
 * positioned box instead lets the chart take its wrapper's height, and keeps
 * the svg from ever pushing that wrapper taller.
 */
const FILL_HEIGHT_CLASS = cn(
  'absolute inset-0 [&>div]:h-full',
  '[&>div>div:first-child]:h-full! [&>div>div:first-child]:min-h-0!',
  '[&_.recharts-wrapper]:aspect-auto! [&_.recharts-wrapper]:h-full! [&_.recharts-wrapper]:min-h-0!',
)

/** Axis labels at the size the small charts elsewhere on the site use. */
const TICK_SIZE_CLASS = cn(
  '[&_.recharts-cartesian-axis-tick-label_text]:text-2xs!',
  '[&_.recharts-cartesian-axis-tick-label_text]:font-medium!',
)

/**
 * A KPI's last year, drawn like every other chart on the site (gridlines,
 * values on the y-axis, months on the x-axis) at card size.
 */
export function HomeKpiChart({
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
  // Month ticks come from the daily dates: weekly buckets rarely start on the
  // 1st, so a categorical axis over them would have no ticks at all.
  const xAxis = useMemo(
    () => ({
      ...getXAxisProps(dailyData),
      type: 'number' as const,
      domain: ['dataMin', 'dataMax'],
      height: 18,
      tickMargin: 3,
    }),
    [dailyData],
  )
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
    <div className={cn('relative h-40', className)}>
      <div className={cn(FILL_HEIGHT_CLASS, TICK_SIZE_CLASS)}>
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
            margin={{ top: 14, right: 1, bottom: 0, left: 1 }}
          >
            <defs>
              <PinkFillGradientDef id={fillId} />
            </defs>
            <Area
              dataKey="value"
              // A weekly series has few enough points to show its corners.
              type={weeklyAverage ? 'monotone' : 'linear'}
              stroke={STROKE}
              fill={`url(#${fillId})`}
              fillOpacity={1}
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
              activeDot={{ r: 3, stroke: '#fff', strokeWidth: 1, fill: STROKE }}
            />
            <ChartCommonComponents
              data={data}
              isLoading={false}
              xAxis={xAxis}
              yAxis={{ tickFormatter: formatValue, dy: -8 }}
              syncedUntil={undefined}
            />
            <ChartTooltip
              content={
                <KpiChartTooltip
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

/**
 * Seven-day buckets counted back from the latest day, so the last point is
 * the latest full week. Each is stamped with its first day and holds the mean
 * of the days that have data.
 */
function toWeeklyAverages(
  data: HomeKpiChartDataPoint[],
): HomeKpiChartDataPoint[] {
  const weeks: HomeKpiChartDataPoint[] = []
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

function KpiChartTooltip({
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
  const breakdown = (entry.payload as HomeKpiChartDataPoint | undefined)
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
