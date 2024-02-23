import React from 'react'

import { cn } from '../../utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { Badge } from './Badge'

interface NotSyncedBadgeProps {
  displaySyncedUntil: string
  className?: string
}

export function NotSyncedBadge({
  displaySyncedUntil: syncedUntil,
  className,
}: NotSyncedBadgeProps) {
  return (
    <Tooltip className={cn('inline', className)}>
      <TooltipTrigger className="inline">
        <Badge size="extraSmall" padding="regular" type="gray">
          NOT SYNCED
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        The data for this item is not synced since {syncedUntil}.
      </TooltipContent>
    </Tooltip>
  )
}
