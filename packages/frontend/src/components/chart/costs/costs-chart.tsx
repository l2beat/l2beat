import type { Milestone } from '@l2beat/config'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import { formatCostValue } from '~/app/(side-nav)/scaling/costs/_utils/format-cost-value'
import type { ChartConfig } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/chart'
import { DEFAULT_ACTIVE_DOT } from '~/components/core/chart/utils/active-dot'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsResolution } from '~/server/features/scaling/costs/utils/range'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { formatNumber } from '~/utils/number-format/format-number'

const chartConfig = {
  calldata: {
    label: 'Calldata',
    color: 'hsl(var(--chart-costs-calldata))',
  },
  blobs: {
    label: 'Blobs',
    color: 'hsl(var(--chart-costs-blobs))',
  },
  compute: {
    label: 'Compute',
    color: 'hsl(var(--chart-costs-compute))',
  },
  overhead: {
    label: 'Overhead',
    color: 'hsl(var(--chart-costs-overhead))',
  },
} satisfies ChartConfig

interface CostsChartDataPoint {
  timestamp: number
  calldata: number
  blobs: number | undefined
  compute: number
  overhead: number
}

interface Props {
  data: CostsChartDataPoint[] | undefined
  unit: CostsUnit
  isLoading: boolean
  milestones: Milestone[]
  resolution: CostsResolution
  className?: string
}

export function CostsChart({
  data,
  unit,
  isLoading,
  milestones,
  className,
  resolution,
}: Props) {
  return (
    <ChartContainer
      data={data}
      config={chartConfig}
      isLoading={isLoading}
      milestones={milestones}
      className={className}
    >
      <AreaChart data={data} margin={{ top: 20 }}>
        <ChartTooltip
          content={<CustomTooltip unit={unit} resolution={resolution} />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="calldata"
          stroke="var(--color-calldata)"
          fill="var(--color-calldata)"
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
        <Area
          dataKey="blobs"
          stroke="var(--color-blobs)"
          fill="var(--color-blobs)"
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
        <Area
          dataKey="compute"
          stroke="var(--color-compute)"
          fill="var(--color-compute)"
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
        <Area
          dataKey="overhead"
          stroke="var(--color-overhead)"
          fill="var(--color-overhead)"
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          dot={false}
          isAnimationActive={false}
          activeDot={DEFAULT_ACTIVE_DOT}
        />

        {getCommonChartComponents({
          chartData: data,
          yAxis: {
            tickFormatter: (value: number) =>
              unit === 'gas'
                ? formatNumber(value)
                : formatCurrency(value, unit),
          },
        })}
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
  const total = payload.reduce((acc, curr) => acc + (curr?.value ?? 0), 0)
  return (
    <div className={tooltipContentVariants()}>
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
          {payload.map((entry) => {
            if (entry.value === undefined) return null
            const config = chartConfig[entry.name as keyof typeof chartConfig]
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-1"
              >
                <span className="flex items-center gap-1">
                  <div
                    role="img"
                    aria-label="Square icon"
                    className="size-3 rounded"
                    style={{
                      backgroundColor: config.color,
                    }}
                  />
                  <span className="w-20 leading-none sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <span className="whitespace-nowrap font-medium">
                  {formatCostValue(entry.value, unit, 'total')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
