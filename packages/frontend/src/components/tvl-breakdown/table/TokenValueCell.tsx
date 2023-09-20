import { safeGetTokenByAssetId } from '@l2beat/config'
import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

import { formatLargeNumberWithCommas } from '../../../utils'

interface TokenValueCellProps {
  assetId: AssetId
  usdValue: string
  escrows?: {
    escrow: string
    usdPrice: string
    usdValue: string
    amount: string
  }[]
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
    <div
      className="Tooltip flex flex-col items-end gap-2 text-xs font-bold"
      title="Calculation formula:<br>Value = circulating supply * price"
    >
      ${formatLargeNumberWithCommas(Number(props.usdValue))}
      {props.escrows.length > 1 &&
        props.escrows.map((escrow) => (
          <div
            key={escrow.escrow}
            className="MultipleEscrowsHidden hidden font-normal text-black/80 dark:text-white/80"
            data-token={props.assetId}
          >
            ${formatLargeNumberWithCommas(Number(escrow.usdValue))}
          </div>
        ))}
    </div>
  ) : (
    <div
      className="Tooltip text-xs font-bold"
      title={`Calculation formula:<br>Value = ${
        props.forExternal ? 'circulating supply' : formula
      } * price`}
    >
      ${formatLargeNumberWithCommas(Number(props.usdValue))}
    </div>
  )
}
