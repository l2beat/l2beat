import { EM_DASH } from '~/consts/characters'
import { TrendArrowDownIcon, TrendArrowUpIcon } from '~/icons/TrendArrow'
import {
  COMPARED_TO_PERIOD,
  formatPercent,
  type PercentageChangePeriod,
} from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from './core/tooltip/Tooltip'

export function PercentageChangeTooltipContent({
  period,
}: {
  period: PercentageChangePeriod
}) {
  return <>Percentage change compared to {COMPARED_TO_PERIOD[period]}.</>
}

interface Props {
  value: number
  className?: string
  textClassName?: string
  period?: PercentageChangePeriod
  disabledOnTouch?: boolean
  /**
   * The home page's change (see `HomeChange`): signed, 13px, no arrow. Still
   * in a fixed box, so the values beside it line up down a column.
   */
  compact?: boolean
}

export function PercentChange({
  value,
  className,
  textClassName,
  period,
  disabledOnTouch,
  compact,
}: Props) {
  const isMore = value > 0
  const isLess = value < 0

  const content = compact ? (
    <span
      className={cn(
        'inline-block w-[52px] whitespace-nowrap text-right font-medium text-label-value-13 tabular-nums',
        isMore && 'text-positive',
        isLess && 'text-negative',
        !isMore && !isLess && 'text-secondary',
        className,
        textClassName,
      )}
    >
      {Number.isNaN(value) ? (
        EM_DASH
      ) : (
        <>
          {isMore ? '+' : isLess ? '−' : ''}
          {formatPercent(Math.abs(value))}
        </>
      )}
    </span>
  ) : (
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
        {Number.isNaN(value) ? EM_DASH : formatPercent(Math.abs(value))}
      </span>
    </span>
  )

  if (!period) {
    return content
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild disabledOnTouch={disabledOnTouch}>
        {content}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          <PercentageChangeTooltipContent period={period} />
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
