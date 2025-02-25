import type { Milestone } from '@l2beat/config'
import type { TooltipProps } from 'recharts'
import { Area, ComposedChart, Line, YAxis } from 'recharts'
import { formatCostValue } from '~/app/(side-nav)/scaling/costs/_utils/format-cost-value'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/chart'
import { ChartDataIndicator } from '~/components/core/chart/chart-data-indicator'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsResolution } from '~/server/features/scaling/costs/utils/range'
import { formatTimestamp } from '~/utils/dates'
import { formatBytes } from '~/utils/number-format/format-bytes'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { formatNumber } from '~/utils/number-format/format-number'

const chartMeta = {
  calldata: {
    label: 'Calldata',
    color: 'hsl(var(--chart-costs-calldata))',
    indicatorType: { shape: 'square' },
  },
  blobs: {
    label: 'Blobs',
    color: 'hsl(var(--chart-costs-blobs))',
    indicatorType: { shape: 'square' },
  },
  compute: {
    label: 'Compute',
    color: 'hsl(var(--chart-costs-compute))',
    indicatorType: { shape: 'square' },
  },
  overhead: {
    label: 'Overhead',
    color: 'hsl(var(--chart-costs-overhead))',
    indicatorType: { shape: 'square' },
  },
  posted: {
    label: 'Data posted',
    color: 'hsl(var(--chart-da-avail))',
    indicatorType: { shape: 'line' },
  },
} satisfies ChartMeta

interface CostsChartDataPoint {
  timestamp: number
  calldata: number
  blobs: number | undefined
  compute: number
  overhead: number
  posted?: number | null
}

interface Props {
  data: CostsChartDataPoint[] | undefined
  unit: CostsUnit
  isLoading: boolean
  milestones: Milestone[]
  resolution: CostsResolution
  showDataPosted: boolean
  className?: string
}

export function CostsChart({
  data,
  unit,
  isLoading,
  milestones,
  className,
  resolution,
  showDataPosted,
}: Props) {
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
            type={resolution === 'hourly' ? 'stepAfter' : undefined}
            dot={false}
            isAnimationActive={false}
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
            tickCount={3}
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
          },
        })}
        <ChartTooltip
          content={<CustomTooltip unit={unit} resolution={resolution} />}
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
  const reversedPayload = [...payload].reverse()
  const total = payload.reduce((acc, curr) => {
    if (curr.name === 'posted') {
      return acc
    }
    return acc + (curr?.value ?? 0)
  }, 0)
  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-40 flex-col gap-1">
        <div>
          {formatTimestamp(label, {
            mode: resolution === 'daily' ? 'date' : 'datetime',
            longMonthName: resolution === 'daily',
          })}
        </div>
        <div className="flex w-full items-center justify-between gap-2 text-xs text-secondary">
          <span>Total</span>
          <span className="whitespace-nowrap font-bold tabular-nums text-primary">
            {formatCostValue(total, unit, 'total')}
          </span>
        </div>
        <HorizontalSeparator />
        <div>
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
                  <span className="w-20 leading-none sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <span className="whitespace-nowrap font-medium">
                  {entry.name === 'posted'
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
