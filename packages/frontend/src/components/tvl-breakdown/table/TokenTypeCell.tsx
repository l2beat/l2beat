import { safeGetTokenByAssetId } from '@l2beat/config'
import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

interface TokenTypeCellProps {
  assetId: AssetId
}

export function TokenTypeCell(props: TokenTypeCellProps) {
  const token = safeGetTokenByAssetId(props.assetId)
  const tokenType =
    token?.formula === 'totalSupply'
      ? 'Multi-chain'
      : token?.formula === 'circulatingSupply'
      ? 'Single-chain'
      : ''

  return (
    <div className="flex items-center justify-start gap-2 ">
      <span className="text-xs font-medium">{tokenType}</span>
    </div>
  )
}
