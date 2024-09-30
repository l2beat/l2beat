'use client'

import Link from 'next/link'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { Skeleton } from '~/components/core/skeleton'
import { PercentChange } from '~/components/percent-change'
import { ChevronIcon } from '~/icons/chevron'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/format'
import { useChartLoading } from '../core/chart-loading-context'
import { type ChartUnit } from '../types'
import { TvlChartHover } from './tvl-chart-hover'
import { useTvlChartRenderParams } from './use-tvl-chart-render-params'

export function ScalingTvlChartV2({
  unit,
  timeRange,
}: { unit: ChartUnit; timeRange: TvlChartRange }) {
  const { data: total } = api.tvl.total.useQuery({
    excludeAssociatedTokens: false,
    filter: { type: 'layer2' },
  })
  const { data, isLoading } = api.tvl.chart.useQuery({
    range: timeRange,
    excludeAssociatedTokens: false,
    filter: { type: 'layer2' },
  })

  const { formatYAxisLabel, valuesStyle, columns, change } =
    useTvlChartRenderParams({ data, unit: unit, milestones: [] })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      labelCount={3}
      isLoading={isLoading}
      renderHoverContents={(data) => <TvlChartHover data={data} />}
    >
      <section className="flex max-h-[290px] flex-col gap-4 2xl:max-h-[320px]">
        <Header
          total={total}
          change={change}
          unit={unit}
          timeRange={timeRange}
        />
        <Chart
          hideBottomLabel
          logo={{ position: 'center', className: 'w-20 h-8' }}
          disableMilestones
        />
      </section>
    </ChartProvider>
  )
}

interface Props {
  total: Record<ChartUnit, number | undefined> | undefined
  change: number
  unit: ChartUnit
  timeRange: TvlChartRange
}

function Header({ total, unit, change, timeRange }: Props) {
  const loading = useChartLoading()
  const value = total?.[unit]
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">Value Locked</span>
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
          {value === undefined ? (
            <Skeleton className="h-[23px] w-32" />
          ) : (
            formatCurrency(value, unit, {
              showLessThanMinimum: false,
            })
          )}
        </div>
        {loading ? (
          <Skeleton className="h-6 w-40" />
        ) : (
          <p className="whitespace-nowrap text-right text-xs leading-[1.15]">
            <PercentChange value={change} />
            <span className="text-[#929CAF]"> / {timeRange}</span>
          </p>
        )}
      </div>
    </div>
  )
}
