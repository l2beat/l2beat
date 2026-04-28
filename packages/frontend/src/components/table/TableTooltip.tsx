import { InfoIcon } from '~/icons/Info'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
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
      <TooltipPortal>
        <TooltipContent className="z-1000">{children}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
