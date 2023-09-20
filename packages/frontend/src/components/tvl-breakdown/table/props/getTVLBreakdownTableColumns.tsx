import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

import { TVLProjectBreakdown } from '../../../../pages/scaling-projects-tvl-breakdown/props/getTvlBreakdownView'
import { formatLargeNumberWithCommas } from '../../../../utils'
import { BridgedUsingCell } from '../BridgedUsingCell'
import { EscrowsCell } from '../EscrowsCell'
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

export function getExternallyBridgedColumns(explorer: string) {
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
        <TokenAmountCell
          amount={token.amount}
          assetId={token.assetId}
          forExternal
        />
      ),
    },
    {
      name: 'VALUE',
      minimalWidth: true,
      alignRight: true,
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <TokenValueCell
          assetId={token.assetId}
          usdValue={token.usdValue}
          forExternal
        />
      ),
    },
  ]

  return columns
}

export function getCanonicallyBridgedColumns(explorer: string) {
  const columns: ColumnConfig<{
    assetId: AssetId
    escrows: {
      escrow: string
      usdPrice: string
      usdValue: string
      amount: string
    }[]
    usdPrice: string
    usdValue: string
    amount: string
  }>[] = [
    {
      name: 'TOKEN',
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (token) => <TokenNameCell assetId={token.assetId} />,
    },
    {
      name: 'ESCROW',
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <EscrowsCell
          assetId={token.assetId.toString()}
          escrows={token.escrows}
          explorer={explorer}
        />
      ),
    },
    {
      name: 'PRICE',
      minimalWidth: true,
      headClassName: 'md:pl-4',
      tooltip: 'Prices are fetched from CoinGecko',
      getValue: (token) => (
        <div className="pr-2 text-xs font-medium">
          ${formatLargeNumberWithCommas(Number(token.usdPrice))}
        </div>
      ),
    },
    {
      name: 'AMOUNT',
      minimalWidth: true,
      alignRight: true,
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <TokenAmountCell
          amount={token.amount}
          assetId={token.assetId}
          forCanonical
          escrows={token.escrows}
        />
      ),
    },
    {
      name: 'VALUE',
      minimalWidth: true,
      alignRight: true,
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <TokenValueCell
          assetId={token.assetId}
          usdValue={token.usdValue}
          forCanonical
          escrows={token.escrows}
        />
      ),
    },
  ]

  return columns
}
