import { safeGetTokenByAssetId } from '@l2beat/config'
import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

import { TVLProjectBreakdown } from '../../../pages/scaling-projects-tvl-breakdown/props/getTvlBreakdownView'
import { formatLargeNumberWithCommas } from '../../../utils'

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
    <div
      className="Tooltip flex flex-col items-end gap-2 text-xs font-medium"
      title="Circulating supply"
    >
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
    </div>
  ) : (
    <div
      className="Tooltip text-xs font-medium"
      title={props.forExternal ? 'Circulating supply' : formula}
    >
      {formatLargeNumberWithCommas(Number(props.amount))}
    </div>
  )
}
