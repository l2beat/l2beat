import { ClockIcon } from '~/icons/Clock'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

interface Props {
  content: string
}

export function NoDataIcon({ content }: Props) {
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
