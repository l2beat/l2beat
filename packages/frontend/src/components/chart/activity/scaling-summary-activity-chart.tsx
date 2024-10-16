'use client'

import Link from 'next/link'
import { Skeleton } from '~/components/core/skeleton'
import { CustomLink } from '~/components/link/custom-link'
import { ChevronIcon } from '~/icons/chevron'
import { type ActivityChartStats } from '~/server/features/scaling/activity/get-activity-chart-stats'
import { countToTps } from '~/server/features/scaling/activity/utils/count-to-tps'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { formatTps } from '~/utils/number-format/format-tps'
import { Chart } from '../core/chart'
import { ChartProvider } from '../core/chart-provider'
import { ActivityChartHover } from './activity-chart-hover'
import { useActivityChartRenderParams } from './use-activity-chart-render-params'

const SHOW_MAINNET = true

interface Props {
  timeRange: ActivityTimeRange
}

export function ScalingSummaryActivityChart({ timeRange }: Props) {
  const { data: stats } = api.activity.chartStats.useQuery({
    filter: { type: 'all' },
  })
  const { data, isLoading } = api.activity.chart.useQuery({
    range: timeRange,
    filter: { type: 'all' },
  })

  const { columns, valuesStyle, formatYAxisLabel } =
    useActivityChartRenderParams({
      data,
      milestones: [],
      showMainnet: SHOW_MAINNET,
    })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => (
        <ActivityChartHover {...data} showEthereum={SHOW_MAINNET} />
      )}
    >
      <section className="flex flex-col gap-4">
        <Header stats={stats} />
        <Chart disableMilestones />
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
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-blue-400 px-3 py-2 text-[13px] font-bold leading-none text-[#1459CB] dark:border-blue-500 dark:text-blue-500 max-md:hidden"
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
        <div className="flex flex-col">
          {stats !== undefined ? (
            <>
              <div className="whitespace-nowrap text-right text-xl font-bold">
                {formatTps(countToTps(stats.latestProjectsTxCount))} TPS
              </div>
              <span className="whitespace-nowrap text-right text-xs leading-[1.15] text-secondary">
                Scaling factor: {stats.scalingFactor.toFixed(2)}x
              </span>
            </>
          ) : (
            <>
              <Skeleton className="my-[5px] h-5 w-20 md:w-[243px]" />
              <Skeleton className="h-4 w-[135px]" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
