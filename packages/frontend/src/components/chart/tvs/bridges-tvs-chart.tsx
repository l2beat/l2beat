'use client'
import { useState } from 'react'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { INFINITY } from '~/consts/characters'
import { useLocalStorage } from '~/hooks/use-local-storage'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { Skeleton } from '../../core/skeleton'
import { PercentChange } from '../../percent-change'
import { ChartControlsWrapper } from '../core/chart-controls-wrapper'
import { useChartLoading } from '../core/chart-loading-context'
import { ChartTimeRange } from '../core/chart-time-range'
import type { ChartUnit } from '../types'
import { TvsChartHover } from './tvs-chart-hover'
import { TvsChartTimeRangeControls } from './tvs-chart-time-range-controls'
import { TvsChartUnitControls } from './tvs-chart-unit-controls'
import { tvsRangeToReadable } from './tvs-range-to-readable'
import { useTvsChartRenderParams } from './use-tvs-chart-render-params'

export function BridgesTvsChart() {
  const [unit, setUnit] = useLocalStorage<ChartUnit>(
    'bridges-summary-unit',
    'usd',
  )
  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')

  const { data, isLoading } = api.tvs.chart.useQuery({
    range: timeRange,
    filter: { type: 'bridge' },
    excludeAssociatedTokens: false,
  })

  const { chartRange, formatYAxisLabel, valuesStyle, columns, change, total } =
    useTvsChartRenderParams({ milestones: [], unit, data })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => <TvsChartHover data={data} />}
    >
      <section className="flex flex-col gap-4">
        <BridgesChartHeader
          unit={unit}
          value={total?.[unit]}
          change={change}
          range={timeRange}
          timeRange={chartRange}
        />
        <Chart />
        <ChartControlsWrapper>
          <TvsChartUnitControls unit={unit} setUnit={setUnit} />
          <TvsChartTimeRangeControls
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </ChartControlsWrapper>
      </section>
    </ChartProvider>
  )
}

function BridgesChartHeader({
  unit,
  value,
  change,
  range,
  timeRange,
}: {
  unit: string
  value?: number
  change?: number
  range: TvsChartRange
  timeRange: [number, number] | undefined
}) {
  const loading = useChartLoading()

  const changeOverTime =
    range === 'max' ? (
      INFINITY
    ) : change ? (
      <PercentChange value={change} textClassName="lg:w-[63px] lg:text-base" />
    ) : null

  return (
    <header className="flex justify-between">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">Value Secured</h1>
        <ChartTimeRange range={timeRange} />
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right text-xl font-bold md:text-2xl">
          {!value || loading ? (
            <Skeleton className="my-0.5 h-[26px] w-32 md:h-8" />
          ) : (
            formatCurrency(value, unit)
          )}
        </div>
        {loading ? (
          <Skeleton className="h-5 w-32 lg:h-6" />
        ) : (
          <p className="whitespace-nowrap text-right text-xs font-medium text-secondary lg:text-base">
            {changeOverTime} / {tvsRangeToReadable(range)}
          </p>
        )}
      </div>
    </header>
  )
}
