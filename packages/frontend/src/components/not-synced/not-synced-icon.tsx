import { ClockIcon } from '~/icons/clock'
import { type NotSyncedStatus } from '~/types/not-synced-status'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/tooltip'

interface NotSyncedBadgeProps {
  notSyncedStatuses: NotSyncedStatus[] | undefined
}

export function NotSyncedIcon({ notSyncedStatuses }: NotSyncedBadgeProps) {
  if (!notSyncedStatuses || notSyncedStatuses.length === 0) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <ClockIcon />
      </TooltipTrigger>
      <TooltipContent>
        {notSyncedStatuses.map((s) => s.content).join('\n')}
      </TooltipContent>
    </Tooltip>
  )
}
