import React from 'react'

import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'
import { Badge } from './badge'

interface NotSyncedBadgeProps {
  syncedUntil?: number
  className?: string
}

export function NotSyncedBadge({
  syncedUntil,
  className,
}: NotSyncedBadgeProps) {
  if (!syncedUntil)
    return (
      <div className={cn('inline', className)}>
        <NotSynced />
      </div>
    )

  return (
    <Tooltip>
      <TooltipTrigger className="inline">
        <NotSynced />
      </TooltipTrigger>
      <TooltipContent>
        The data for this item is not synced since{' '}
        {formatTimestamp(syncedUntil, {
          mode: 'datetime',
          longMonthName: true,
        })}
        .
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
