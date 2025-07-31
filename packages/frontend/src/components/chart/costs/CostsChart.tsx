import type { Milestone } from '@l2beat/config'
import type { TooltipProps } from 'recharts'
import { Area, ComposedChart, Line, YAxis } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatCostValue } from '~/pages/scaling/costs/utils/formatCostValue'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsResolution } from '~/server/features/scaling/costs/utils/range'
import {
  type CostsTimeRange,
  rangeToResolution,
} from '~/server/features/scaling/costs/utils/range'
import { formatTimestamp } from '~/utils/dates'
import { formatBytes } from '~/utils/number-format/formatBytes'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatNumber } from '~/utils/number-format/formatNumber'

const chartMeta = {
  calldata: {
    label: 'Calldata',
    color: 'var(--chart-stacked-blue)',
    indicatorType: { shape: 'square' },
  },
  blobs: {
    label: 'Blobs',
    color: 'var(--chart-stacked-yellow)',
    indicatorType: { shape: 'square' },
  },
  compute: {
    label: 'Compute',
    color: 'var(--chart-stacked-pink)',
    indicatorType: { shape: 'square' },
  },
  overhead: {
    label: 'Overhead',
    color: 'var(--chart-stacked-purple)',
    indicatorType: { shape: 'square' },
  },
  posted: {
    label: 'Data posted',
    color: 'var(--chart-emerald)',
    indicatorType: { shape: 'line' },
  },
  estimatedPosted: {
    label: 'Data posted (estimated)',
    color: 'var(--chart-emerald)',
    indicatorType: { shape: 'line', strokeDasharray: '3 3' },
  },
} satisfies ChartMeta

interface CostsChartDataPoint {
  timestamp: number
  calldata: number | null
  blobs: number | null
  compute: number | null
  overhead: number | null
  posted?: number | null
}

interface Props {
  data: CostsChartDataPoint[] | undefined
  syncedUntil: number | undefined
  unit: CostsUnit
  isLoading: boolean
  milestones: Milestone[]
  range: CostsTimeRange
  showDataPosted: boolean
  hasBlobs: boolean
  tickCount?: number
  className?: string
}

export function CostsChart({
  data,
  syncedUntil,
  unit,
  isLoading,
  milestones,
  className,
  range,
  showDataPosted,
  tickCount,
  hasBlobs,
}: Props) {
  const chartMeta = {
    calldata: {
      label: 'Calldata',
      color: 'var(--chart-stacked-blue)',
      indicatorType: { shape: 'square' },
    },
    ...(hasBlobs
      ? {
          blobs: {
            label: 'Blobs',
            color: 'var(--chart-stacked-yellow)',
            indicatorType: { shape: 'square' },
          },
        }
      : {}),
    compute: {
      label: 'Compute',
      color: 'var(--chart-stacked-pink)',
      indicatorType: { shape: 'square' },
    },
    overhead: {
      label: 'Overhead',
      color: 'var(--chart-stacked-purple)',
      indicatorType: { shape: 'square' },
    },
    posted: {
      label: 'Data posted',
      color: 'var(--chart-emerald)',
      indicatorType: { shape: 'line' },
    },
    estimatedPosted: {
      label: 'Data posted (estimated)',
      color: 'var(--chart-emerald)',
      indicatorType: { shape: 'line', strokeDasharray: '3 3' },
    },
  } satisfies ChartMeta

  const resolution = rangeToResolution({ type: range })

  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={milestones}
      className={className}
    >
      <ComposedChart data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent reverse />} />
        <Area
          yAxisId="left"
          dataKey="overhead"
          fill={chartMeta.overhead.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
        <Area
          yAxisId="left"
          dataKey="compute"
          fill={chartMeta.compute.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
        {chartMeta.blobs && (
          <Area
            yAxisId="left"
            dataKey="blobs"
            fill={chartMeta.blobs.color}
            fillOpacity={1}
            strokeWidth={0}
            stackId="a"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        )}
        <Area
          yAxisId="left"
          dataKey="calldata"
          fill={chartMeta.calldata.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          dot={false}
          isAnimationActive={false}
        />

        {showDataPosted && (
          <Line
            yAxisId="right"
            dataKey="posted"
            strokeWidth={2}
            stroke={chartMeta.posted.color}
            dot={false}
            isAnimationActive={false}
          />
        )}
        {showDataPosted && (
          <Line
            yAxisId="right"
            dataKey="estimatedPosted"
            strokeWidth={2}
            stroke={chartMeta.estimatedPosted.color}
            strokeDasharray={
              chartMeta.estimatedPosted.indicatorType.strokeDasharray
            }
            dot={false}
            isAnimationActive={false}
            legendType="none"
          />
        )}
        {showDataPosted && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value: number) => formatBytes(value)}
            tickLine={false}
            axisLine={false}
            mirror
            tickCount={tickCount ?? 3}
            dy={-10}
            tick={{
              width: 100,
            }}
          />
        )}

        {getCommonChartComponents({
          data,
          isLoading,
          yAxis: {
            yAxisId: 'left',
            tickFormatter: (value: number) =>
              unit === 'gas'
                ? formatNumber(value)
                : formatCurrency(value, unit),
            tickCount,
          },
          syncedUntil,
        })}
        <ChartTooltip
          content={<CustomTooltip unit={unit} resolution={resolution} />}
          filterNull={false}
        />
      </ComposedChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
  resolution,
}: TooltipProps<number, string> & {
  unit: CostsUnit
  resolution: CostsResolution
}) {
  if (!active || !payload || typeof label !== 'number') return null

  const dataKeys = payload.map((p) => p.dataKey)
  const hasPostedAndEstimated =
    dataKeys.includes('posted') && dataKeys.includes('estimatedPosted')
  const filteredPayload = payload.filter(
    (p) => !hasPostedAndEstimated || p.name !== 'estimatedPosted',
  )
  const reversedPayload = [...filteredPayload].reverse()
  const total = payload.reduce<number | null>((acc, curr) => {
    if (curr.name === 'posted' || curr.name === 'estimatedPosted') {
      return acc
    }
    if (curr.value === null || curr.value === undefined) {
      return acc
    }

    if (acc === null) {
      return curr?.value ?? null
    }

    return acc + curr.value
  }, null)
  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-44 flex-col">
        <div className="mb-3 font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, {
            mode: resolution === 'daily' ? 'date' : 'datetime',
            longMonthName: resolution === 'daily',
          })}
        </div>
        <div className="flex w-full items-center justify-between gap-2 text-heading-16">
          <span>Total</span>
          <span className="whitespace-nowrap text-primary tabular-nums">
            {total !== null ? formatCostValue(total, unit, 'total') : 'No data'}
          </span>
        </div>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {reversedPayload.map((entry) => {
            if (entry.type === 'none') return null
            const config = chartMeta[entry.name as keyof typeof chartMeta]
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-1"
              >
                <span className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <span className="whitespace-nowrap font-medium text-label-value-15">
                  {entry.value !== null && entry.value !== undefined
                    ? entry.name === 'posted' ||
                      entry.name === 'estimatedPosted'
                      ? formatBytes(entry.value)
                      : formatCostValue(entry.value, unit, 'total')
                    : 'No data'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
