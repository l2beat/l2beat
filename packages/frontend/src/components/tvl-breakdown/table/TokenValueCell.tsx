import { safeGetTokenByAssetId } from '@l2beat/config'
import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

import { TVLProjectBreakdown } from '../../../pages/scaling/projects-tvl-breakdown/props/getTvlBreakdownView'
import { formatNumberWithCommas } from '../../../utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/Tooltip'

interface TokenValueCellProps {
  assetId: AssetId
  usdValue: string
  escrows?: TVLProjectBreakdown['canonical'][number]['escrows']
  forCanonical?: boolean
  forExternal?: boolean
}

export function TokenValueCell(props: TokenValueCellProps) {
  const token = safeGetTokenByAssetId(props.assetId)
  const formula =
    token?.formula === 'totalSupply'
      ? 'total supply'
      : token?.formula === 'circulatingSupply'
        ? 'circulating supply'
        : ''

  return props.forCanonical && props.escrows ? (
    <Tooltip>
      <TooltipTrigger className="flex flex-col items-end gap-2 text-xs font-bold">
        ${formatNumberWithCommas(Number(props.usdValue))}
        {props.escrows.length > 1 &&
          props.escrows.map((escrow) => (
            <div
              key={escrow.escrowAddress.toString()}
              className=" hidden font-normal text-black/80 dark:text-white/80"
              data-role="multiple-escrows-hidden"
              data-token={props.assetId}
            >
              ${formatNumberWithCommas(Number(escrow.usdValue))}
            </div>
          ))}
      </TooltipTrigger>
      <TooltipContent>
        Calculation formula:
        <br />
        Value = circulating supply * price
      </TooltipContent>
    </Tooltip>
  ) : (
    <Tooltip>
      <TooltipTrigger className="text-xs font-bold">
        ${formatNumberWithCommas(Number(props.usdValue))}
      </TooltipTrigger>
      <TooltipContent>
        Calculation formula:
        <br />
        Value = {props.forExternal ? 'circulating supply' : formula} * price
      </TooltipContent>
    </Tooltip>
  )
}
