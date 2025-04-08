'use client'
import type { Stage } from '@l2beat/config'
import type { TooltipProps } from 'recharts'
import { Label, Pie, PieChart } from 'recharts'
import { StageBadge } from '~/components/badge/stage-badge'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartTooltip,
  ChartTooltipWrapper,
  SimpleChartContainer,
  useChart,
} from '~/components/core/chart/chart'
import type { TvsByStage } from '~/server/features/ecosystems/get-tvs-by-stage'
import { formatPercent } from '~/utils/calculate-percentage-change'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

const chartMeta = {
  stage0: {
    label: 'Stage 0',
    color: '#F94A24',
    indicatorType: {
      shape: 'square',
    },
  },
  stage1: {
    label: 'Stage 1',
    color: '#FFC61B',
    indicatorType: {
      shape: 'square',
    },
  },
  stage2: {
    label: 'Stage 2',
    color: '#125D19',
    indicatorType: {
      shape: 'square',
    },
  },
} satisfies ChartMeta

export function EcosystemTvsByStage({
  tvsByStage,
  className,
}: {
  tvsByStage: TvsByStage
  className?: string
}) {
  const chartData = [
    {
      stage: 'stage0',
      tvs: tvsByStage['Stage 0'],
      fill: '#F94A24',
    },
    {
      stage: 'stage1',
      tvs: tvsByStage['Stage 1'],
      fill: '#FFC61B',
    },
    {
      stage: 'stage2',
      tvs: tvsByStage['Stage 2'],
      fill: '#125D19',
    },
  ]

  const totalTvs = Object.values(tvsByStage).reduce((acc, tvs) => acc + tvs, 0)

  return (
    <EcosystemWidget className={className}>
      <EcosystemWidgetTitle>TVS breakdown by stage</EcosystemWidgetTitle>
      <div className="flex items-center justify-around">
        <div>
          {Object.entries(tvsByStage).map(([stage, tvs]) => (
            <div key={stage} className="flex gap-2">
              <StageBadge stage={stage as Stage} isAppchain={false} />
              <div className="text-xs font-medium leading-[28px] text-secondary">
                {formatPercent(tvs / totalTvs)}
              </div>
            </div>
          ))}
        </div>
        <SimpleChartContainer
          meta={chartMeta}
          className="aspect-square h-[140px] min-h-[140px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<CustomTooltip />} />

            <Pie
              data={chartData}
              dataKey="tvs"
              nameKey="stage"
              isAnimationActive={false}
              innerRadius={35}
              outerRadius={70}
              paddingAngle={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-secondary text-2xs font-medium"
                        >
                          Stages
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </SimpleChartContainer>
      </div>
    </EcosystemWidget>
  )
}

export function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  const { meta } = useChart()
  if (!active || !payload) return null
  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-28 flex-col gap-1">
        {payload.map((entry) => {
          if (entry.value === undefined) return null
          const config = meta[entry.name!]!
          return (
            <div
              key={entry.name}
              className="flex items-center justify-between gap-x-3"
            >
              <span className="w-20 whitespace-nowrap leading-none sm:w-fit">
                {config.label}
              </span>
              <span className="whitespace-nowrap font-medium leading-none">
                {formatCurrency(entry.value, 'usd')}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
