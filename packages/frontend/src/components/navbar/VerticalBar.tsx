import React from 'react'
import { cn } from '../../utils/cn'

interface Props {
  className?: string
}

export function VerticalBar({ className }: Props) {
  return (
    <div className={cn('h-8 w-px bg-gray-300 dark:bg-gray-700', className)} />
  )
}
