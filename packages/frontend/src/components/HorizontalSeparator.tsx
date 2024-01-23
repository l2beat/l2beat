import React from 'react'

import { cn } from '../utils/cn'
export interface SeparatorProps {
  className?: string
}
export function HorizontalSeparator({ className }: SeparatorProps) {
  return (
    <hr
      className={cn(
        'w-full border-gray-200 dark:border-gray-800 md:border-t',
        className,
      )}
    />
  )
}
