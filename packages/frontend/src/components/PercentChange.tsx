import { EM_DASH } from '~/consts/characters'
import { TrendArrowDownIcon, TrendArrowUpIcon } from '~/icons/TrendArrow'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'

interface Props {
  value: number
  className?: string
  textClassName?: string
}

export function PercentChange({ value, className, textClassName }: Props) {
  const isMore = value > 0
  const isLess = value < 0

  return (
    <span
      className={cn(
        isMore && 'text-positive',
        isLess && 'text-red-300',
        'relative',
        className,
      )}
    >
      {isMore && (
        <TrendArrowUpIcon className="-translate-y-1/2 absolute top-1/2 left-0.5" />
      )}
      {isLess && (
        <TrendArrowDownIcon className="-translate-y-1/2 absolute top-1/2 left-0.5" />
      )}
      <span
        className={cn(
          'relative inline-block w-[52px] pl-3.5 text-right text-xs',
          value === 0 && 'text-secondary',
          textClassName,
        )}
      >
        {isNaN(value) ? EM_DASH : formatPercent(Math.abs(value))}
      </span>
    </span>
  )
}
