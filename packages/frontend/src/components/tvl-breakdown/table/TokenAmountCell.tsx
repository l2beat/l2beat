import { safeGetTokenByAssetId } from '@l2beat/config'
import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

import { TVLProjectBreakdown } from '../../../pages/scaling/projects-tvl-breakdown/props/getTvlBreakdownView'
import { formatLargeNumberWithCommas } from '../../../utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/Tooltip'

interface TokenAmountCellProps {
  assetId: AssetId
  amount: string
  forCanonical?: boolean
  escrows?: TVLProjectBreakdown['canonical'][number]['escrows']
  forExternal?: boolean
}

export function TokenAmountCell(props: TokenAmountCellProps) {
  const token = safeGetTokenByAssetId(props.assetId)
  const formula =
    token?.formula === 'totalSupply'
      ? 'Total supply'
      : token?.formula === 'circulatingSupply'
      ? 'Circulating supply'
      : ''

  return props.forCanonical && props.escrows ? (
    <Tooltip>
      <TooltipTrigger className="flex flex-col items-end gap-2 text-xs font-medium">
        {formatLargeNumberWithCommas(Number(props.amount))}
        {props.escrows.length > 1 &&
          props.escrows.map((escrow) => (
            <div
              key={escrow.escrowAddress.toString()}
              className="MultipleEscrowsHidden hidden font-normal text-black/80 dark:text-white/80"
              data-token={props.assetId}
            >
              {formatLargeNumberWithCommas(Number(escrow.amount))}
            </div>
          ))}
      </TooltipTrigger>
      <TooltipContent>Circulating supply</TooltipContent>
    </Tooltip>
  ) : (
    <Tooltip>
      <TooltipTrigger className="text-xs font-medium">
        {formatLargeNumberWithCommas(Number(props.amount))}
      </TooltipTrigger>
      <TooltipContent>
        {props.forExternal ? 'Circulating supply' : formula}
      </TooltipContent>
    </Tooltip>
  )
}
