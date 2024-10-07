'use client'

import Link from 'next/link'
import { Skeleton } from '~/components/core/skeleton'
import { ChevronIcon } from '~/icons/chevron'
import { type ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { Chart } from '../core/chart'
import { ChartProvider } from '../core/chart-provider'
import { ActivityChartHover } from './activity-chart-hover'
import { useActivityChartRenderParams } from './use-activity-chart-render-params'

const SHOW_MAINNET = true

interface Props {
  timeRange: ActivityTimeRange
}

export function ScalingSummaryActivityChart({ timeRange }: Props) {
  const { data: scalingFactor } = api.activity.scalingFactor.useQuery({
    filter: { type: 'all' },
  })
  const { data, isLoading } = api.activity.chart.useQuery({
    range: timeRange,
    filter: { type: 'all' },
  })

  const { columns, valuesStyle, formatYAxisLabel } =
    useActivityChartRenderParams({
      data: data,
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
        <Header scalingFactor={scalingFactor} />
        <Chart disableMilestones className="!h-[200px]" />
      </section>
    </ChartProvider>
  )
}

function Header({ scalingFactor }: { scalingFactor: number | undefined }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">Activity</span>
          <Link
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-blue-400 px-3 py-2 text-[13px] leading-none text-[#1459CB] dark:border-blue-500 dark:text-blue-500 max-md:hidden"
            href="/scaling/activity"
          >
            View details{' '}
            <ChevronIcon className="size-[10px] -rotate-90 fill-current" />
          </Link>
        </div>
        <p className="whitespace-nowrap text-xs leading-[1.15] text-secondary">
          Last 30 days
        </p>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-baseline gap-1">
          {scalingFactor !== undefined ? (
            <>
              <span className="whitespace-nowrap text-right text-base font-bold max-md:hidden">
                Scaling factor:{' '}
              </span>
              <div className="whitespace-nowrap text-right text-xl font-bold">
                {scalingFactor.toFixed(2)}x
              </div>
            </>
          ) : (
            <Skeleton className="my-[5px] h-5 w-20 md:w-[243px]" />
          )}
        </div>
        <span className="whitespace-nowrap text-right text-xs leading-[1.15] text-secondary">
          Observed over the last 7 days
        </span>
      </div>
    </div>
  )
}
