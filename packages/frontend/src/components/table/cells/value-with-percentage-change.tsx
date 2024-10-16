import { type ReactNode } from 'react'
import { PercentChange } from '~/components/percent-change'
import { cn } from '~/utils/cn'

interface Props {
  children: ReactNode
  change: number | undefined
  containerClassName?: string
  className?: string
}

export function ValueWithPercentageChange({
  children,
  change,
  className,
  containerClassName,
}: Props) {
  return (
    <div className={cn('flex items-center', containerClassName)}>
      <span className={cn('font-bold md:text-base', className)}>
        {children}
      </span>
      {change !== undefined && (
        <PercentChange value={change} className="ml-1 font-medium" />
      )}
    </div>
  )
}
