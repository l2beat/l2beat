'use client'

import type { Milestone } from '@l2beat/config'

import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
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
  milestones: Milestone[]
  unit: ChartUnit
  isLoading: boolean
  className?: string
}

const chartMeta = {
  native: {
    label: 'Native',
    color: 'hsl(var(--chart-tvs-native))',
    indicatorType: { shape: 'square' },
  },
  external: {
    label: 'External',
    color: 'hsl(var(--chart-tvs-external))',
    indicatorType: { shape: 'square' },
  },
  canonical: {
    label: 'Canonical',
    color: 'hsl(var(--chart-tvs-canonical))',
    indicatorType: { shape: 'square' },
  },
} satisfies ChartMeta

export function StackedTvsChart({
  data,
  milestones,
  unit,
  isLoading,
  className,
}: Props) {
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
          dataKey="native"
          fill={chartMeta.native.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          isAnimationActive={false}
          activeDot={false}
        />
        <Area
          dataKey="external"
          fill={chartMeta.external.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          isAnimationActive={false}
          activeDot={false}
        />
        <Area
          dataKey="canonical"
          fill={chartMeta.canonical.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          isAnimationActive={false}
        />
        {getCommonChartComponents({
          data,
          yAxis: {
            tickFormatter: (value: number) => formatCurrency(value, unit),
          },
          isLoading,
        })}
        <ChartTooltip content={<CustomTooltip unit={unit} />} />
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
  if (!active || !payload || typeof label !== 'number') return null
  const total = payload.reduce((acc, curr) => acc + (curr?.value ?? 0), 0)
  const reversedPayload = [...payload].reverse()
  return (
    <ChartTooltipWrapper>
      <div className="flex w-36 flex-col gap-1 xs:!w-52">
        <div>
          {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
        </div>
        <div className="flex w-full items-center justify-between gap-2 text-xs text-secondary">
          <span className="[@media(min-width:600px)]:hidden">Total</span>
          <span className="hidden [@media(min-width:600px)]:inline">
            Total value secured
          </span>
          <span className="text-primary">{formatCurrency(total, unit)}</span>
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
                  {formatCurrency(entry.value, unit)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
