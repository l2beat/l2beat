import React from 'react'

import { cn } from '../../utils/cn'
import { Badge } from './Badge'

export interface NoDataBadgeProps {
  className?: string
}

export function NoDataBadge(props: NoDataBadgeProps) {
  return (
    <Badge
      className={cn(props.className)}
      type="gray"
      title={"We don't have data for this item"}
      oneSize
    >
      No data
    </Badge>
  )
}
