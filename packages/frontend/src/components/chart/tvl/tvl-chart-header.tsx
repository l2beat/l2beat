import { INFINITY } from '~/consts/characters'
import { useLastDefinedValue } from '~/hooks/use-last-defined-value'
import type { TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { formatCurrency } from '~/utils/number-format/format-currency'
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
  const lastTotalValue = useLastDefinedValue(value)
  const loading = useChartLoading()

  const changeOverTime =
    range === 'max' ? (
      INFINITY
    ) : change !== undefined ? (
      <PercentChange value={change} textClassName="lg:w-[63px] lg:text-base" />
    ) : null

  return (
    <header className="flex justify-between text-base">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">
          Total value secured
          <span className="max-md:hidden"> stacked by type</span>
        </h1>
        <ChartTimeRange range={timeRange} />
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right text-xl font-bold md:text-2xl">
          {lastTotalValue === undefined || loading ? (
            <Skeleton className="my-[5px] h-5 w-32 md:my-1.5 md:h-6" />
          ) : (
            formatCurrency(lastTotalValue, unit)
          )}
        </div>
        {loading ? (
          <Skeleton className="my-[3px] h-3.5 w-32 lg:my-1 lg:h-4" />
        ) : (
          <p className="whitespace-nowrap text-right text-xs font-medium text-secondary lg:text-base">
            {changeOverTime} / {tvlRangeToReadable(range)}
          </p>
        )}
      </div>
    </header>
  )
}
