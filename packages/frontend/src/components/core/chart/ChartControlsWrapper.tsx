import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

export function ChartControlsWrapper({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex justify-between gap-2 md:gap-4', className)}>
      {children}
    </div>
  )
}
