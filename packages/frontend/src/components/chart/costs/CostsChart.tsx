import type { Milestone } from '@l2beat/config'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart, ReferenceArea } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { NotSyncedPatternDef } from '~/components/core/chart/defs/NotSyncedPatternDef'
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
} satisfies ChartMeta

interface CostsChartDataPoint {
  timestamp: number
  calldata: number | null
  blobs: number | null
  compute: number | null
  overhead: number | null
}

interface Props {
  data: CostsChartDataPoint[] | undefined
  lastValidTimestamp: number | undefined
  unit: CostsUnit
  isLoading: boolean
  milestones: Milestone[]
  range: CostsTimeRange
  className?: string
  tickCount?: number
}

export function CostsChart({
  data,
  lastValidTimestamp,
  unit,
  isLoading,
  milestones,
  className,
  range,
  tickCount,
}: Props) {
  const resolution = rangeToResolution(range)

  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={milestones}
      className={className}
    >
      <AreaChart data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent reverse />} />
        <Area
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
          dataKey="compute"
          fill={chartMeta.compute.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
        <Area
          dataKey="blobs"
          fill={chartMeta.blobs.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
        <Area
          dataKey="calldata"
          fill={chartMeta.calldata.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          dot={false}
          isAnimationActive={false}
        />

        {lastValidTimestamp && (
          <ReferenceArea x1={lastValidTimestamp} fill="url(#not-synced-fill)" />
        )}

        {getCommonChartComponents({
          data,
          isLoading,
          yAxis: {
            tickFormatter: (value: number) =>
              unit === 'gas'
                ? formatNumber(value)
                : formatCurrency(value, unit),
            tickCount,
          },
        })}
        <ChartTooltip
          content={<CustomTooltip unit={unit} resolution={resolution} />}
        />
        <defs>
          <NotSyncedPatternDef />
        </defs>
      </AreaChart>
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
  const hasPostedAndNotSynced =
    dataKeys.includes('posted') && dataKeys.includes('notSyncedPosted')
  const filteredPayload = payload.filter(
    (p) => !hasPostedAndNotSynced || p.name !== 'notSyncedPosted',
  )
  const reversedPayload = [...filteredPayload].reverse()
  const total = payload.reduce((acc, curr) => {
    if (curr.name === 'posted' || curr.name === 'notSyncedPosted') {
      return acc
    }
    return acc + (curr?.value ?? 0)
  }, 0)
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
            {formatCostValue(total, unit, 'total')}
          </span>
        </div>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {reversedPayload.map((entry) => {
            if (entry.value === undefined) return null
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
                  {entry.name === 'posted' || entry.name === 'notSyncedPosted'
                    ? formatBytes(entry.value)
                    : formatCostValue(entry.value, unit, 'total')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
