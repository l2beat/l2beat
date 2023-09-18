import { safeGetTokenByAssetId } from '@l2beat/config'
import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

import { formatLargeNumberWithCommas } from '../../../utils'

interface TokenValueCellProps {
  assetId: AssetId
  usdValue: string
}

export function TokenValueCell(props: TokenValueCellProps) {
  const token = safeGetTokenByAssetId(props.assetId)
  const formula =
    token?.formula === 'totalSupply'
      ? 'total supply'
      : token?.formula === 'circulatingSupply'
      ? 'circulating supply'
      : ''

  return (
    <div
      className="Tooltip text-xs font-medium"
      title={`Calculation formula:<br>Value = ${formula} * price`}
    >
      ${formatLargeNumberWithCommas(Number(props.usdValue))}
    </div>
  )
}
