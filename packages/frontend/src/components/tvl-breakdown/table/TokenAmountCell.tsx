import { safeGetTokenByAssetId } from '@l2beat/config'
import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

import { formatLargeNumberWithCommas } from '../../../utils'

interface TokenAmountCellProps {
  assetId: AssetId
  amount: string
}

export function TokenAmountCell(props: TokenAmountCellProps) {
  const token = safeGetTokenByAssetId(props.assetId)
  const formula =
    token?.formula === 'totalSupply'
      ? 'Total supply'
      : token?.formula === 'circulatingSupply'
      ? 'Circulating supply'
      : ''

  return (
    <div className="Tooltip text-xs font-medium" title={formula}>
      {formatLargeNumberWithCommas(Number(props.amount))}
    </div>
  )
}
