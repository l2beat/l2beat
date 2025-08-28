import { ClockIcon } from '~/icons/Clock'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

interface Props {
  className?: string
  content: string
}

export function NoDataIcon({ content, className }: Props) {
  if (!content) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger className={className}>
        <ClockIcon />
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}
