import { Layer2RiskViewEntry } from '@l2beat/config'
import React from 'react'

import { Column, TableView } from '../../components/TableView'
import { RiskCell } from './RiskCell'

export interface BridgesRiskViewProps {
  items: BridgesRiskViewEntry[]
}

export interface BridgesRiskViewEntry {
  name: string
  sourceOwnership?: Layer2RiskViewEntry
  sourceUpgradeability?: Layer2RiskViewEntry
  destinationOwnership?: Layer2RiskViewEntry
  destinationUpgradeability?: Layer2RiskViewEntry
}

export function RiskView({ items }: BridgesRiskViewProps) {
  const columns: Column<BridgesRiskViewEntry>[] = [
    {
      name: 'Name',
      getValue: (entry) => <strong>{entry.name}</strong>,
    },
    {
      name: 'S. Own.',
      getValue: (entry) => <RiskCell item={entry.sourceOwnership} />,
    },
    {
      name: 'S. Upgrd.',
      getValue: (entry) => <RiskCell item={entry.sourceUpgradeability} />,
    },
    {
      name: 'D. Own.',
      getValue: (entry) => <RiskCell item={entry.destinationOwnership} />,
    },
    {
      name: 'D. Upgrd.',
      getValue: (entry) => <RiskCell item={entry.destinationUpgradeability} />,
    },
  ]

  return (
    <section className="mt-4">
      <TableView items={items} columns={columns} />
    </section>
  )
}
