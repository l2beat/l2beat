import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

interface IndexCellProps {
  children: ReactNode
  className?: string
}

export function IndexCell({ children, className }: IndexCellProps) {
  return (
    <div
      className={cn(
        'ml-auto text-right font-medium text-secondary text-xs tabular-nums dark:font-normal',
        className,
      )}
    >
      {children}
    </div>
  )
}
