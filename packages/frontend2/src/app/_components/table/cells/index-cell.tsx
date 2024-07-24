import React from 'react'
import { cn } from '~/utils/cn'

interface IndexCellProps {
  children: number
  className?: string
}

export function IndexCell({ children, className }: IndexCellProps) {
  return (
    <span
      className={cn(
        'ml-auto text-xs font-medium tabular-nums text-gray-50 dark:font-normal dark:text-gray-600',
        className,
      )}
    >
      {children}
    </span>
  )
}
