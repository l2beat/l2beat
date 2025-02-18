'use client'
import type { Milestone } from '@l2beat/config'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/chart'
import {
  RollupsFillGradientDef,
  RollupsStrokeGradientDef,
} from '~/components/core/chart/defs/rollups-gradient-def'
import { DEFAULT_ACTIVE_DOT } from '~/components/core/chart/utils/active-dot'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
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
  milestones: Milestone[] | undefined
}

const chartMeta = {
  value: {
    color: 'hsl(var(--chart-rollups))',
  },
} satisfies ChartMeta

export function TvsChart({ data, unit, isLoading, milestones }: Props) {
  return (
    <ChartContainer
      meta={chartMeta}
      data={data}
      isLoading={isLoading}
      milestones={milestones}
    >
      <AreaChart data={data} accessibilityLayer margin={{ top: 20 }}>
        <defs>
          <RollupsFillGradientDef id="fill" />
          <RollupsStrokeGradientDef id="stroke" />
        </defs>
        <ChartTooltip content={<CustomTooltip unit={unit} />} />
        <Area
          dataKey="value"
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
  const { meta } = useChart()
  if (!active || !payload || typeof label !== 'number') return null
  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-28 flex-col gap-1">
        <div>{formatTimestamp(label, { longMonthName: true })}</div>
        <div>
          {payload.map((entry) => {
            if (entry.value === undefined) return null
            const config = meta[entry.name!]!
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
                    {unit.toUpperCase()}
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
