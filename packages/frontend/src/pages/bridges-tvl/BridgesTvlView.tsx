import { ProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { NoInfoCell } from '../../components/table/NoInfoCell'
import { NumberCell } from '../../components/table/NumberCell'
import { ProjectCell } from '../../components/table/ProjectCell'
import { RiskCell } from '../../components/table/RiskCell'
import {
  ColumnConfig,
  RowConfig,
  TableView,
} from '../../components/table/TableView'
import { TechnologyCell } from '../../components/table/TechnologyCell'
import { TVLBreakdown, TVLBreakdownProps } from '../../components/TVLBreakdown'

export interface BridgesTvlViewProps {
  items: BridgesTvlViewEntry[]
}

export interface BridgesTvlViewEntry {
  type: 'bridge' | 'layer2'
  name: string
  slug: string
  warning?: string
  tvl: string
  tvlBreakdown: TVLBreakdownProps
  oneDayChange: string
  sevenDayChange: string
  bridgesMarketShare: string
  combinedMarketShare: string
  validatedBy?: ProjectRiskViewEntry
  category: string
}

export function BridgesTvlView({ items }: BridgesTvlViewProps) {
  const onlyBridges = items.filter((x) => x.type === 'bridge')

  const columns: ColumnConfig<BridgesTvlViewEntry>[] = [
    {
      name: '#',
      alignRight: true,
      minimalWidth: true,
      getValue: (entry, index) => (
        <>
          <span data-bridges-only>{onlyBridges.indexOf(entry) + 1}</span>
          <span data-combined-only className="hidden">
            {index + 1}
          </span>
        </>
      ),
    },
    {
      name: 'Name',
      getValue: (entry) => (
        <ProjectCell highlightL2 type={entry.type} project={entry} />
      ),
    },
    {
      name: 'TVL',
      alignRight: true,
      getValue: (entry) => <NumberCell>{entry.tvl}</NumberCell>,
    },
    {
      name: 'Breakdown',
      getValue: (entry) => <TVLBreakdown {...entry.tvlBreakdown} />,
    },
    {
      name: '7d Change',
      alignRight: true,
      getValue: (entry) => (
        <NumberCell signed>{entry.sevenDayChange}</NumberCell>
      ),
    },
    {
      name: 'Market share',
      alignRight: true,
      getValue: (entry) => (
        <NumberCell>
          <span data-bridges-only>{entry.bridgesMarketShare}</span>
          <span data-combined-only className="hidden">
            {entry.combinedMarketShare}
          </span>
        </NumberCell>
      ),
    },
    {
      name: 'Validated by',
      getValue: (entry) =>
        entry.validatedBy ? (
          <RiskCell item={entry.validatedBy} />
        ) : (
          <NoInfoCell />
        ),
    },
    {
      name: 'Type',
      getValue: (entry) => <TechnologyCell>{entry.category}</TechnologyCell>,
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
    <section className="mt-4 sm:mt-8">
      <TableView items={items} columns={columns} rows={rows} />
    </section>
  )
}
