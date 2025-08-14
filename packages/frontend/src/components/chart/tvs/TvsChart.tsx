import type { Milestone } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { ChartUnit } from '../types'

export interface TvsChartDataPoint {
  timestamp: number
  value: number | null
}

interface Props {
  data: TvsChartDataPoint[] | undefined
  unit: ChartUnit
  isLoading: boolean
  syncedUntil: number | undefined
  milestones: Milestone[] | undefined
  tickCount?: number
}

export function TvsChart({
  data,
  unit,
  isLoading,
  milestones,
  syncedUntil,
  tickCount,
}: Props) {
  const chartMeta = {
    value: {
      color: 'var(--chart-pink)',
      indicatorType: { shape: 'line' },
      label: unit.toUpperCase(),
    },
  } satisfies ChartMeta

  return (
    <ChartContainer
      meta={chartMeta}
      data={data}
      isLoading={isLoading}
      milestones={milestones}
    >
      <AreaChart data={data} accessibilityLayer margin={{ top: 20 }}>
        <defs>
          <PinkFillGradientDef id="fill" />
          <PinkStrokeGradientDef id="stroke" />
        </defs>
        <Area
          dataKey="value"
          fill="url(#fill)"
          fillOpacity={1}
          stroke="url(#stroke)"
          strokeWidth={2}
          isAnimationActive={false}
        />
        {getCommonChartComponents({
          data,
          isLoading,
          yAxis: {
            tickFormatter: (value: number) => formatCurrency(value, unit),
            tickCount,
          },
          syncedUntil,
        })}
        <ChartTooltip
          filterNull={false}
          content={<TvsCustomTooltip unit={unit} />}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function TvsCustomTooltip({
  active,
  payload,
  label,
  unit,
}: TooltipProps<number, string> & { unit: ChartUnit }) {
  const { meta } = useChart()
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-28 flex-col">
        <div className="mb-3 font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, {
            longMonthName: true,
            mode: 'datetime',
          })}
        </div>
        <div className="flex flex-col gap-2">
          {payload.map((entry) => {
            if (entry.name === undefined) return null
            const config = meta[entry.name]
            assert(config, 'No config')

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
                    ? formatCurrency(entry.value, unit)
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
