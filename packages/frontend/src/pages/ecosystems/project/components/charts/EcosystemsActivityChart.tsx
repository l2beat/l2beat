import { UnixTime } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { useMemo, useState } from 'react'
import { AreaChart, Line, YAxis } from 'recharts'
import { ActivityCustomTooltip } from '~/components/chart/activity/ActivityChart'
import { Checkbox } from '~/components/core/Checkbox'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/EthereumGradientDef'
import { getCommonChartComponents } from '~/components/core/chart/utils/GetCommonChartComponents'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/GetStrokeOverFillAreaComponents'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { EthereumLineIcon } from '~/icons/EthereumLineIcon'
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
  const isClient = useIsClient()
  const [timeRange, setTimeRange] = useState<ActivityTimeRange>('1y')
  const [showMainnet, setShowMainnet] = useLocalStorage(
    'ecosystems-activity-show-mainnet',
    true,
  )

  const { data, isLoading } = api.activity.chart.useQuery({
    range: { type: timeRange },
    filter: {
      type: 'projects',
      projectIds: entries.map((project) => project.id),
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
      ethereum: {
        label: 'Ethereum',
        color: 'var(--chart-ethereum)',
        indicatorType: {
          shape: 'line',
        },
      },
      ratio: {
        label: 'UOPS/TPS ratio',
        color: 'var(--chart-emerald)',
        indicatorType: {
          shape: 'line',
        },
      },
    } satisfies ChartMeta
  }, [name])

  const chartData = useMemo(
    () =>
      data?.data.map(([timestamp, _, __, projectsUops, ethereumUops]) => {
        return {
          timestamp,
          projects: projectsUops / UnixTime.DAY,
          ethereum: ethereumUops / UnixTime.DAY,
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
      >
        <AreaChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
          <ChartLegend content={<ChartLegendContent />} />
          {getStrokeOverFillAreaComponents({
            data: compact([
              showMainnet && {
                dataKey: 'ethereum',
                stroke: 'url(#strokeEthereum)',
                fill: 'url(#fillEthereum)',
                yAxisId: 'left',
              },
              {
                dataKey: 'projects',
                stroke: 'var(--ecosystem-primary)',
                fill: 'url(#fillProjects)',
                yAxisId: 'left',
              },
            ]),
          })}
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              scale: 'lin',
              unit: ' UOPS',
              yAxisId: 'left',
            },
          })}
          <Line
            yAxisId="right"
            dataKey="ratio"
            strokeWidth={2}
            stroke={chartMeta.ratio.color}
            dot={false}
            isAnimationActive={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            mirror
            tickCount={3}
            dy={-10}
            unit={'x'}
            tick={{
              width: 100,
            }}
          />
          <ChartTooltip
            content={
              <ActivityCustomTooltip
                syncedUntil={undefined}
                chartMeta={chartMeta}
              />
            }
          />
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
      <ChartControlsWrapper className="mt-2.5">
        {isClient ? (
          <Checkbox
            name="showMainnetActivity"
            checked={showMainnet}
            onCheckedChange={(state) => setShowMainnet(!!state)}
          >
            <div className="flex flex-row items-center gap-2">
              <EthereumLineIcon className="hidden h-1.5 w-2.5 sm:inline-block" />
              <span className="hidden 2xl:inline">ETH Mainnet Operations</span>
              <span className="2xl:hidden">ETH UOPS</span>
            </div>
          </Checkbox>
        ) : (
          <Skeleton className="h-8 w-[114px] md:w-[230px]" />
        )}
        <ActivityTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          projectSection={true}
        />
      </ChartControlsWrapper>
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
