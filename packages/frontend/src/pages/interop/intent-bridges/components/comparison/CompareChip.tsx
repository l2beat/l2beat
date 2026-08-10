import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

export function CompareChip({
  alignRight,
  className,
  children,
}: {
  alignRight?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'min-w-0 rounded bg-surface-secondary px-2 py-1 font-bold text-label-value-14',
        alignRight && 'text-right',
        className,
      )}
    >
      {children}
    </span>
  )
}
