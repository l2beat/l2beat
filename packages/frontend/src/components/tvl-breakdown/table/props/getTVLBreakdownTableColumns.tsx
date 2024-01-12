import { ChainId } from '@l2beat/shared-pure'
import React from 'react'

import { TVLProjectBreakdown } from '../../../../pages/scaling/projects-tvl-breakdown/props/getTvlBreakdownView'
import { formatLargeNumberWithCommas } from '../../../../utils'
import { BridgedUsingCell } from '../BridgedUsingCell'
import { EscrowsCell } from '../EscrowsCell'
import { TokenAddressCell } from '../TokenAddressCell'
import { TokenAmountCell } from '../TokenAmountCell'
import { TokenNameCell } from '../TokenNameCell'
import { TokenTypeCell } from '../TokenTypeCell'
import { TokenValueCell } from '../TokenValueCell'
import { ColumnConfig } from '../TVLBreakdownTableView'

// ! Now cell width are set to 20% in TVLBreakdownTableView.tsx so adding new columns will break the layout

export function getNativelyMintedColumns() {
  const columns: ColumnConfig<TVLProjectBreakdown['native'][number]>[] = [
    {
      name: 'TOKEN',
      headClassName: 'md:pl-4',
      getValue: (token) => <TokenNameCell assetId={token.assetId} />,
    },
    {
      name: 'CONTRACT',
      headClassName: 'md:pl-4',
      getValue: (token) =>
        token.tokenAddress && (
          <TokenAddressCell
            address={token.tokenAddress}
            explorer={ChainId.getExplorer(token.chainId)}
          />
        ),
    },
    {
      name: 'TYPE',
      headClassName: 'md:pl-4',
      getValue: (token) => <TokenTypeCell assetId={token.assetId} />,
    },
    {
      name: 'AMOUNT',
      align: 'right',
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <TokenAmountCell amount={token.amount} assetId={token.assetId} />
      ),
    },
    {
      name: 'VALUE',
      align: 'right',
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <TokenValueCell assetId={token.assetId} usdValue={token.usdValue} />
      ),
    },
  ]

  return columns
}

export function getExternallyBridgedColumns() {
  const columns: ColumnConfig<TVLProjectBreakdown['external'][number]>[] = [
    {
      name: 'TOKEN',
      headClassName: 'md:pl-4',
      getValue: (token) => <TokenNameCell assetId={token.assetId} />,
    },
    {
      name: 'CONTRACT',
      headClassName: 'md:pl-4',
      getValue: (token) =>
        token.tokenAddress && (
          <TokenAddressCell
            address={token.tokenAddress}
            explorer={ChainId.getExplorer(token.chainId)}
          />
        ),
    },
    {
      name: 'BRIDGED USING',
      headClassName: 'md:pl-4',
      getValue: (token) => <BridgedUsingCell assetId={token.assetId} />,
    },
    {
      name: 'AMOUNT',
      align: 'right',
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
      align: 'right',
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

export function getCanonicallyBridgedColumns() {
  const columns: ColumnConfig<TVLProjectBreakdown['canonical'][number]>[] = [
    {
      name: 'TOKEN',
      headClassName: 'md:pl-4',
      getValue: (token) => <TokenNameCell assetId={token.assetId} />,
    },
    {
      name: 'ESCROW',
      headClassName: 'md:pl-4',
      getValue: (token) => (
        <EscrowsCell
          assetId={token.assetId.toString()}
          escrows={token.escrows}
          explorer={ChainId.getExplorer(token.chainId)}
        />
      ),
    },
    {
      name: 'PRICE',
      headClassName: 'md:pl-4',
      align: 'right',
      tooltip: 'Prices are fetched from CoinGecko',
      getValue: (token) => (
        <div className="pr-2 text-xs font-medium">
          ${formatLargeNumberWithCommas(Number(token.usdPrice))}
        </div>
      ),
    },
    {
      name: 'AMOUNT',
      align: 'right',
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
      align: 'right',
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
