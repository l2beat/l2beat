import React from 'react'

import { TVLProjectBreakdown } from '../../pages/scaling-projects-tvl-breakdown/props/getTvlBreakdownView'
import { getExternallyMintedColumns } from './table/props/getTVLBreakdownTableColumns'
import { TableSum } from './table/TableSum'
import { TVLBreakdownTableView } from './table/TVLBreakdownTableView'

interface ExternallyMintedTableProps {
  tokens: TVLProjectBreakdown['external']
  explorer: string
}

export function ExternallyMintedTable(props: ExternallyMintedTableProps) {
  const sum = props.tokens.reduce((acc, token) => {
    return acc + Number(token.usdValue)
  }, 0)

  return (
    <div className="flex flex-col px-4">
      <h2 className="mt-12 ml-1 mb-4 text-2xl font-bold md:ml-2">
        Externally Minted Value
      </h2>
      <TVLBreakdownTableView
        columns={getExternallyMintedColumns(props.explorer)}
        items={props.tokens}
      />
      <TableSum type="EBV" amount={sum} />
    </div>
  )
}
