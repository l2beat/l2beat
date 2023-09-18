import React from 'react'

import { TVLProjectBreakdown } from '../../../../pages/scaling-projects-tvl-breakdown/props/getTvlBreakdownView'
import { formatLargeNumberWithCommas } from '../../../../utils'
import { BridgedUsingCell } from '../BridgedUsingCell'
import { TokenAddressCell } from '../TokenAddressCell'
import { TokenNameCell } from '../TokenNameCell'
import { TokenTypeCell } from '../TokenTypeCell'
import { ColumnConfig } from '../TVLBreakdownTableView'

export function getNativelyMintedColumns(explorer: string) {
  const columns: ColumnConfig<TVLProjectBreakdown['native'][number]>[] = [
    {
      name: 'TOKEN',
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (token) => <TokenNameCell assetId={token.assetId} />,
    },
    {
      name: 'CONTRACT',
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (token) =>
        token.tokenAddress && (
          <TokenAddressCell address={token.tokenAddress} explorer={explorer} />
        ),
    },
    {
      name: 'TYPE',
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (token) => <TokenTypeCell assetId={token.assetId} />,
    },
    {
      name: 'AMOUNT',
      minimalWidth: true,
      alignRight: true,
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <div className="text-xs font-medium">
          {formatLargeNumberWithCommas(Number(token.amount))}
        </div>
      ),
    },
    {
      name: 'VALUE',
      minimalWidth: true,
      alignRight: true,
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <div className="text-xs font-medium">
          ${formatLargeNumberWithCommas(Number(token.usdValue))}
        </div>
      ),
    },
  ]

  return columns
}

export function getExternallyMintedColumns(explorer: string) {
  const columns: ColumnConfig<TVLProjectBreakdown['external'][number]>[] = [
    {
      name: 'TOKEN',
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (token) => <TokenNameCell assetId={token.assetId} />,
    },
    {
      name: 'CONTRACT',
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (token) =>
        token.tokenAddress && (
          <TokenAddressCell address={token.tokenAddress} explorer={explorer} />
        ),
    },
    {
      name: 'BRIDGED USING',
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (token) => <BridgedUsingCell assetId={token.assetId} />,
    },
    {
      name: 'AMOUNT',
      minimalWidth: true,
      alignRight: true,
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <div className="text-xs font-medium">
          {formatLargeNumberWithCommas(Number(token.amount))}
        </div>
      ),
    },
    {
      name: 'VALUE',
      minimalWidth: true,
      alignRight: true,
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <div className="text-xs font-medium">
          ${formatLargeNumberWithCommas(Number(token.usdValue))}
        </div>
      ),
    },
  ]

  return columns
}
