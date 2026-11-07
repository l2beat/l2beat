import type { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'

export function HistoryInfo({ children }: { children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger
        className="ml-1 inline-flex align-middle text-secondary"
        aria-label="More info"
      >
        <InfoIcon className="size-3 fill-current" />
      </TooltipTrigger>
      <TooltipContent className="max-w-80 font-normal text-label-value-13">
        {children}
      </TooltipContent>
    </Tooltip>
  )
}
