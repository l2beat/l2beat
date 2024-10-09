import { INFINITY } from '~/consts/characters'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { formatCurrency } from '~/utils/format'
import { Skeleton } from '../../core/skeleton'
import { PercentChange } from '../../percent-change'
import { useChartLoading } from '../core/chart-loading-context'
import { ChartTimeRange } from '../core/chart-time-range'
import { tvlRangeToReadable } from './tvl-range-to-readable'

interface Props {
  unit: string
  value: number | undefined
  change: number | undefined
  range: TvlChartRange
  timeRange: [number, number] | undefined
}

export function TvlChartHeader({
  unit,
  value,
  change,
  range,
  timeRange,
}: Props) {
  const loading = useChartLoading()

  const changeOverTime =
    range === 'max' ? (
      INFINITY
    ) : change !== undefined ? (
      <PercentChange value={change} />
    ) : null

  return (
    <header className="flex justify-between text-base">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">
          Total value locked
          <span className="max-md:hidden"> stacked by type</span>
        </h1>
        <ChartTimeRange range={timeRange} />
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right text-xl font-bold md:text-2xl">
          {value === undefined ? (
            <Skeleton className="my-0.5 h-[26px] w-32 md:h-8" />
          ) : (
            formatCurrency(value, unit, {
              showLessThanMinimum: false,
            })
          )}
        </div>
        {loading ? (
          <Skeleton className="h-5 w-32 lg:h-6" />
        ) : (
          <p className="whitespace-nowrap text-right text-xs font-medium text-secondary lg:text-base">
            {changeOverTime} / {tvlRangeToReadable(range)}
          </p>
        )}
      </div>
    </header>
  )
}
