import type { Token } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'

interface Props {
  supply: Token['supply']
  usdValue: number
}

export function TokenSimpleValueCell({ supply, usdValue }: Props) {
  const formula =
    supply === 'totalSupply'
      ? 'total supply'
      : supply === 'circulatingSupply'
        ? 'circulating supply'
        : ''

  return (
    <Tooltip>
      <TooltipTrigger className="text-xs font-bold">
        ${formatNumberWithCommas(+usdValue)}
      </TooltipTrigger>
      <TooltipContent>
        Calculation formula:
        <br />
        Value = {formula} * price
      </TooltipContent>
    </Tooltip>
  )
}
