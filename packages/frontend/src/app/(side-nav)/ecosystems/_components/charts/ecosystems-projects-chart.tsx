'use client'
import { assert } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/chart'
import { ChartDataIndicator } from '~/components/core/chart/chart-data-indicator'
import { CustomFillGradientDef } from '~/components/core/chart/defs/custom-gradient-def'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import type { EcosystemProjectsCountData } from '~/server/features/ecosystems/get-ecosystem-projects-chart-data'
import { formatTimestamp } from '~/utils/dates'
import { EcosystemWidget } from '../widgets/ecosystem-widget'
import { EcosystemChartTimeRange } from './ecosystems-chart-time-range'
import { EcosystemsMarketShare } from './ecosystems-market-share'

interface Props {
  data: EcosystemProjectsCountData
  className?: string
}

export function EcosystemsProjectsChart({ data, className }: Props) {
  const chartMeta = useMemo(() => {
    return {
      projectCount: {
        color: 'var(--ecosystem-primary)',
        label: `Project count`,
        indicatorType: {
          shape: 'line',
        },
      },
    } satisfies ChartMeta
  }, [])
  const range = getChartRange(data.chart)!
  const total = data.chart.at(-1)?.projectCount
  assert(total !== undefined, 'No data')

  return (
    <EcosystemWidget className={className}>
      <Header
        range={range}
        projectCount={total}
        marketShare={data.marketShare}
      />
      <ChartContainer
        meta={chartMeta}
        data={data.chart}
        className="!h-[110px] !min-h-[110px]"
        logoClassName="bottom-[42px]"
      >
        <AreaChart data={data.chart} accessibilityLayer margin={{ top: 20 }}>
          <defs>
            <CustomFillGradientDef
              id="fill"
              colors={{
                primary: 'var(--ecosystem-primary)',
                secondary: 'var(--ecosystem-secondary)',
              }}
            />
          </defs>
          <Area
            dataKey="projectCount"
            fill="url(#fill)"
            fillOpacity={1}
            stroke="var(--ecosystem-primary)"
            strokeWidth={2}
            type="stepAfter"
            isAnimationActive={false}
          />
          {getCommonChartComponents({
            data: data.chart,
            isLoading: false,
            yAxis: {
              tickCount: 2,
            },
          })}
          <ChartTooltip content={<CustomTooltip />} />
        </AreaChart>
      </ChartContainer>
    </EcosystemWidget>
  )
}

function Header({
  range,
  projectCount,
  marketShare,
}: {
  range: [number, number]
  projectCount: number
  marketShare: number
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div>
        <div className="text-xl font-bold">Projects count</div>
        <EcosystemChartTimeRange range={range} />
      </div>
      <div className="text-right">
        <div className="text-xl font-bold">{projectCount} Projects</div>
        <EcosystemsMarketShare marketShare={marketShare} />
      </div>
    </div>
  )
}

export function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const { meta } = useChart()
  if (!active || !payload || typeof label !== 'number') return null
  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-28 flex-col gap-1">
        <div>
          {formatTimestamp(label, { longMonthName: true, mode: 'date' })}
        </div>
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
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 leading-none sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <span className="whitespace-nowrap font-medium">
                  {entry.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
