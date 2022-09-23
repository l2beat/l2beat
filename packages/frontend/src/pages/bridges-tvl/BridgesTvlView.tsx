import React from 'react'

import { ProjectLink } from '../../components/ProjectLink'
import { Column, TableView } from '../../components/TableView'
import { formatLargeNumber } from '../../utils'

export interface BridgesTvlViewProps {
  items: BridgesTvlViewEntry[]
}

export interface BridgesTvlViewEntry {
  name: string
  slug: string
  type: string
  tvl: number
}

export function TvlView({ items }: BridgesTvlViewProps) {
  const columns: Column<BridgesTvlViewEntry>[] = [
    {
      name: 'Name',
      getValue: (entry) => <ProjectLink type="bridge" project={entry} />,
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
