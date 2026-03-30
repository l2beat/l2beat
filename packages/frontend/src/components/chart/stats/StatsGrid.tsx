import type { ReactNode } from 'react'
import { OverflowWrapper } from '~/components/core/OverflowWrapper'
import { cn } from '~/utils/cn'

interface StatsGridProps {
  children: ReactNode
  className?: string
}

export function StatsGrid({ children, className }: StatsGridProps) {
  return (
    <OverflowWrapper>
      <div
        className={cn(
          'mx-2 my-3 grid grid-cols-2 gap-2 md:mx-0 lg:grid-cols-4 lg:gap-3',
          className,
        )}
      >
        {children}
      </div>
    </OverflowWrapper>
  )
}
