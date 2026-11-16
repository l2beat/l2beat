import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'
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
      <TooltipTrigger
        className={cn('mb-px', hitAreaClassName)}
        aria-label="More info"
      >
        <InfoIcon className="size-3 fill-current" />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className="z-1000">{children}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

/**
 * Grows the 12px icon's tap target to 26×30px without moving anything, as a
 * missed tap on a header lands on the sort control. Each side stops where
 * something else takes taps:
 * - left: the 6px gap to the sort control in `TableHead`;
 * - right: the header cell's 8px padding (the last column's), so it neither
 *   reaches the next column nor widens the table's scroll area;
 * - bottom: the 9px left under the icon in a 40px header, so it stays out of
 *   the first row.
 */
const hitAreaClassName =
  "relative after:absolute after:-top-2.5 after:-right-2 after:-bottom-2 after:-left-1.5 after:content-['']"
