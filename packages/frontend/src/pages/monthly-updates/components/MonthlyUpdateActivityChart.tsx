import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { useId, useMemo } from 'react'
import { AreaChart } from 'recharts'
import { ActivityCustomTooltip } from '~/components/chart/activity/ActivityChart'
import { Skeleton } from '~/components/core/Skeleton'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/Chart'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/EthereumGradientDef'
import { getCommonChartComponents } from '~/components/core/chart/utils/GetCommonChartComponents'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/GetStrokeOverFillAreaComponents'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EcosystemChartTimeRange } from '~/pages/ecosystems/project/components/charts/EcosystemsChartTimeRange'
import { EcosystemsMarketShare } from '~/pages/ecosystems/project/components/charts/EcosystemsMarketShare'
import { api } from '~/trpc/React'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'

export function MonthlyUpdateActivityChart({
  name,
  entries,
  allScalingProjectsUops,
  from,
  to,
}: {
  name: string
  entries: ProjectId[]
  allScalingProjectsUops: number
  from: UnixTime
  to: UnixTime
}) {
  const id = useId()
  const { data, isLoading } = api.activity.chart.useQuery({
    range: { type: 'custom', from, to },
    filter: {
      type: 'projects',
      projectIds: entries,
    },
  })

  const chartMeta = useMemo(() => {
    return {
      projects: {
        label: name,
        color: 'var(--ecosystem-primary)',
        indicatorType: {
          shape: 'line',
        },
      },
    } satisfies ChartMeta
  }, [name])

  const chartData = useMemo(
    () =>
      data?.data.map(([timestamp, _, __, projectsUops]) => {
        return {
          timestamp,
          projects: projectsUops / UnixTime.DAY,
        }
      }),
    [data?.data],
  )

  const stats = getStats(chartData, allScalingProjectsUops)
  const range = getChartRange(chartData)

  return (
    <PrimaryCard className="border border-divider">
      <Header range={range} stats={stats} />
      <ChartContainer
        data={chartData}
        meta={chartMeta}
        isLoading={isLoading}
        className="!h-44 !min-h-44"
      >
        <AreaChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
          <ChartLegend content={<ChartLegendContent />} />
          {getStrokeOverFillAreaComponents({
            data: compact([
              {
                dataKey: 'projects',
                stroke: 'var(--ecosystem-primary)',
                fill: `url(#${id})`,
              },
            ]),
          })}
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              tick: {
                width: 100,
              },
              scale: 'lin',
              unit: ' UOPS',
            },
          })}
          <ChartTooltip
            content={<ActivityCustomTooltip syncedUntil={undefined} />}
          />
          <defs>
            <CustomFillGradientDef
              id={id}
              colors={{
                primary: 'var(--ecosystem-primary)',
                secondary: 'var(--ecosystem-secondary)',
              }}
            />
            <EthereumFillGradientDef id="fillEthereum" />
            <EthereumStrokeGradientDef id="strokeEthereum" />
          </defs>
        </AreaChart>
      </ChartContainer>
    </PrimaryCard>
  )
}

function Header({
  range,
  stats,
}: {
  range: [number, number] | undefined
  stats: { latestUops: number; marketShare: number } | undefined
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div>
        <div className="font-bold text-xl">Activity</div>
        <div className="font-medium text-secondary text-xs">
          <EcosystemChartTimeRange range={range} />
        </div>
      </div>
      <div className="text-right">
        {stats?.latestUops !== undefined ? (
          <div className="font-bold text-xl">
            {formatActivityCount(stats.latestUops)} UOPS
          </div>
        ) : (
          <Skeleton className="my-[5px] ml-auto h-5 w-32" />
        )}
        <EcosystemsMarketShare marketShare={stats?.marketShare} />
      </div>
    </div>
  )
}

function getStats(
  chartData: { projects: number }[] | undefined,
  allScalingProjectsUops: number,
) {
  if (!chartData) {
    return undefined
  }
  const last = chartData.at(-1)
  if (!last) {
    return undefined
  }

  return {
    latestUops: last.projects,
    marketShare: last.projects / allScalingProjectsUops,
  }
}
