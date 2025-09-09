import type { Milestone } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { Area, AreaChart, type TooltipProps } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartMeta,
  type ChartProject,
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
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

type TokenChartDataPoint = {
  timestamp: number
  value: number | null
}

interface Props {
  data: TokenChartDataPoint[] | undefined
  project: ChartProject
  syncedUntil: number | undefined
  isLoading: boolean
  milestones: Milestone[]
  token: ProjectToken
  className?: string
}

export function TokenChart({
  data,
  project,
  isLoading,
  milestones,
  token,
  syncedUntil,
  className,
}: Props) {
  const chartMeta = useMemo(
    () => ({
      value: {
        label: token.symbol,
        color: 'var(--chart-pink)',
        indicatorType: {
          shape: 'line',
        },
      },
    }),
    [token.symbol],
  ) satisfies ChartMeta

  return (
    <ChartContainer
      className={className}
      meta={chartMeta}
      data={data}
      isLoading={isLoading}
      milestones={milestones}
      project={project}
    >
      <AreaChart data={data} margin={{ top: 20 }}>
        <defs>
          <PinkFillGradientDef id="fill" />
          <PinkStrokeGradientDef id="stroke" />
        </defs>
        <ChartLegend content={<ChartLegendContent />} />
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
            tickFormatter: (value: number) => formatCurrency(value, 'usd'),
            tickCount: 4,
          },
          syncedUntil,
        })}
        <ChartTooltip filterNull={false} content={<CustomTooltip />} />
      </AreaChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const { meta } = useChart()
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-48 flex-col gap-1">
        <div className="mb-1 font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
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
                    ? formatCurrency(entry.value, 'usd')
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
