'use client'

import Link from 'next/link'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { Skeleton } from '~/components/core/skeleton'
import { CustomLink } from '~/components/link/custom-link'
import { PercentChange } from '~/components/percent-change'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { ChevronIcon } from '~/icons/chevron'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { ChartLegend } from '../core/chart-legend'
import { useChartLoading } from '../core/chart-loading-context'
import type { ChartUnit } from '../types'
import { RecategorisedTvsChartHover } from './recategorised-tvs-chart-hover'
import { useRecategorisedTvsChartRenderParams } from './use-recategorised-tvs-chart-render-params'

export function ScalingSummaryTvsChart({
  unit,
  timeRange,
}: { unit: ChartUnit; timeRange: TvsChartRange }) {
  const { checked } = useRecategorisationPreviewContext()
  const { data, isLoading } = api.tvs.recategorisedChart.useQuery({
    range: timeRange,
    excludeAssociatedTokens: false,
    filter: { type: 'layer2' },
    previewRecategorisation: checked,
  })

  const { formatYAxisLabel, valuesStyle, columns, change, total } =
    useRecategorisedTvsChartRenderParams({ data, unit, milestones: [] })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => <RecategorisedTvsChartHover {...data} />}
    >
      <section className="flex flex-col gap-4">
        <Header
          total={total}
          change={change}
          unit={unit}
          timeRange={timeRange}
        />
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
          ]}
        />
      </section>
    </ChartProvider>
  )
}

interface Props {
  total: Record<ChartUnit, number | undefined> | undefined
  change: number
  unit: ChartUnit
  timeRange: TvsChartRange
}

function Header({ total, unit, change, timeRange }: Props) {
  const loading = useChartLoading()
  const value = total?.[unit]
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">Value Secured</span>
          <Link
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 text-[13px] font-bold leading-none text-link max-md:hidden"
            href="/scaling/tvs"
          >
            View details
            <ChevronIcon className="size-2.5 -rotate-90 fill-current" />
          </Link>
        </div>
        <CustomLink
          href="/scaling/tvs"
          className="flex items-center gap-1 text-xs leading-[1.15] md:hidden"
          underline={false}
        >
          Details
          <ChevronIcon className="size-2 -rotate-90 fill-current" />
        </CustomLink>
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right text-xl font-bold">
          {value === undefined ? (
            <Skeleton className="my-[5px] h-5 w-32" />
          ) : (
            formatCurrency(value, unit)
          )}
        </div>
        {loading ? (
          <Skeleton className="my-0.5 h-4 w-40" />
        ) : (
          <p className="whitespace-nowrap text-right text-xs">
            <PercentChange value={change} />
            <span className="text-secondary"> / {timeRange}</span>
          </p>
        )}
      </div>
    </div>
  )
}
