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
        'ml-auto text-right text-xs text-zinc-500 tabular-nums md:text-[12.5px] dark:text-n-zinc-300',
        className,
      )}
    >
      {children}
    </div>
  )
}
