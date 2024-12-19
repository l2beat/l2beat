'use client'

import Link from 'next/link'
import { Skeleton } from '~/components/core/skeleton'
import { CustomLink } from '~/components/link/custom-link'
import { featureFlags } from '~/consts/feature-flags'
import { ChevronIcon } from '~/icons/chevron'
import { type ActivityChartStats } from '~/server/features/scaling/activity/get-activity-chart-stats'
import { countPerSecond } from '~/server/features/scaling/activity/utils/count-per-second'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { formatActivityCount } from '~/utils/number-format/format-activity-count'
import { Chart } from '../core/chart'
import { ChartLegend } from '../core/chart-legend'
import { ChartProvider } from '../core/chart-provider'
import { ActivityChartHover } from './activity-chart-hover'
import { RecategorizedActivityChartHover } from './recategorized-activity-chart-hover'
import { useActivityChartRenderParams } from './use-activity-chart-render-params'
import { useRecategorizedActivityChartRenderParams } from './use-recategorized-activity-chart-render-params'

const SHOW_MAINNET = true

interface Props {
  timeRange: ActivityTimeRange
}

export function ScalingSummaryActivityChart({ timeRange }: Props) {
  if (featureFlags.showOthers) {
    return <RecategorizedActivityChart timeRange={timeRange} />
  } else {
    return <ActivityChart timeRange={timeRange} />
  }
}

function ActivityChart({
  timeRange,
}: {
  timeRange: ActivityTimeRange
}) {
  const { data: stats } = api.activity.chartStats.useQuery({
    filter: { type: 'all' },
  })
  const { data, isLoading } = api.activity.chart.useQuery({
    range: timeRange,
    filter: { type: 'all' },
  })

  const { columns, valuesStyle, formatYAxisLabel } =
    useActivityChartRenderParams({
      chart: data,
      milestones: [],
      showMainnet: SHOW_MAINNET,
      type: 'Rollups',
    })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => (
        <ActivityChartHover
          {...data}
          showEthereum={SHOW_MAINNET}
          type="Rollups"
        />
      )}
    >
      <section className="flex flex-col gap-4">
        <Header stats={stats} />
        <Chart disableMilestones />
      </section>
    </ChartProvider>
  )
}

function RecategorizedActivityChart({
  timeRange,
}: {
  timeRange: ActivityTimeRange
}) {
  const { data: stats } = api.activity.chartStats.useQuery({
    filter: { type: 'all' },
  })
  const { data, isLoading } = api.activity.recategorizedChart.useQuery({
    range: timeRange,
    filter: { type: 'all' },
  })

  const { columns, valuesStyle, formatYAxisLabel } =
    useRecategorizedActivityChartRenderParams({
      chart: data,
      milestones: [],
    })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => (
        <RecategorizedActivityChartHover {...data} />
      )}
    >
      <section className="flex flex-col gap-4">
        <Header stats={stats} />
        <Chart disableMilestones />
        <ChartLegend
          elements={[
            {
              name: 'Rollups',
              color: 'bg-indicator-rollups',
            },
            {
              name: 'Validiums & Optimiums',
              color: 'bg-indicator-validiums-optimiums',
            },
            {
              name: 'Others',
              color: 'bg-indicator-others',
            },
            {
              name: 'Ethereum',
              color: 'bg-indicator-ethereum',
            },
          ]}
        />
      </section>
    </ChartProvider>
  )
}

function Header({ stats }: { stats: ActivityChartStats | undefined }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">Activity</span>
          <Link
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 text-[13px] font-bold leading-none text-link max-md:hidden"
            href="/scaling/activity"
          >
            View details
            <ChevronIcon className="size-[10px] -rotate-90 fill-current" />
          </Link>
        </div>
        <CustomLink
          href="/scaling/activity"
          className="flex items-center gap-1 text-xs leading-[1.15] md:hidden"
          underline={false}
        >
          Details
          <ChevronIcon className="size-[10px] -rotate-90 fill-current" />
        </CustomLink>
      </div>
      <div className="flex flex-col items-end">
        {stats !== undefined ? (
          <>
            <div className="whitespace-nowrap text-right text-xl font-bold">
              {formatActivityCount(
                countPerSecond(stats.uops.latestProjectsTxCount),
              )}{' '}
              UOPS
            </div>
            <div className="h-5" />
          </>
        ) : (
          <>
            <Skeleton className="my-[5px] h-5 w-20 md:w-[243px]" />
            <div className="h-5" />
          </>
        )}
      </div>
    </div>
  )
}
