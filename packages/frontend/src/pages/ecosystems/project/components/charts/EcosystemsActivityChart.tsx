import { UnixTime } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { AreaChart } from 'recharts'
import { ActivityCustomTooltip } from '~/components/chart/activity/ActivityChart'
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
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/getStrokeOverFillAreaComponents'
import { Skeleton } from '~/components/core/Skeleton'
import { ActivityTimeRangeControls } from '~/pages/scaling/activity/components/ActivityTimeRangeControls'
import type {
  EcosystemEntry,
  EcosystemMilestone,
} from '~/server/features/ecosystems/getEcosystemEntry'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/React'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { EcosystemWidget } from '../widgets/EcosystemWidget'
import { EcosystemChartTimeRange } from './EcosystemsChartTimeRange'
import { EcosystemsMarketShare } from './EcosystemsMarketShare'

export function EcosystemsActivityChart({
  name,
  entries,
  allScalingProjectsUops,
  className,
  ecosystemMilestones,
}: {
  name: string
  entries: EcosystemEntry['liveProjects']
  allScalingProjectsUops: number
  className?: string
  ecosystemMilestones: EcosystemMilestone[]
}) {
  const chartMeta = useMemo(() => {
    return {
      projects: {
        label: name,
        color: 'var(--ecosystem-primary)',
        indicatorType: {
          shape: 'line',
        },
      },
      ethereum: {
        label: 'Ethereum',
        color: 'var(--chart-ethereum)',
        indicatorType: {
          shape: 'line',
        },
      },
    } satisfies ChartMeta
  }, [name])
  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)
  const [timeRange, setTimeRange] = useState<ActivityTimeRange>('1y')

  const { data, isLoading } = api.activity.chart.useQuery({
    range: { type: timeRange },
    filter: {
      type: 'projects',
      projectIds: entries.map((project) => project.id),
    },
  })

  const chartData = useMemo(
    () =>
      data?.data.map(([timestamp, _, __, projectsUops, ethereumUops]) => {
        return {
          timestamp,
          projects: projectsUops !== null ? projectsUops / UnixTime.DAY : null,
          ethereum: ethereumUops !== null ? ethereumUops / UnixTime.DAY : null,
        }
      }),
    [data?.data],
  )

  const stats = getStats(chartData, allScalingProjectsUops)
  const range = getChartRange(chartData)

  return (
    <EcosystemWidget className={className}>
      <Header range={range} stats={stats} />
      <ChartContainer
        data={chartData}
        meta={chartMeta}
        isLoading={isLoading}
        className="h-44! min-h-44!"
        milestones={ecosystemMilestones}
        interactiveLegend={{
          dataKeys,
          onItemClick: toggleDataKey,
        }}
      >
        <AreaChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
          <ChartLegend
            content={<ChartLegendContent disableOnboarding={true} />}
          />
          {getStrokeOverFillAreaComponents({
            data: [
              {
                dataKey: 'ethereum',
                stroke: 'url(#strokeEthereum)',
                fill: 'url(#fillEthereum)',
                hide: !dataKeys.includes('ethereum'),
              },
              {
                dataKey: 'projects',
                stroke: 'var(--ecosystem-primary)',
                fill: 'url(#fillProjects)',
                hide: !dataKeys.includes('projects'),
              },
            ],
          })}
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              scale: 'lin',
              unit: ' UOPS',
            },
            syncedUntil: data?.syncedUntil,
          })}
          <ChartTooltip content={<ActivityCustomTooltip />} />
          <defs>
            <CustomFillGradientDef
              id="fillProjects"
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
      <div className="mt-2.5 ml-auto w-fit">
        <ActivityTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          projectSection={true}
        />
      </div>
    </EcosystemWidget>
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
    <div className="mb-3 flex items-start justify-between">
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
  chartData: { projects: number | null }[] | undefined,
  allScalingProjectsUops: number,
) {
  if (!chartData) {
    return undefined
  }
  const lastWithData = chartData.filter((d) => d.projects !== null).at(-1) as
    | {
        projects: number
      }
    | undefined
  if (!lastWithData) {
    return undefined
  }

  return {
    latestUops: lastWithData.projects,
    marketShare: lastWithData.projects / allScalingProjectsUops,
  }
}
