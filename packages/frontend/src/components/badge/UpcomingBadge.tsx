import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/Tooltip'
import { Badge } from './Badge'

interface UpcomingBadgeProps {
  isShort?: boolean
  className?: string
}

export function UpcomingBadge(props: UpcomingBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger className={props.className}>
        <Badge type="gray" size="small">
          {props.isShort ? '?' : 'Coming soon'}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        The data for this item is not available yet
      </TooltipContent>
    </Tooltip>
  )
}
