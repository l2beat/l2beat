import React from 'react'

import { cn } from '../../utils/cn'
import { Badge } from '../badge/Badge'

export function HiringBadge({ className }: { className?: string }) {
  return (
    <Badge
      type="purple"
      className={cn('ml-1 rounded-sm py-0.5 md:text-2xs', className)}
    >
      We're hiring
    </Badge>
  )
}
