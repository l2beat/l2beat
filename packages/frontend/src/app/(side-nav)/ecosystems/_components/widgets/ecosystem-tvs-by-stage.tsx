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
import { ChartDataIndicator } from '~/components/core/chart/chart-data-indicator'
import { CssVariables } from '~/components/css-variables'
import { useBreakpoint } from '~/hooks/use-breakpoint'
import type { TvsByStage } from '~/server/features/ecosystems/get-tvs-by-stage'
import { formatPercent } from '~/utils/calculate-percentage-change'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'
import { assert } from '@l2beat/shared-pure'

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
  notApplicable: {
    label: 'N/A',
    color: 'var(--not-applicable)',
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
  const breakpoint = useBreakpoint()

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
    {
      stage: 'notApplicable',
      tvs: tvsByStage.NotApplicable,
      fill: 'var(--not-applicable)',
    },
  ]

  const totalTvs = Object.values(tvsByStage).reduce((acc, tvs) => acc + tvs, 0)

  return (
    <EcosystemWidget className={className}>
      <CssVariables
        variables={{
          'not-applicable': {
            light: '#B4C7D5',
            dark: '#3D4361',
          },
        }}
      />
      <EcosystemWidgetTitle className="xs:hidden">
        TVS by stage
      </EcosystemWidgetTitle>
      <EcosystemWidgetTitle className="max-xs:hidden">
        TVS breakdown by stage
      </EcosystemWidgetTitle>
      <div className="flex items-center justify-around">
        <div>
          {Object.entries(tvsByStage).map(([stage, tvs]) => {
            if (stage === 'NotApplicable' && tvs === 0) return null
            return (
              <div key={stage} className="flex gap-2">
                <StageBadge stage={stage as Stage} isAppchain={false} />
                <div className="text-xs font-medium leading-[28px] text-secondary">
                  {formatPercent(tvs / totalTvs)}
                </div>
              </div>
            )
          })}
        </div>
        <SimpleChartContainer
          meta={chartMeta}
          className="aspect-square h-[116px] min-h-[116px] xs:h-[140px] xs:min-h-[140px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip />}
              position={breakpoint === 'xs' ? { x: -22, y: -46 } : undefined}
            />
            <Pie
              className={className}
              data={chartData}
              dataKey="tvs"
              nameKey="stage"
              isAnimationActive={false}
              innerRadius={breakpoint === 'xs' ? 24 : 35}
              outerRadius={breakpoint === 'xs' ? 58 : 70}
              paddingAngle={2}
            >
              <Label
                content={() => {
                  return (
                    <text x="50%" y="50%" textAnchor="middle">
                      <tspan
                        x="50%"
                        y="50%"
                        className="fill-secondary text-2xs font-medium leading-none"
                        dy={5}
                      >
                        Stages
                      </tspan>
                    </text>
                  )
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
      <div className="flex w-32 flex-col gap-1">
        {payload.map((entry) => {
          if (entry.name === undefined || entry.value === undefined) return null
          const config = meta[entry.name]
          assert(config, 'No config')

          return (
            <div
              key={entry.name}
              className="flex items-center justify-between gap-x-3"
            >
              <span className="flex items-center gap-1">
                <ChartDataIndicator
                  backgroundColor={config.color}
                  type={config.indicatorType}
                />
                <span className="whitespace-nowrap leading-none sm:w-fit">
                  {config.label}
                </span>
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
