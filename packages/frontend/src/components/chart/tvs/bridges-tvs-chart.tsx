'use client'
import { useMemo, useState } from 'react'
import { INFINITY } from '~/consts/characters'
import { useLocalStorage } from '~/hooks/use-local-storage'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { ChartControlsWrapper } from '../../core/chart/chart-controls-wrapper'
import { ChartTimeRange } from '../../core/chart/chart-time-range'
import { getChartRange } from '../../core/chart/utils/get-chart-range-from-columns'
import { Skeleton } from '../../core/skeleton'
import { PercentChange } from '../../percent-change'
import type { ChartUnit } from '../types'
import type { TvsChartDataPoint } from './tvs-chart'
import { TvsChart } from './tvs-chart'
import { TvsChartTimeRangeControls } from './tvs-chart-time-range-controls'
import { TvsChartUnitControls } from './tvs-chart-unit-controls'
import { tvsRangeToReadable } from './tvs-range-to-readable'

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

  const chartData: TvsChartDataPoint[] | undefined = data?.map(
    ([timestamp, native, canonical, external, ethPrice]) => {
      const total = native + canonical + external
      return {
        timestamp,
        value: unit === 'usd' ? total / 100 : total / ethPrice,
      }
    },
  )
  const chartRange = useMemo(() => getChartRange(chartData), [chartData])
  const stats = getStats(chartData)

  return (
    <section className="flex flex-col gap-4">
      <BridgesChartHeader
        unit={unit}
        value={stats?.total}
        change={stats?.change}
        range={timeRange}
        timeRange={chartRange}
      />
      <TvsChart
        isLoading={isLoading}
        data={chartData}
        unit={unit}
        milestones={undefined}
      />
      <ChartControlsWrapper>
        <TvsChartUnitControls unit={unit} setUnit={setUnit} />
        <TvsChartTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </ChartControlsWrapper>
    </section>
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
  value: number | undefined
  change: number | undefined
  range: TvsChartRange
  timeRange: [number, number] | undefined
}) {
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
          {value === undefined ? (
            <Skeleton className="my-0.5 h-[26px] w-32 md:h-8" />
          ) : (
            formatCurrency(value, unit)
          )}
        </div>
        {change === undefined ? (
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

function getStats(data: TvsChartDataPoint[] | undefined) {
  if (!data) {
    return undefined
  }
  const oldestDataPoint = data.at(0)
  const newestDataPoint = data.at(-1)
  if (!oldestDataPoint || !newestDataPoint) {
    return undefined
  }

  const change = newestDataPoint.value / oldestDataPoint.value - 1

  return {
    total: newestDataPoint.value,
    change,
  }
}
