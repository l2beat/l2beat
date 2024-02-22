import React from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { Badge } from './Badge'

export interface UpcomingBadgeProps {
  isShort?: boolean
  className?: string
}

export function UpcomingBadge(props: UpcomingBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge className={props.className} type="gray" size="small">
          {props.isShort ? '?' : 'Coming soon'}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        The data for this item is not available yet
      </TooltipContent>
    </Tooltip>
  )
}
