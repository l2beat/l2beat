import type { ReactNode } from 'react'
import { PercentChange } from '~/components/PercentChange'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'

interface Props {
  children: ReactNode
  change: number | undefined
  className?: string
  changeClassName?: string
  containerClassName?: string
  changeContainerClassName?: string
  changePeriod?: PercentageChangePeriod
  disabledOnMobile?: boolean
}

export function ValueWithPercentageChange({
  children,
  change,
  className,
  containerClassName,
  changeClassName,
  changeContainerClassName,
  changePeriod,
  disabledOnMobile,
}: Props) {
  return (
    <div className={cn('flex flex-wrap items-center', containerClassName)}>
      <span className={cn('mr-1 font-bold md:text-base', className)}>
        {children}
      </span>
      {change !== undefined && (
        <PercentChange
          value={change}
          className={cn('font-medium', changeContainerClassName)}
          textClassName={changeClassName}
          period={changePeriod}
          disabledOnMobile={disabledOnMobile}
        />
      )}
    </div>
  )
}
