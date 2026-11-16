import { EM_DASH } from '~/consts/characters'
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
}

export function PercentChange({
  value,
  className,
  textClassName,
  period,
  disabledOnTouch,
}: Props) {
  const content = (
    <span
      className={cn(
        'inline-block min-w-[52px] whitespace-nowrap text-right text-xs tabular-nums',
        getChangeColor(value),
        className,
        textClassName,
      )}
    >
      {formatSignedPercent(value)}
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

/**
 * A change as signed text, like home: "+12.0%" or "−3.1%", with a true minus
 * and no arrows. The sign follows the rounded figure, so a change that shows
 * as 0.00% reads as neutral rather than as a gain or a loss.
 */
function formatSignedPercent(value: number) {
  if (Number.isNaN(value)) return EM_DASH
  const magnitude = formatPercent(Math.abs(value))
  if (roundsToZero(value)) return magnitude
  return `${value > 0 ? '+' : '−'}${magnitude}`
}

function getChangeColor(value: number) {
  if (Number.isNaN(value) || roundsToZero(value)) return 'text-secondary'
  return value > 0 ? 'text-positive' : 'text-negative'
}

function roundsToZero(value: number) {
  return Number.parseFloat(formatPercent(Math.abs(value))) === 0
}
