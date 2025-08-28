import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, ComposedChart, Line, YAxis } from 'recharts'
import type { ChartMeta, ChartProject } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatCostValue } from '~/pages/scaling/costs/utils/formatCostValue'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsResolution } from '~/server/features/scaling/costs/utils/range'
import {
  type CostsTimeRange,
  rangeToResolution,
} from '~/server/features/scaling/costs/utils/range'
import { formatRange } from '~/utils/dates'
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
  hasPostedData: boolean
  hasBlobs: boolean
  project?: ChartProject
  tickCount?: number
  className?: string
}

const hiddenDataKeys = ['posted'] as const

export function CostsChart({
  project,
  data,
  syncedUntil,
  unit,
  isLoading,
  milestones,
  className,
  range,
  tickCount,
  hasPostedData,
  hasBlobs,
}: Props) {
  const chartMeta = useMemo(
    () => ({
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
    }),
    [hasBlobs],
  ) satisfies ChartMeta

  const { dataKeys, toggleDataKey } = useChartDataKeys(
    chartMeta,
    hiddenDataKeys,
  )

  const resolution = rangeToResolution({ type: range })

  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={milestones}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
      className={className}
      project={project}
    >
      <ComposedChart data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent />} />
        {hasPostedData && (
          <Line
            yAxisId="right"
            dataKey="posted"
            strokeWidth={2}
            stroke={chartMeta.posted.color}
            isAnimationActive={false}
            dot={false}
            hide={!dataKeys.includes('posted')}
          />
        )}
        <Area
          yAxisId="left"
          dataKey="overhead"
          fill={chartMeta.overhead.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          activeDot={
            !dataKeys.includes('calldata') &&
            (!chartMeta.blobs || !dataKeys.includes('blobs')) &&
            !dataKeys.includes('compute')
          }
          isAnimationActive={false}
          hide={!dataKeys.includes('overhead')}
        />
        <Area
          yAxisId="left"
          dataKey="compute"
          fill={chartMeta.compute.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          activeDot={
            !dataKeys.includes('calldata') &&
            (!chartMeta.blobs || !dataKeys.includes('blobs'))
          }
          isAnimationActive={false}
          hide={!dataKeys.includes('compute')}
        />
        {chartMeta.blobs && (
          <Area
            yAxisId="left"
            dataKey="blobs"
            fill={chartMeta.blobs.color}
            fillOpacity={1}
            strokeWidth={0}
            stackId="a"
            activeDot={!dataKeys.includes('calldata')}
            isAnimationActive={false}
            hide={!dataKeys.includes('blobs')}
          />
        )}
        <Area
          yAxisId="left"
          dataKey="calldata"
          fill={chartMeta.calldata.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          isAnimationActive={false}
          hide={!dataKeys.includes('calldata')}
        />

        {hasPostedData && (
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
            hide={!dataKeys.includes('posted')}
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

  const actualPayload = [...payload].reverse().filter((p) => !p.hide)
  const total = actualPayload.reduce<number | null>((acc, curr) => {
    if (curr.name === 'posted') {
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
        <div className="font-medium text-label-value-14 text-secondary">
          {formatRange(
            label,
            label +
              (resolution === 'daily'
                ? UnixTime.DAY
                : resolution === 'sixHourly'
                  ? UnixTime.HOUR * 6
                  : UnixTime.HOUR),
          )}
        </div>
        {actualPayload.filter((p) => p.name !== 'posted').length > 1 && (
          <>
            <div className="mt-3 flex w-full items-center justify-between gap-2 text-heading-16">
              <span>Total</span>
              <span className="whitespace-nowrap text-primary tabular-nums">
                {total !== null
                  ? formatCostValue(total, unit, 'total')
                  : 'No data'}
              </span>
            </div>
            <HorizontalSeparator className="mt-1.5" />
          </>
        )}
        <div className="mt-2 flex flex-col gap-2">
          {actualPayload.map((entry) => {
            if (entry.type === 'none' || entry.hide) return null
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
