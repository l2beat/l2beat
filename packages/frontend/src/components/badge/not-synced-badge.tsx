import { ClockIcon } from '~/icons/clock'
import { formatTimestamp } from '~/utils/dates'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/tooltip'

interface NotSyncedBadgeProps {
  syncedUntil?: number
}

export function NotSyncedIcon({ syncedUntil }: NotSyncedBadgeProps) {
  if (!syncedUntil) return <ClockIcon />

  return (
    <Tooltip>
      <TooltipTrigger>
        <ClockIcon />
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
