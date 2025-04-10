import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'

interface Props {
  usdValue: number
}

export function TokenSimpleValueCell({ usdValue }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger className="text-xs font-bold">
        ${formatNumberWithCommas(+usdValue)}
      </TooltipTrigger>
      <TooltipContent>
        Calculation formula:
        <br />
        Value = * price
      </TooltipContent>
    </Tooltip>
  )
}
