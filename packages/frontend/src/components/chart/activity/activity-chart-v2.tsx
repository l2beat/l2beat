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

export function ActivityChartV2({ timeRange }: Props) {
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
      labelCount={3}
      renderHoverContents={(data) => (
        <ActivityChartHover {...data} showEthereum={SHOW_MAINNET} />
      )}
    >
      <section className="flex max-h-[290px] flex-col gap-4 2xl:max-h-[320px]">
        <Header scalingFactor={scalingFactor} />
        <Chart
          logo={{
            position: 'center',
            className: 'h-8 w-20',
          }}
          disableMilestones
          hideBottomLabel
        />
      </section>
    </ChartProvider>
  )
}

function Header({ scalingFactor }: { scalingFactor: number | undefined }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">Activity</span>
        <Link
          className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-[#1459CB] px-3 py-2 text-[13px] leading-none text-[#1459CB] max-md:hidden"
          href="/scaling/tvl"
        >
          View details{' '}
          <ChevronIcon className="size-[10px] -rotate-90 fill-[#1459CB]" />
        </Link>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="whitespace-nowrap text-right text-xl font-bold leading-[1.15]">
          {scalingFactor !== undefined ? (
            <p className="text-right">
              <span className="max-md:hidden">Scaling factor: </span>
              <span>{scalingFactor.toFixed(2)}x</span>
            </p>
          ) : (
            <Skeleton className="h-[23px] w-20 md:w-[243px]" />
          )}
        </div>
        <span className="whitespace-nowrap text-right text-xs leading-[1.15] text-[#929CAF]">
          Observed over the last 7 days
        </span>
      </div>
    </div>
  )
}
