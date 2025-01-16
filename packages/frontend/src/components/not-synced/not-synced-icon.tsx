import { ClockIcon } from '~/icons/clock'
import { type NotSyncedStatus } from '~/types/sync-status'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/tooltip'

interface NotSyncedBadgeProps {
  syncStatuses: NotSyncedStatus[] | undefined
}

export function NotSyncedIcon({ syncStatuses }: NotSyncedBadgeProps) {
  if (!syncStatuses || syncStatuses.length === 0) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <ClockIcon />
      </TooltipTrigger>
      <TooltipContent>
        {syncStatuses.map((s) => s.content).join('\n')}
      </TooltipContent>
    </Tooltip>
  )
}
