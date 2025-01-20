import { ClockIcon } from '~/icons/clock'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/tooltip'

interface Props {
  content: string
}

export function NotSyncedIcon({ content }: Props) {
  if (!content) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <ClockIcon />
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}
