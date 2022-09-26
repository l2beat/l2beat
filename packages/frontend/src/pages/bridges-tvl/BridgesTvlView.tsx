import React from 'react'

import { PercentChange } from '../../components'
import { ProjectLink } from '../../components/ProjectLink'
import { Column, TableView } from '../../components/TableView'
import { TVLBreakdown, TVLBreakdownProps } from '../../components/TVLBreakdown'

export interface BridgesTvlViewProps {
  items: BridgesTvlViewEntry[]
}

export interface BridgesTvlViewEntry {
  name: string
  slug: string
  tvl: string
  tvlBreakdown: TVLBreakdownProps
  oneDayChange: string
  sevenDayChange: string
  marketShare: string
  type: string
}

export function TvlView({ items }: BridgesTvlViewProps) {
  const columns: Column<BridgesTvlViewEntry>[] = [
    {
      name: 'Name',
      getValue: (entry) => <ProjectLink type="layer2" project={entry} />,
    },
    {
      name: 'TVL',
      alignRight: true,
      getValue: (entry) => entry.tvl,
    },
    {
      name: 'Breakdown',
      alignRight: true,
      getValue: (entry) => <TVLBreakdown {...entry.tvlBreakdown} />,
    },
    {
      name: '7d Change',
      alignRight: true,
      getValue: (entry) => <PercentChange value={entry.sevenDayChange} />,
    },
    {
      name: 'Market share',
      alignRight: true,
      getValue: (entry) => entry.marketShare,
    },
    {
      name: 'Validation',
      alignRight: true,
      getValue: (entry) => entry.type,
    },
    {
      name: 'Type',
      alignRight: true,
      getValue: () => '-',
    },
  ]

  return (
    <section className="mt-4">
      <TableView items={items} columns={columns} />
    </section>
  )
}
