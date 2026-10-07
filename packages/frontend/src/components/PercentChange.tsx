import { EM_DASH, MINUS_SIGN } from '~/consts/characters'
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
  disabledOnMobile?: boolean
  /**
   * A sign instead of the trend arrow. Lighter, for columns of changes in
   * tables, where an arrow on every row adds up to a lot of ink.
   */
  signed?: boolean
}

export function PercentChange({
  value,
  className,
  textClassName,
  period,
  disabledOnMobile,
  signed,
}: Props) {
  const isMore = value > 0
  const isLess = value < 0

  const content = (
    <span
      className={cn(
        isMore && 'text-positive',
        isLess && (signed ? 'text-negative' : 'text-red-300'),
        'relative',
        className,
      )}
    >
      {!signed && isMore && (
        <TrendArrowUpIcon className="-translate-y-1/2 absolute top-1/2 left-0.5" />
      )}
      {!signed && isLess && (
        <TrendArrowDownIcon className="-translate-y-1/2 absolute top-1/2 left-0.5" />
      )}
      <span
        className={cn(
          'relative inline-block text-right text-xs',
          signed ? 'min-w-12 pl-1.5 md:text-[12.5px]' : 'w-[52px] pl-3.5',
          value === 0 && 'text-secondary',
          textClassName,
        )}
      >
        {isNaN(value)
          ? EM_DASH
          : `${signed ? getSign(value) : ''}${formatPercent(Math.abs(value))}`}
      </span>
    </span>
  )

  if (!period) {
    return content
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild disabledOnMobile={disabledOnMobile}>
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

function getSign(value: number) {
  if (value > 0) return '+'
  if (value < 0) return MINUS_SIGN
  return ''
}
