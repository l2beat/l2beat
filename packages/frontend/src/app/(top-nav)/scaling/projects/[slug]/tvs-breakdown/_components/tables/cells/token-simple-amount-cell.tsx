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
  isLockedInEscrow?: boolean
}

export function TokenSimpleAmountCell({
  amount,
  supply,
  isLockedInEscrow,
}: Props) {
  const formula = getFormula(supply, isLockedInEscrow)

  return (
    <Tooltip>
      <TooltipTrigger className="text-xs font-medium">
        {formatNumberWithCommas(+amount)}
      </TooltipTrigger>
      <TooltipContent>{formula}</TooltipContent>
    </Tooltip>
  )
}

function getFormula(supply: Token['supply'], isLockedInEscrow?: boolean) {
  if (isLockedInEscrow) {
    return 'Tokens locked in a bridge contract'
  }
  return supply === 'totalSupply'
    ? 'Total Supply'
    : supply === 'circulatingSupply'
      ? 'Circulating Supply'
      : ''
}
