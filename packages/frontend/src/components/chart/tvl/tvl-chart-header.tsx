import { INFINITY } from '~/consts/characters'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { formatCurrency } from '~/utils/format'
import { Skeleton } from '../../core/skeleton'
import { PercentChange } from '../../percent-change'
import { useChartLoading } from '../core/chart-loading-context'
import { tvlRangeToReadable } from './tvl-range-to-readable'

interface Props {
  unit: string
  value: number | undefined
  change: number | undefined
  range: TvlChartRange
}

export function TvlChartHeader({ unit, value, change, range }: Props) {
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
        <h1 className="text-xl font-bold max-lg:leading-none md:text-2xl lg:text-3xl">
          Value Locked
        </h1>
        <p className="hidden text-xs text-gray-500 dark:text-gray-600 lg:block lg:text-base">
          Sum of all canonically bridged, externally bridged, and natively
          minted tokens, converted to {unit.toUpperCase()}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right text-xl font-bold md:text-2xl lg:text-3xl">
          {value === undefined ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            formatCurrency(value, unit, {
              showLessThanMinimum: false,
            })
          )}
        </div>
        {loading ? (
          <Skeleton className="h-6 w-40" />
        ) : (
          <p className="whitespace-nowrap text-right text-xs font-bold lg:text-base">
            {changeOverTime} / {tvlRangeToReadable(range)}
          </p>
        )}
      </div>
    </header>
  )
}
