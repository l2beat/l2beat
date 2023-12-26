import React from 'react'

import { TVLProjectBreakdown } from '../../pages/scaling/projects-tvl-breakdown/props/getTvlBreakdownView'
import { getCanonicallyBridgedColumns } from './table/props/getTVLBreakdownTableColumns'
import { TableSum } from './table/TableSum'
import { TVLBreakdownTableView } from './table/TVLBreakdownTableView'

interface CanonicallyBridgedTableProps {
  tokens: TVLProjectBreakdown['canonical']
}

export function CanonicallyBridgedTable(props: CanonicallyBridgedTableProps) {
  const sum = props.tokens.reduce((acc, token) => {
    return acc + Number(token.usdValue)
  }, 0)

  return props.tokens.length === 0 ? null : (
    <div className="flex flex-col px-4 md:px-0">
      <h2 className="mt-12 ml-1 mb-3 text-xl font-bold md:mb-4 md:ml-2 md:text-2xl">
        Canonically Bridged Value
      </h2>
      <TVLBreakdownTableView
        columns={getCanonicallyBridgedColumns()}
        items={props.tokens}
      />
      <TableSum amount={sum} />
    </div>
  )
}
