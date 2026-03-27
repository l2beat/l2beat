import type { CSSProperties, ReactNode } from 'react'
import { OverflowWrapper } from '~/components/core/OverflowWrapper'
import { cn } from '~/utils/cn'

interface StatsGridProps {
  columns: number
  columnsMobile: number
  children: ReactNode
  className?: string
}

export function StatsGrid({
  columns,
  columnsMobile,
  children,
  className,
}: StatsGridProps) {
  return (
    <OverflowWrapper>
      <div
        className={cn(
          'stats-grid-cols mx-2 my-3 grid gap-2 md:mx-0 lg:gap-3',
          className,
        )}
        style={
          {
            '--stats-grid-cols-mobile': columnsMobile,
            '--stats-grid-cols-desktop': columns,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </OverflowWrapper>
  )
}
