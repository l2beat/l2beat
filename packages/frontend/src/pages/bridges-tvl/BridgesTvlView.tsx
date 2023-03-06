import { ProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { BridgesTableFilters } from '../../components/table/filters/BridgesTableFilters'
import { IndexCell } from '../../components/table/IndexCell'
import { NoInfoCell } from '../../components/table/NoInfoCell'
import { NumberCell } from '../../components/table/NumberCell'
import { ProjectCell } from '../../components/table/ProjectCell'
import { getBridgesRowProps } from '../../components/table/props/getBridgesRowProps'
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
  isArchived?: boolean
  isVerified?: boolean
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
      alignCenter: true,
      minimalWidth: true,
      getValue: (entry, index) => (
        <>
          <span data-bridges-only-cell>
            <IndexCell entry={entry} index={onlyBridges.indexOf(entry) + 1} />
          </span>
          <span data-combined-only-cell className="hidden">
            <IndexCell entry={entry} index={index + 1} />
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
      tooltip: 'Total value locked in escrow contracts on Ethereum.',
      alignRight: true,
      getValue: (entry) => <NumberCell>{entry.tvl}</NumberCell>,
    },
    {
      name: '7d Change',
      tooltip: 'Change in the total value locked as compared to a week ago.',
      alignRight: true,
      getValue: (entry) =>
        !entry.isArchived && (
          <NumberCell signed>{entry.sevenDayChange}</NumberCell>
        ),
    },
    {
      name: 'Breakdown',
      tooltip:
        'Composition of the total value locked broken down by token type.',
      getValue: (entry) =>
        !entry.isArchived && <TVLBreakdown {...entry.tvlBreakdown} />,
    },
    {
      name: 'Mkt share',
      tooltip: 'Share of the sum of total value locked of all projects.',
      alignRight: true,
      getValue: (entry) =>
        !entry.isArchived && (
          <NumberCell>
            <span data-bridges-only-cell>{entry.bridgesMarketShare}</span>
            <span data-combined-only-cell className="hidden">
              {entry.combinedMarketShare}
            </span>
          </NumberCell>
        ),
    },
    {
      name: 'Validated by',
      tooltip: 'How are the messages sent via this bridge checked?',
      getValue: (entry) =>
        entry.validatedBy ? (
          <RiskCell item={entry.validatedBy} />
        ) : (
          <NoInfoCell />
        ),
    },
    {
      name: 'Type',
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
      getValue: (entry) => <TechnologyCell>{entry.category}</TechnologyCell>,
    },
  ]

  const rows: RowConfig<BridgesTvlViewEntry> = {
    getProps: getBridgesRowProps,
  }

  return (
    <section className="mt-4 sm:mt-8">
      <BridgesTableFilters className="pb-4" />
      <TableView items={items} columns={columns} rows={rows} />
    </section>
  )
}
