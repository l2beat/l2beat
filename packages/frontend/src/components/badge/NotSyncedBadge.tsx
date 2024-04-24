import React from 'react'

import { cn } from '../../utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { Badge } from './Badge'

interface NotSyncedBadgeProps {
  displaySyncedUntil?: string
  className?: string
}

export function NotSyncedBadge({
  displaySyncedUntil,
  className,
}: NotSyncedBadgeProps) {
  if (!displaySyncedUntil)
    return (
      <div className={cn('inline', className)}>
        <NotSynced />
      </div>
    )

  return (
    <Tooltip className={cn('inline', className)}>
      <TooltipTrigger className="inline">
        <NotSynced />
      </TooltipTrigger>
      <TooltipContent>
        The data for this item is not synced since {displaySyncedUntil}.
      </TooltipContent>
    </Tooltip>
  )
}

function NotSynced() {
  return (
    <Badge size="extraSmall" padding="regular" type="gray">
      NOT SYNCED
    </Badge>
  )
}
