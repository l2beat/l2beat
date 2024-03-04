import React from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { Badge } from './Badge'

export interface NoDataBadgeProps {
  className?: string
}

export function NoDataBadge(props: NoDataBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge className={props.className} type="gray" size="small">
          No data
        </Badge>
      </TooltipTrigger>
      <TooltipContent>We don't have data for this item</TooltipContent>
    </Tooltip>
  )
}
