import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { cn } from '~/utils/cn'
import { formatNumberWithCommas } from '~/utils/format-number'

interface Props {
  usdValue: number
  isDescendant: boolean
}

export function TokenCanonicalValueCell({ usdValue, isDescendant }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          'text-xs font-medium',
          isDescendant && 'text-black/80 dark:text-white/80',
        )}
      >
        ${formatNumberWithCommas(Number(usdValue))}
      </TooltipTrigger>
      <TooltipContent>
        Calculation formula:
        <br />
        Value = tokens locked in the escrow * price
      </TooltipContent>
    </Tooltip>
  )
}
