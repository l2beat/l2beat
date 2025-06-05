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
        'ml-auto text-right font-medium text-xs text-zinc-500 tabular-nums dark:font-normal dark:text-n-zinc-300',
        className,
      )}
    >
      {children}
    </div>
  )
}
