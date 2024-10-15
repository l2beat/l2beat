import { formatTimestamp } from '~/utils/dates'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/tooltip'
import { Badge } from './badge'

interface NotSyncedBadgeProps {
  syncedUntil?: number
}

export function NotSyncedBadge({ syncedUntil }: NotSyncedBadgeProps) {
  if (!syncedUntil) return <NotSynced />

  return (
    <Tooltip>
      <TooltipTrigger>
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
    <Badge
      size="extraSmall"
      padding="regular"
      type="gray"
      className="flex items-center justify-center !leading-none md:h-5"
    >
      NOT SYNCED
    </Badge>
  )
}
