import { ProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { BridgesTableFilters } from '../../components/table/filters/BridgesTableFilters'
import { IndexCell } from '../../components/table/IndexCell'
import { ProjectCell } from '../../components/table/ProjectCell'
import { getBridgesRowProps } from '../../components/table/props/getBridgesRowProps'
import { RiskCell } from '../../components/table/RiskCell'
import {
  ColumnConfig,
  RowConfig,
  TableView,
} from '../../components/table/TableView'

export interface BridgesRiskViewProps {
  items: BridgesRiskViewEntry[]
}

export interface BridgesRiskViewEntry {
  name: string
  slug: string
  type: 'layer2' | 'bridge'
  warning?: string
  isArchived?: boolean
  isVerified?: boolean
  category: string
  destination: ProjectRiskViewEntry
  validatedBy?: ProjectRiskViewEntry
  sourceUpgradeability?: ProjectRiskViewEntry
  destinationToken?: ProjectRiskViewEntry
}

export function BridgesRiskView({ items }: BridgesRiskViewProps) {
  const onlyBridges = items.filter((x) => x.type === 'bridge')

  const columns: ColumnConfig<BridgesRiskViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (entry, index) => (
        <>
          <span data-bridges-only-cell>
            <IndexCell
              entry={entry}
              index={onlyBridges.indexOf(entry) + 1}
              className="md:pl-4"
            />
          </span>
          <span data-combined-only-cell className="hidden">
            <IndexCell entry={entry} index={index + 1} className="md:pl-4" />
          </span>
        </>
      ),
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (entry) => (
        <ProjectCell highlightL2 type={entry.type} project={entry} />
      ),
    },
    {
      name: 'Destination',
      tooltip: 'What chains can you get to using this bridge?',
      getValue: (entry) => <RiskCell item={entry.destination} />,
    },
    {
      name: 'Validated by',
      tooltip: 'How are the messages sent via this bridge checked?',
      getValue: (entry) => <RiskCell item={entry.validatedBy} />,
    },
    {
      name: 'Type',
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
      getValue: (entry) => (
        <span className="sm:text-xs md:text-base">{entry.category}</span>
      ),
    },
    {
      name: 'Source\nUpgradeability',
      tooltip: 'Are the Ethereum contracts upgradeable?',
      getValue: (entry) => <RiskCell item={entry.sourceUpgradeability} />,
    },
    {
      name: 'Destination\nToken',
      tooltip: 'What is the token that you receive from this bridge?',
      getValue: (entry) => <RiskCell item={entry.destinationToken} />,
    },
  ]

  const rows: RowConfig<BridgesRiskViewEntry> = {
    getProps: getBridgesRowProps,
  }

  return (
    <section className="mt-4 sm:mt-8">
      <BridgesTableFilters className="pb-4" />
      <TableView items={items} columns={columns} rows={rows} />
    </section>
  )
}
