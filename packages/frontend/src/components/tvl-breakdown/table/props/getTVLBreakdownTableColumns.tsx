import React from 'react'

import { TVLProjectBreakdown } from '../../../../pages/scaling-projects-tvl-breakdown/props/getTvlBreakdownView'
import { BridgedUsingCell } from '../BridgedUsingCell'
import { TokenAddressCell } from '../TokenAddressCell'
import { TokenAmountCell } from '../TokenAmountCell'
import { TokenNameCell } from '../TokenNameCell'
import { TokenTypeCell } from '../TokenTypeCell'
import { TokenValueCell } from '../TokenValueCell'
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
        <TokenAmountCell amount={token.amount} assetId={token.assetId} />
      ),
    },
    {
      name: 'VALUE',
      minimalWidth: true,
      alignRight: true,
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <TokenValueCell assetId={token.assetId} usdValue={token.usdValue} />
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
        <TokenAmountCell amount={token.amount} assetId={token.assetId} />
      ),
    },
    {
      name: 'VALUE',
      minimalWidth: true,
      alignRight: true,
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <TokenValueCell assetId={token.assetId} usdValue={token.usdValue} />
      ),
    },
  ]

  return columns
}
