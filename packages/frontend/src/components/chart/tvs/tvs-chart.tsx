'use client'
import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import type { ChartConfig } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartTooltip,
  useChart,
} from '~/components/core/chart/chart'
import {
  RollupsFillGradientDef,
  RollupsStrokeGradientDef,
} from '~/components/core/chart/defs/rollups-gradient-def'
import { DEFAULT_ACTIVE_DOT } from '~/components/core/chart/utils/active-dot'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'
import type { ChartUnit } from '../types'

export interface TvsChartDataPoint {
  timestamp: number
  value: number
}

interface Props {
  data: TvsChartDataPoint[] | undefined
  unit: ChartUnit
  isLoading: boolean
  milestones: Record<number, Milestone> | undefined
}

export function TvsChart({ data, unit, isLoading, milestones }: Props) {
  const chartConfig = {
    value: {
      label: unit.toUpperCase(),
      color: 'hsl(var(--indicator-rollups))',
    },
  } satisfies ChartConfig

  const milestonesData = useMemo(() => {
    if (!milestones) return undefined
    return data?.map((point) => ({
      timestamp: point.timestamp,
      milestone: milestones[point.timestamp],
    }))
  }, [data, milestones])

  return (
    <ChartContainer
      config={chartConfig}
      isLoading={isLoading}
      dataWithMilestones={milestonesData}
    >
      <AreaChart data={data} accessibilityLayer margin={{ top: 20 }}>
        <defs>
          <RollupsFillGradientDef id="fill" />
          <RollupsStrokeGradientDef id="stroke" />
        </defs>
        <ChartTooltip content={<CustomTooltip unit={unit} />} />
        <Area
          dataKey="value"
          type="natural"
          fill="url(#fill)"
          fillOpacity={1}
          stroke="url(#stroke)"
          strokeWidth={2}
          isAnimationActive={false}
          activeDot={DEFAULT_ACTIVE_DOT}
        />
        {getCommonChartComponents({
          chartData: data,
          yAxis: {
            tickFormatter: (value: number) => formatCurrency(value, unit),
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
}: TooltipProps<number, string> & { unit: ChartUnit }) {
  const { config: chartConfig } = useChart()
  if (!active || !payload || typeof label !== 'number') return null
  return (
    <div className={tooltipContentVariants()}>
      <div className="flex min-w-28 flex-col gap-1">
        <div>{formatTimestamp(label, { longMonthName: true })}</div>
        <div>
          {payload.map((entry) => {
            if (entry.value === undefined) return null
            const config = chartConfig[entry.name!]!
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
                  {formatCurrency(entry.value, unit)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
