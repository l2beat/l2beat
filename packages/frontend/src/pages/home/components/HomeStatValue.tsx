import { Skeleton } from '~/components/core/Skeleton'
import { EM_DASH } from '~/consts/characters'
import { TrendArrowDownIcon, TrendArrowUpIcon } from '~/icons/TrendArrow'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { HOME_CHART_DELTA_PERIOD_LABEL } from '../homeChartRanges'

/** Headline stat of a chart section: prominent value with its % change
 * ("▲ 4.2% / 1 year") stacked below, both right-aligned. */
export function HomeStatValue({
  isLoading,
  value,
  change,
}: {
  isLoading: boolean
  value: string | undefined
  change?: number
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
    )
  }
  if (value === undefined) {
    return (
      <span className="font-medium text-label-value-16 text-secondary">
        {EM_DASH}
      </span>
    )
  }
  return (
    <div className="flex flex-col items-end gap-1">
      <span className="font-semibold text-label-value-16">{value}</span>
      {change !== undefined && Number.isFinite(change) && (
        <span
          className={cn(
            'flex items-center gap-1 font-medium text-label-value-12',
            change > 0 && 'text-positive',
            change < 0 && 'text-red-300',
            change === 0 && 'text-secondary',
          )}
        >
          {change > 0 && <TrendArrowUpIcon />}
          {change < 0 && <TrendArrowDownIcon />}
          {formatPercent(Math.abs(change))}
          <span className="text-secondary">
            / {HOME_CHART_DELTA_PERIOD_LABEL}
          </span>
        </span>
      )}
    </div>
  )
}
