import { safeGetTokenByAssetId } from '@l2beat/config'
import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

import { ArrowRightIcon, RoundedWarningIcon } from '../../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/Tooltip'

interface BridgedUsingCellProps {
  assetId: AssetId
}

export function BridgedUsingCell(props: BridgedUsingCellProps) {
  const token = safeGetTokenByAssetId(props.assetId)

  return (
    <div className="flex items-center gap-1">
      {token?.bridgedUsing?.slug ? (
        <a
          className="flex items-center justify-start gap-1"
          href={`/bridges/projects/${token.bridgedUsing.slug}`}
        >
          <span className="font-medium text-blue-700 text-xs underline dark:text-blue-500">
            {token.bridgedUsing.bridge}
          </span>
          <ArrowRightIcon className="inline-block fill-blue-700 transition-transform dark:fill-blue-500" />
        </a>
      ) : token?.bridgedUsing ? (
        <span className="font-medium text-xs">{token.bridgedUsing.bridge}</span>
      ) : null}
      {token?.bridgedUsing?.warning && (
        <Tooltip>
          <TooltipTrigger>
            <RoundedWarningIcon className="size-4" sentiment="bad" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2">{token.bridgedUsing.warning}</div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
