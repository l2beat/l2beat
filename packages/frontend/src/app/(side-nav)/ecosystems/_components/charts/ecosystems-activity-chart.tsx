'use client'
import { UnixTime } from '@l2beat/shared-pure'
import { compact } from 'lodash'
import { useMemo, useState } from 'react'
import { AreaChart } from 'recharts'
import { ActivityTimeRangeControls } from '~/app/(side-nav)/scaling/activity/_components/activity-time-range-controls'
import { ActivityCustomTooltip } from '~/components/chart/activity/activity-chart'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/chart'
import { ChartControlsWrapper } from '~/components/core/chart/chart-controls-wrapper'
import { CustomFillGradientDef } from '~/components/core/chart/defs/custom-gradient-def'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/ethereum-gradient-def'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/get-stroke-over-fill-area-components'
import { Checkbox } from '~/components/core/checkbox'
import { Skeleton } from '~/components/core/skeleton'
import { useIsClient } from '~/hooks/use-is-client'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { EthereumLineIcon } from '~/icons/ethereum-line-icon'
import type { EcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { formatActivityCount } from '~/utils/number-format/format-activity-count'
import { EcosystemWidget } from '../widgets/ecosystem-widget'
import { EcosystemChartTimeRange } from './ecosystems-chart-time-range'
import { EcosystemsMarketShare } from './ecosystems-market-share'

export function EcosystemsActivityChart({
  name,
  entries,
  allScalingProjectsUops,
  className,
}: {
  name: string
  entries: EcosystemEntry['projects']
  allScalingProjectsUops: number
  className?: string
}) {
  const isClient = useIsClient()
  const [timeRange, setTimeRange] = useState<ActivityTimeRange>('1y')
  const [showMainnet, setShowMainnet] = useLocalStorage(
    'scaling-activity-show-mainnet',
    true,
  )

  const { data, isLoading } = api.activity.chart.useQuery({
    range: timeRange,
    filter: {
      type: 'projects',
      projectIds: entries.map((project) => project.id),
    },
    previewRecategorisation: false,
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
        color: 'hsl(var(--chart-ethereum))',
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
        className="!h-44 !min-h-44"
      >
        <AreaChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
          <ChartLegend content={<ChartLegendContent />} />
          {getStrokeOverFillAreaComponents({
            data: compact([
              showMainnet && {
                dataKey: 'ethereum',
                stroke: 'url(#strokeEthereum)',
                fill: 'url(#fillEthereum)',
              },
              {
                dataKey: 'projects',
                stroke: 'var(--ecosystem-primary)',
                fill: 'url(#fillProjects)',
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
              unit: ' TPS',
            },
          })}
          <ChartTooltip
            content={<ActivityCustomTooltip syncedUntil={undefined} />}
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
              <span className="hidden md:inline">ETH Mainnet Operations</span>
              <span className="md:hidden">ETH UOPS</span>
            </div>
          </Checkbox>
        ) : (
          <Skeleton className="h-8 w-[114px] md:w-[230px]" />
        )}
        <ActivityTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
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
    <div className="mb-3 flex items-center justify-between">
      <div>
        <div className="text-xl font-bold">Activity</div>
        <div className="text-xs font-medium text-secondary">
          <EcosystemChartTimeRange range={range} />
        </div>
      </div>
      <div className="text-right">
        {stats?.latestUops !== undefined ? (
          <div className="text-xl font-bold">
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
