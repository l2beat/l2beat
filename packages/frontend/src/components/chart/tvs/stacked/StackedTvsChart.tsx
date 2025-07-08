import type { Milestone } from '@l2beat/config'

import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { getCommonChartComponents } from '~/components/core/chart/utils/GetCommonChartComponents'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
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
  canonical: {
    label: 'Canonical',
    color: 'hsl(var(--chart-stacked-purple))',
    indicatorType: { shape: 'square' },
  },
  native: {
    label: 'Native',
    color: 'hsl(var(--chart-stacked-pink))',
    indicatorType: { shape: 'square' },
  },
  external: {
    label: 'External',
    color: 'hsl(var(--chart-stacked-yellow))',
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
          dataKey="external"
          fill={chartMeta.external.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId="a"
          isAnimationActive={false}
          activeDot={false}
        />
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
      <div className="xs:!w-56 flex w-44 flex-col">
        <div className="mb-3 font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
        </div>
        <div className="flex w-full items-center justify-between gap-2 text-heading-16">
          <span className="[@media(min-width:600px)]:hidden">Total</span>
          <span className="hidden [@media(min-width:600px)]:inline">
            Total value secured
          </span>
          <span className="text-primary">{formatCurrency(total, unit)}</span>
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
