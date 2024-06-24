import React from 'react'
import { cn } from '~/utils/cn'

interface IndexCellProps {
  index: number
  className?: string
}

export function IndexCell({ index, className }: IndexCellProps) {
  return (
    <span
      className={cn(
        'ml-auto tabular-nums font-medium text-gray-50 text-xs dark:font-normal dark:text-gray-600',
        className,
      )}
    >
      {index + 1}
    </span>
  )
}
