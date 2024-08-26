import { type Token } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { formatNumberWithCommas } from '~/utils/format-number'

interface Props {
  supply: Token['supply']
  usdValue: string
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
