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
        'ml-auto text-right text-xs font-medium tabular-nums text-zinc-500 dark:font-normal dark:text-n-zinc-300',
        className,
      )}
    >
      {children}
    </div>
  )
}
