import type { Token } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'

interface Props {
  amount: number
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
