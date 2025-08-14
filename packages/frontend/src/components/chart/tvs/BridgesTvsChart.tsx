import { useMemo, useState } from 'react'
import { INFINITY } from '~/consts/characters'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import { Skeleton } from '../../core/Skeleton'
import { PercentChange } from '../../PercentChange'
import type { ChartUnit } from '../types'
import type { TvsChartDataPoint } from './TvsChart'
import { TvsChart } from './TvsChart'
import { TvsChartTimeRangeControls } from './TvsChartTimeRangeControls'
import { TvsChartUnitControls } from './TvsChartUnitControls'
import { tvsRangeToReadable } from './tvsRangeToReadable'

export function BridgesTvsChart() {
  const [unit, setUnit] = useLocalStorage<ChartUnit>(
    'bridges-summary-unit',
    'usd',
  )
  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')

  const { data, isLoading } = api.tvs.chart.useQuery({
    range: { type: timeRange },
    filter: { type: 'bridge' },
    excludeAssociatedTokens: false,
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
  const chartRange = useMemo(() => getChartRange(chartData), [chartData])
  const stats = getStats(chartData)

  return (
    <div className="flex flex-col gap-4">
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
        syncedUntil={data?.syncedUntil}
      />
      <ChartControlsWrapper>
        <TvsChartUnitControls unit={unit} setUnit={setUnit} />
        <TvsChartTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
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
        <h1 className="font-bold text-xl md:text-2xl">Value Secured</h1>
        <ChartTimeRange range={timeRange} />
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
