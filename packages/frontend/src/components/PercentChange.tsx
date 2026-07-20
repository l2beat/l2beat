import { EM_DASH } from '~/consts/characters'
import { TrendArrowDownIcon, TrendArrowUpIcon } from '~/icons/TrendArrow'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

export type PercentageChangePeriod = '1D' | '7D' | 'previous-24-hours'

export function PercentageChangeTooltipContent({
  period,
}: {
  period: PercentageChangePeriod
}) {
  const comparisonPeriod =
    period === 'previous-24-hours' ? 'the previous 24 hours' : `${period} ago`

  return <>Percentage change compared to {comparisonPeriod}.</>
}

interface Props {
  value: number
  className?: string
  textClassName?: string
  period?: PercentageChangePeriod
}

export function PercentChange({
  value,
  className,
  textClassName,
  period,
}: Props) {
  const isMore = value > 0
  const isLess = value < 0

  const content = (
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

  if (!period) {
    return content
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild disabledOnMobile>
        {content}
      </TooltipTrigger>
      <TooltipContent>
        <PercentageChangeTooltipContent period={period} />
      </TooltipContent>
    </Tooltip>
  )
}
