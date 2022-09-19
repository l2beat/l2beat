import React from 'react'

import { Column, TableView } from '../../components/TableView'
import { formatLargeNumber } from '../../utils'

export interface BridgesTvlViewProps {
  items: BridgesTvlViewEntry[]
}

export interface BridgesTvlViewEntry {
  name: string
  type: string
  tvl: number
}

export function TvlView({ items }: BridgesTvlViewProps) {
  const columns: Column<BridgesTvlViewEntry>[] = [
    {
      name: 'Name',
      getValue: (entry) => <strong>{entry.name}</strong>,
    },
    {
      name: 'Type',
      getValue: (entry) => <span>{entry.type}</span>,
    },
    {
      name: 'TVL',
      getValue: (entry) => <span>{formatLargeNumber(entry.tvl)}</span>,
    },
  ]

  return (
    <section className="mt-4">
      <TableView items={items} columns={columns} />
    </section>
  )
}
