import type { ReactNode } from 'react'
import { PercentChange } from '~/components/PercentChange'
import {
  PERIOD_LABEL,
  type PercentageChangePeriod,
} from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'

interface Props {
  children: ReactNode
  change: number | undefined
  className?: string
  changeClassName?: string
  containerClassName?: string
  changeContainerClassName?: string
  changePeriod?: PercentageChangePeriod
  /**
   * Writes the period after the change, as in "−5.93% / 7d". Table cells
   * leave it off and keep the period in the tooltip.
   */
  showPeriod?: boolean
  disabledOnTouch?: boolean
}

export function ValueWithPercentageChange({
  children,
  change,
  className,
  containerClassName,
  changeClassName,
  changeContainerClassName,
  changePeriod,
  showPeriod,
  disabledOnTouch,
}: Props) {
  return (
    <div className={cn('flex flex-wrap items-center', containerClassName)}>
      <span className={cn('mr-1 font-bold md:text-base', className)}>
        {children}
      </span>
      {change !== undefined &&
        (showPeriod && changePeriod ? (
          <span className="flex items-baseline gap-1 whitespace-nowrap">
            <PercentChange
              value={change}
              className={cn(
                'min-w-0 text-left font-medium',
                changeContainerClassName,
              )}
              textClassName={changeClassName}
              period={changePeriod}
              disabledOnTouch={disabledOnTouch}
            />
            <span
              className={cn(
                'text-xs',
                changeClassName,
                'font-medium text-secondary',
              )}
            >
              / {PERIOD_LABEL[changePeriod]}
            </span>
          </span>
        ) : (
          <PercentChange
            value={change}
            className={cn('font-medium', changeContainerClassName)}
            textClassName={changeClassName}
            period={changePeriod}
            disabledOnTouch={disabledOnTouch}
          />
        ))}
    </div>
  )
}
