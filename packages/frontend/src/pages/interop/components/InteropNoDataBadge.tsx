import type { BadgeProps } from '~/components/badge/Badge'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { cn } from '~/utils/cn'

interface Props {
  className?: string
  size?: BadgeProps['size']
}

const NO_DATA_TOOLTIP_BASE_TEXT =
  "The information is not available as this transfer involves a chain we don't fully support yet."

export function InteropNoDataBadge({ className, size = 'small' }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <NoDataBadge className={cn('select-none', className)} size={size} />
        </span>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className="z-[1000]">
          {NO_DATA_TOOLTIP_BASE_TEXT}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
