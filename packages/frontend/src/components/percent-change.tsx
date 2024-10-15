import { TrendArrowDownIcon, TrendArrowUpIcon } from '~/icons/trend-arrow'
import { cn } from '~/utils/cn'
import { formatPercent } from '~/utils/get-percentage-change'

interface Props {
  value: number
  className?: string
}

export function PercentChange({ value, className }: Props) {
  const isMore = value > 0
  const isLess = value < 0

  return (
    <span
      className={cn(
        isMore && 'text-green-300 dark:text-green-450',
        isLess && 'text-red-300',
        'relative',
        className,
      )}
    >
      {isMore && (
        <TrendArrowUpIcon className="absolute left-0.5 top-1/2 -translate-y-1/2" />
      )}
      {isLess && (
        <TrendArrowDownIcon className="absolute left-0.5 top-1/2 -translate-y-1/2" />
      )}
      <span className="relative inline-block w-[52px] pl-3.5 text-right text-xs">
        {formatPercent(Math.abs(value))}
      </span>
    </span>
  )
}
