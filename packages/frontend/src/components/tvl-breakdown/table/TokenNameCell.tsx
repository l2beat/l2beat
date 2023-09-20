import { safeGetTokenByAssetId } from '@l2beat/config'
import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

interface TokenNameCellProps {
  assetId: AssetId
}

export function TokenNameCell(props: TokenNameCellProps) {
  const token = safeGetTokenByAssetId(props.assetId)
  return (
    <div className="flex items-center justify-start gap-2 pr-5">
      <img src={token?.iconUrl} className="h-5 w-5 rounded-full" />
      <span className="text-xs font-medium">{token?.symbol}</span>
    </div>
  )
}
