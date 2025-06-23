import { InfoIcon } from '~/icons/Info'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/Tooltip'

interface Props {
  children: React.ReactNode
}

export function TableTooltip({ children }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger className="mb-px">
        <InfoIcon className="size-3 fill-current" />
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  )
}
