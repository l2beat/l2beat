import React from 'react'

import { TVLProjectBreakdown } from '../../pages/scaling-projects-tvl-breakdown/props/getTvlBreakdownView'
import { getNativelyMintedColumns } from './table/props/getTVLBreakdownTableColumns'
import { TVLBreakdownTableView } from './table/TVLBreakdownTableView'

interface NativelyMintedTableProps {
  tokens: TVLProjectBreakdown['native']
  explorer: string
}

export function NativelyMintedTable(props: NativelyMintedTableProps) {
  return (
    <div className="px-4">
      <h2 className="mt-12 text-2xl font-bold">Natively Minted Value</h2>
      <TVLBreakdownTableView
        columns={getNativelyMintedColumns(props.explorer)}
        items={props.tokens}
      />
    </div>
  )
}
