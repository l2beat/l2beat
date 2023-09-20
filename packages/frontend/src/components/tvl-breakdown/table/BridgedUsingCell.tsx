import { safeGetTokenByAssetId } from '@l2beat/config'
import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

interface BridgedUsingCellProps {
  assetId: AssetId
}

export function BridgedUsingCell(props: BridgedUsingCellProps) {
  const token = safeGetTokenByAssetId(props.assetId)

  return (
    <div className="flex items-center justify-start gap-2 ">
      <span className="text-xs font-medium">{token?.bridgedUsing}</span>
    </div>
  )
}
