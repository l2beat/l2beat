import { useMemo, useState } from 'react'
import { INFINITY } from '~/consts/characters'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { ChartRange } from '~/utils/range/range'
import { optionToRange } from '~/utils/range/range'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '../../core/chart/utils/getChartTimeRangeFromData'
import { Skeleton } from '../../core/Skeleton'
import { PercentChange } from '../../PercentChange'
import type { ChartUnit } from '../types'
import type { TvsChartDataPoint } from './TvsChart'
import { TvsChart } from './TvsChart'
import { TvsChartRangeControls } from './TvsChartRangeControls'
import { TvsChartUnitControls } from './TvsChartUnitControls'
import { tvsRangeToReadable } from './tvsRangeToReadable'

export function BridgesTvsChart() {
  const [unit, setUnit] = useState<ChartUnit>('usd')
  const [range, setRange] = useState<ChartRange>(optionToRange('1y'))

  const { data, isLoading } = api.tvs.chart.useQuery({
    range,
    filter: { type: 'bridge' },
    excludeAssociatedTokens: false,
    excludeRwaRestrictedTokens: true,
  })

  const chartData: TvsChartDataPoint[] | undefined = data?.chart.map(
    ([timestamp, native, canonical, external, ethPrice]) => {
      const total =
        native !== null && canonical !== null && external !== null
          ? native + canonical + external
          : null
      const divider = unit === 'usd' ? 1 : ethPrice
      return {
        timestamp,
        value:
          total !== null && divider !== null && divider !== 0
            ? total / divider
            : null,
      }
    },
  )
  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )
  const stats = getStats(chartData)

  return (
    <div className="flex flex-col gap-4">
      <BridgesChartHeader
        unit={unit}
        value={stats?.total}
        change={stats?.change}
        range={range}
        timeRange={timeRange}
      />
      <TvsChart
        isLoading={isLoading}
        data={chartData}
        unit={unit}
        milestones={undefined}
        syncedUntil={data?.syncedUntil}
      />
      <ChartControlsWrapper>
        <TvsChartUnitControls unit={unit} setUnit={setUnit} />
        <TvsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
    </div>
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
  range: ChartRange
  timeRange: [number, number] | undefined
}) {
  const changeOverTime =
    range[0] === null ? (
      INFINITY
    ) : change ? (
      <PercentChange value={change} textClassName="lg:w-[63px] lg:text-base" />
    ) : null

  return (
    <header className="flex justify-between">
      <div>
        <h1 className="font-bold text-xl md:text-2xl">Value Secured</h1>
        <ChartTimeRange timeRange={timeRange} />
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right font-bold text-xl md:text-2xl">
          {value === undefined ? (
            <Skeleton className="my-0.5 h-[26px] w-32 md:h-8" />
          ) : (
            formatCurrency(value, unit)
          )}
        </div>
        {change === undefined ? (
          <Skeleton className="h-5 w-32 lg:h-6" />
        ) : (
          <p className="whitespace-nowrap text-right font-medium text-secondary text-xs lg:text-base">
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
  const pointsWithData = data.filter((point) => point.value !== null) as {
    timestamp: number
    value: number
  }[]
  const oldestDataPoint = pointsWithData.at(0)
  const newestDataPoint = pointsWithData.at(-1)
  if (!oldestDataPoint || !newestDataPoint) {
    return undefined
  }

  const change = newestDataPoint.value / oldestDataPoint.value - 1

  return {
    total: newestDataPoint.value,
    change,
  }
}
