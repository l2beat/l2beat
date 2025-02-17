'use client'

import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'

import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
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
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'
import type { ChartUnit } from '../../types'

export interface StackedTvsChartDataPoint {
  timestamp: number
  native: number
  canonical: number
  external: number
}

interface Props {
  data: StackedTvsChartDataPoint[] | undefined
  milestones: Record<number, Milestone>
  unit: ChartUnit
  isLoading: boolean
  className?: string
}

const chartConfig = {
  native: {
    label: 'Native',
    color: 'hsl(var(--chart-native))',
  },
  external: {
    label: 'External',
    color: 'hsl(var(--chart-external))',
  },
  canonical: {
    label: 'Canonical',
    color: 'hsl(var(--chart-canonical))',
  },
} satisfies ChartConfig

export function StackedTvsChart({
  data,
  milestones,
  unit,
  isLoading,
  className,
}: Props) {
  const milestonesData = useMemo(
    () =>
      data?.map((point) => ({
        timestamp: point.timestamp,
        milestone: milestones[point.timestamp],
      })),
    [data, milestones],
  )

  return (
    <ChartContainer
      config={chartConfig}
      isLoading={isLoading}
      dataWithMilestones={milestonesData}
      className={className}
    >
      <AreaChart data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent />} />
        <ChartTooltip content={<CustomTooltip />} />
        <Area
          dataKey="native"
          type="natural"
          fill="var(--color-native)"
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          isAnimationActive={false}
          activeDot={false}
        />
        <Area
          dataKey="external"
          type="natural"
          fill="var(--color-external)"
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          isAnimationActive={false}
          activeDot={false}
        />
        <Area
          dataKey="canonical"
          type="natural"
          fill="var(--color-canonical)"
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
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
}: TooltipProps<number, string>) {
  if (!active || !payload || typeof label !== 'number') return null
  const total = payload.reduce((acc, curr) => acc + (curr?.value ?? 0), 0)
  return (
    <div className={tooltipContentVariants()}>
      <div className="flex w-36 flex-col gap-1 xs:!w-52">
        <div>
          {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
        </div>
        <div className="flex w-full items-center justify-between gap-2 text-xs text-secondary">
          <span className="[@media(min-width:600px)]:hidden">Total</span>
          <span className="hidden [@media(min-width:600px)]:inline">
            Total value secured
          </span>
          <span className="text-primary">{formatCurrency(total, 'usd')}</span>
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
                  {formatCurrency(entry.value, 'usd')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
