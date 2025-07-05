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
    <div
      className={cn(
        'flex justify-between gap-x-2 gap-y-2 md:gap-x-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
