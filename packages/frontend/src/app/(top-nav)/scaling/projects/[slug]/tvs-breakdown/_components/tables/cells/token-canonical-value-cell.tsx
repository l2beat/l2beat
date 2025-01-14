import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { cn } from '~/utils/cn'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'

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
          isDescendant && 'text-primary text-opacity-80',
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
