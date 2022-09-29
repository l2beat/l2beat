import React from 'react'

import { PercentChange } from '../../components'
import { ProjectLink } from '../../components/ProjectLink'
import { ColumnConfig, RowConfig, TableView } from '../../components/TableView'
import { TVLBreakdown, TVLBreakdownProps } from '../../components/TVLBreakdown'

export interface BridgesTvlViewProps {
  items: BridgesTvlViewEntry[]
}

export interface BridgesTvlViewEntry {
  type: 'bridge' | 'layer2'
  name: string
  slug: string
  tvl: string
  tvlBreakdown: TVLBreakdownProps
  oneDayChange: string
  sevenDayChange: string
  bridgesMarketShare: string
  combinedMarketShare: string
  category: string
}

export function BridgesTvlView({ items }: BridgesTvlViewProps) {
  const onlyBridges = items.filter((x) => x.type === 'bridge')

  const columns: ColumnConfig<BridgesTvlViewEntry>[] = [
    {
      name: 'No.',
      getValue: (entry, index) => (
        <>
          <span data-bridges-only>{onlyBridges.indexOf(entry) + 1}.</span>
          <span data-combined-only className="hidden">
            {index + 1}.
          </span>
        </>
      ),
    },
    {
      name: 'Name',
      getValue: (entry) => <ProjectLink type="bridge" project={entry} />,
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
      getValue: (entry) => (
        <>
          <span data-bridges-only>{entry.bridgesMarketShare}</span>
          <span data-combined-only className="hidden">
            {entry.combinedMarketShare}
          </span>
        </>
      ),
    },
    {
      name: 'Validation',
      alignRight: true,
      getValue: (entry) => entry.category,
    },
    {
      name: 'Type',
      alignRight: true,
      getValue: () => '-',
    },
  ]

  const rows: RowConfig<BridgesTvlViewEntry> = {
    getProps: (entry) =>
      entry.type === 'bridge'
        ? {}
        : {
            ['data-combined-only']: true,
            className: 'hidden',
          },
  }

  return (
    <section className="mt-4">
      <TableView items={items} columns={columns} rows={rows} />
    </section>
  )
}
