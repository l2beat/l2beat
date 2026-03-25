import type React from 'react'
import { OverflowWrapper } from '~/components/core/OverflowWrapper'
import { cn } from '~/utils/cn'

interface StatsGridProps {
  columns: number
  children: React.ReactNode
  className?: string
}

export function StatsGrid({ columns, children, className }: StatsGridProps) {
  return (
    <OverflowWrapper>
      <div
        className={cn('my-3 grid gap-2 lg:gap-3', className)}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {children}
      </div>
    </OverflowWrapper>
  )
}
