'use client'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/chart'
import { ChartDataIndicator } from '~/components/core/chart/chart-data-indicator'
import { CustomFillGradientDef } from '~/components/core/chart/defs/custom-gradient-def'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import type { EcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { formatTimestamp } from '~/utils/dates'
import { EcosystemWidget } from '../widgets/ecosystem-widget'
import { EcosystemChartTimeRange } from './ecosystems-chart-time-range'
import { EcosystemsMarketShare } from './ecosystems-market-share'

interface Props {
  entries: EcosystemEntry['projects']
  allScalingProjectsCount: number
}

export function EcosystemsProjectsChart({
  entries,
  allScalingProjectsCount,
}: Props) {
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
  const data = getChartData(entries, allScalingProjectsCount)

  const range = getChartRange(data)!
  const stats = getStats(data, allScalingProjectsCount)
  return (
    <EcosystemWidget>
      <Header range={range} stats={stats} />
      <ChartContainer
        meta={chartMeta}
        data={data}
        className="!h-[110px] !min-h-[110px]"
      >
        <AreaChart data={data} accessibilityLayer margin={{ top: 20 }}>
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
            data,
            isLoading: false,
            yAxis: {
              tickCount: 2,
            },
          })}
          <ChartTooltip content={<CustomTooltip />} />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </EcosystemWidget>
  )
}

function Header({
  range,
  stats,
}: {
  range: [number, number]
  stats: { projectCount: number; domination: number }
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div>
        <div className="text-xl font-bold">Projects count</div>
        <EcosystemChartTimeRange range={range} />
      </div>
      <div className="text-right">
        <div className="text-xl font-bold">{stats.projectCount} Projects</div>
        <EcosystemsMarketShare marketShare={stats.domination} />
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

function getStats(
  data: { projectCount: number }[],
  allScalingProjectsCount: number,
) {
  const total = data.at(-1)?.projectCount
  assert(total !== undefined, 'No data')

  return {
    projectCount: total,
    domination: total / allScalingProjectsCount,
  }
}

function getChartData(
  entries: EcosystemEntry['projects'],
  allScalingProjectsCount: number,
) {
  const minTimestamp = Math.min(
    ...entries.map((e) => e.ecosystemInfo.sinceTimestamp),
  )
  const now = UnixTime.now()

  const timestamps = generateTimestamps([minTimestamp, now], 'daily')

  const data = timestamps.map((timestamp) => {
    const projects = entries.filter(
      (e) => e.ecosystemInfo.sinceTimestamp <= timestamp,
    )
    return {
      timestamp,
      projectCount: projects.length,
      domination: projects.length / allScalingProjectsCount,
    }
  })

  return data
}
