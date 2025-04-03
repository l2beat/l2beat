'use client'
import { UnixTime } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { ActivityCustomTooltip } from '~/components/chart/activity/activity-chart'
import { Checkbox } from '~/components/core/checkbox'
import { EthereumLineIcon } from '~/icons/ethereum-line-icon'
import { ChartControlsWrapper } from '~/components/core/chart/chart-controls-wrapper'
import { useIsClient } from '~/hooks/use-is-client'
import { useLocalStorage } from '~/hooks/use-local-storage'
import type { EcosystemProjectEntry } from '~/server/features/ecosystems/get-ecosystem-project-entry'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { Skeleton } from '~/components/core/skeleton'
import { ActivityTimeRangeControls } from '~/app/(side-nav)/scaling/activity/_components/activity-time-range-controls'
import { ChartTimeRange } from '~/components/core/chart/chart-time-range'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/chart'
import { AreaChart } from 'recharts'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/get-stroke-over-fill-area-components'
import { compact } from 'lodash'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/ethereum-gradient-def'
import { CustomFillGradientDef } from '~/components/core/chart/defs/custom-gradient-def'

export function EcosystemsActivityChart({
  name,
  entries,
  colors,
}: {
  name: string
  entries: EcosystemProjectEntry['projects']
  colors: {
    primary: string
    secondary: string
  }
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

  const chartMeta = {
    projects: {
      label: name,
      color: colors.primary,
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

  const range = getChartRange(chartData)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold">Activity</div>
          <div className="text-xs font-medium text-secondary">
            <ChartTimeRange range={range} />
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">123 UOPS</div>
          <div className="text-xs font-medium text-[--ecosystem-primary]">
            65% L2 market share
          </div>
        </div>
      </div>
      <ChartContainer
        data={chartData}
        meta={chartMeta}
        isLoading={isLoading}
        milestones={[]}
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
                stroke: colors.primary,
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
            <CustomFillGradientDef id="fillProjects" colors={colors} />
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
    </div>
  )
}
