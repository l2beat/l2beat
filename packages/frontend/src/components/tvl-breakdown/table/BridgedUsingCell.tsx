import { safeGetTokenByAssetId } from '@l2beat/config'
import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

import { ArrowRightIcon } from '../../icons'

interface BridgedUsingCellProps {
  assetId: AssetId
}

export function BridgedUsingCell(props: BridgedUsingCellProps) {
  const token = safeGetTokenByAssetId(props.assetId)

  return (
    <a
      className="flex items-center justify-start gap-1"
      href={`/bridges/projects/${token?.bridgedUsing?.slug ?? ''}`}
    >
      <span className="text-xs font-medium text-blue-700 underline dark:text-blue-500">
        {token?.bridgedUsing?.bridge}
      </span>
      <ArrowRightIcon className="inline-block fill-blue-700 transition-transform dark:fill-blue-500" />
    </a>
  )
}
