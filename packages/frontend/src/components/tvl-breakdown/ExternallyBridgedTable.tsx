import React from 'react'

import { TVLProjectBreakdown } from '../../pages/scaling/projects-tvl-breakdown/props/getTvlBreakdownView'
import { TVLBreakdownTableView } from './table/TVLBreakdownTableView'
import { TableSum } from './table/TableSum'
import { getExternallyBridgedColumns } from './table/props/getTVLBreakdownTableColumns'

interface ExternallyBridgedTableProps {
  tokens: TVLProjectBreakdown['external']
}

export function ExternallyBridgedTable(props: ExternallyBridgedTableProps) {
  const sum = props.tokens.reduce((acc, token) => {
    return acc + Number(token.usdValue)
  }, 0)

  if (props.tokens.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col px-4 md:px-0">
      <h2 className="mb-3 ml-1 mt-12 text-xl font-bold md:mb-4 md:ml-2 md:text-2xl">
        Externally Bridged Value
      </h2>
      <TVLBreakdownTableView
        columns={getExternallyBridgedColumns()}
        items={props.tokens}
      />
      <TableSum amount={sum} />
    </div>
  )
}
