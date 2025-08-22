import type { ReactNode } from 'react'
import { PercentChange } from '~/components/PercentChange'
import { cn } from '~/utils/cn'

interface Props {
  children: ReactNode
  change: number | undefined
  className?: string
  changeClassName?: string
  containerClassName?: string
  changeContainerClassName?: string
}

export function ValueWithPercentageChange({
  children,
  change,
  className,
  containerClassName,
  changeClassName,
  changeContainerClassName,
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
        />
      )}
    </div>
  )
}
