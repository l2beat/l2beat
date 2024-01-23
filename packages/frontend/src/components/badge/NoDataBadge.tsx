import React from 'react'

import { Badge } from './Badge'

export interface NoDataBadgeProps {
  className?: string
}

export function NoDataBadge(props: NoDataBadgeProps) {
  return (
    <Badge
      className={props.className}
      type="gray"
      title={"We don't have data for this item"}
      oneSize
    >
      No data
    </Badge>
  )
}
