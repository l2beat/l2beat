import { ClockIcon } from '~/icons/clock'
import { type SyncStatus } from '~/types/sync-status'
import { formatTimestamp } from '~/utils/dates'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/tooltip'

interface NotSyncedBadgeProps {
  syncStatuses: SyncStatus[] | undefined
}

export function NotSyncedIcon({ syncStatuses }: NotSyncedBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <ClockIcon />
      </TooltipTrigger>
      <TooltipContent>
        {syncStatuses?.map(getContent).join('\n')}
      </TooltipContent>
    </Tooltip>
  )
}

function getContent(syncStatus: SyncStatus) {
  switch (syncStatus.type) {
    case 'tvs':
      return `TVS data for this item is not synced since ${formatTimestamp(
        syncStatus.syncedUntil,
        {
          mode: 'datetime',
          longMonthName: true,
        },
      )}.`
    case 'activity':
      return `Activity data for this item is not synced since ${formatTimestamp(
        syncStatus.syncedUntil,
        {
          mode: 'datetime',
          longMonthName: true,
        },
      )}.`
    default:
      return `The data for this item is not synced since ${formatTimestamp(
        syncStatus.syncedUntil,
        {
          mode: 'datetime',
          longMonthName: true,
        },
      )}.`
  }
}
