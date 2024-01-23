import React from 'react'

import { cn } from '../utils/cn'
export interface SeparatorProps {
  className?: string
}
export function VerticalSeparator({ className }: SeparatorProps) {
  return (
    <hr
      className={cn(
        'h-full border-gray-200 dark:border-gray-850 md:border-l-2',
        className,
      )}
    />
  )
}
