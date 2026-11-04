import { ClockIcon } from '~/icons/Clock'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

interface Props {
  className?: string
  content: string
}

export function NoDataIcon({ content, className }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger className={className} aria-label={content}>
        <ClockIcon aria-hidden />
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}
