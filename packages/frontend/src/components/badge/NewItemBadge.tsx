import React from 'react'

import { cn } from '../../utils/cn'
import { Badge } from './Badge'

export function NewItemBadge({ className }: { className?: string }) {
  return (
    <Badge
      type="brightYellow"
      className={cn('rounded-sm px-1 md:rounded md:px-1.5', className)}
    >
      New
    </Badge>
  )
}
