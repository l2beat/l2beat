import type { ReactNode } from 'react'
import { PercentChange } from '~/components/PercentChange'
import { cn } from '~/utils/cn'

interface Props {
  children: ReactNode
  change: number | undefined
  containerClassName?: string
  className?: string
  changeClassName?: string
}

export function ValueWithPercentageChange({
  children,
  change,
  className,
  containerClassName,
  changeClassName,
}: Props) {
  return (
    <div className={cn('flex flex-wrap items-center', containerClassName)}>
      <span className={cn('mr-1 font-bold md:text-base', className)}>
        {children}
      </span>
      {change !== undefined && (
        <PercentChange
          value={change}
          className="font-medium"
          textClassName={changeClassName}
        />
      )}
    </div>
  )
}
