import React from 'react'

import { cn } from '../utils/cn'
export interface SeparatorProps {
  className?: string
}
export function HorizontalSeparator({ className }: SeparatorProps) {
  return (
    <hr
      className={cn(
        'w-full border-gray-200 dark:border-zinc-700 md:border-t',
        className,
      )}
    />
  )
}
