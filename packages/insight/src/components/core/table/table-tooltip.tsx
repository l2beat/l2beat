import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { InfoIcon } from '~/icons/info'

interface Props {
  children: React.ReactNode
}

export function TableTooltip({ children }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className="mb-px size-3 fill-current" />
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  )
}
