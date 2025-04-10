import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'

interface Props {
  amount: number
}

export function TokenSimpleAmountCell({ amount }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger className="text-xs font-medium">
        {formatNumberWithCommas(+amount)}
      </TooltipTrigger>
      <TooltipContent>test</TooltipContent>
    </Tooltip>
  )
}
