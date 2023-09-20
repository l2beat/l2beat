import { AssetId } from '@l2beat/shared-pure'
import React from 'react'

import { TVLProjectBreakdown } from '../../pages/scaling-projects-tvl-breakdown/props/getTvlBreakdownView'
import { getCanonicallyBridgedColumns } from './table/props/getTVLBreakdownTableColumns'
import { TableSum } from './table/TableSum'
import { TVLBreakdownTableView } from './table/TVLBreakdownTableView'

interface CanonicallyBridgedTableProps {
  escrows: TVLProjectBreakdown['canonical']
  explorer: string
}

export function CanonicallyBridgedTable(props: CanonicallyBridgedTableProps) {
  const { formattedTokens, sum } = formatTokens(props.escrows)

  return formattedTokens.length === 0 ? null : (
    <div className="flex flex-col px-4">
      <h2 className="mt-12 ml-1 mb-4 text-xl font-bold md:ml-2 md:text-2xl">
        Canonically Bridged Value
      </h2>
      <TVLBreakdownTableView
        columns={getCanonicallyBridgedColumns(props.explorer)}
        items={formattedTokens}
      />
      <TableSum type="CBV" amount={sum} />
    </div>
  )
}

function formatTokens(escrows: TVLProjectBreakdown['canonical']) {
  const tokens: Record<
    string,
    | {
        escrow: string
        usdPrice: string
        usdValue: string
        amount: string
      }[]
  > = {}

  let sum = 0

  for (const escrow in escrows) {
    escrows[escrow].forEach((token) => {
      const assetId = token.assetId.toString()
      if (!Object.hasOwnProperty.call(tokens, assetId)) {
        tokens[assetId] = []
      }
      tokens[assetId].push({
        escrow,
        usdPrice: token.usdPrice,
        usdValue: token.usdValue,
        amount: token.amount,
      })
      sum += Number(token.usdValue)
    })
  }

  const formattedTokens = []
  for (const token in tokens) {
    tokens[token].sort((a, b) => Number(b.usdValue) - Number(a.usdValue))
    const usdPrice = tokens[token][0].usdPrice
    let usdValue = 0
    let amount = 0
    tokens[token].forEach((escrow) => {
      usdValue += Number(escrow.usdValue)
      amount += Number(escrow.amount)
    })
    formattedTokens.push({
      assetId: AssetId(token),
      escrows: tokens[token],
      usdPrice,
      usdValue: usdValue.toString(),
      amount: amount.toString(),
    })
  }

  return {
    formattedTokens,
    sum,
  }
}
