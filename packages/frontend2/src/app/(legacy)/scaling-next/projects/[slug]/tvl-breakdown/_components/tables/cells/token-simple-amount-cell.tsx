import { type Token } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { formatNumberWithCommas } from '~/utils/format-number'

interface Props {
  amount: string
  supply: Token['supply']
}

export function TokenSimpleAmountCell({ amount, supply }: Props) {
  const formula =
    supply === 'totalSupply'
      ? 'Total Supply'
      : supply === 'circulatingSupply'
        ? 'Circulating Supply'
        : ''

  return (
    <Tooltip>
      <TooltipTrigger className="text-xs font-medium">
        {formatNumberWithCommas(+amount)}
      </TooltipTrigger>
      <TooltipContent>{formula}</TooltipContent>
    </Tooltip>
  )
}
