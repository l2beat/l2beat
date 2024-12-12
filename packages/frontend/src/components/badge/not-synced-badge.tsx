import { ClockIcon } from '~/icons/clock'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/tooltip'

interface NotSyncedBadgeProps {
  content?: string
}

export function NotSyncedIcon({ content }: NotSyncedBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <ClockIcon />
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}
