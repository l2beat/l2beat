import InfoIcon from '~/icons/info.svg'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/tooltip'

interface Props {
  children: React.ReactNode
}

export function TableTooltip({ children }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className="fill-current md:size-3.5" />
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  )
}
