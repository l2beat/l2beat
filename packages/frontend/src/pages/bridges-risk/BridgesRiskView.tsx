import React from 'react'

import { Column, TableView } from '../../components/TableView'

export interface BridgesRiskViewProps {
  items: BridgesRiskViewEntry[]
}

export interface BridgesRiskViewEntry {
  name: string
  sourceOwnership: string
  sourceUpgradeability: string
  destinationOwnership: string
  destinationUpgradeability: string
}

export function RiskView({ items }: BridgesRiskViewProps) {
  const columns: Column<BridgesRiskViewEntry>[] = [
    {
      name: 'Name',
      getValue: (entry) => <strong>{entry.name}</strong>,
    },
    {
      name: 'S. Own.',
      getValue: (entry) => entry.sourceOwnership,
    },
    {
      name: 'S. Upgrd.',
      getValue: (entry) => entry.sourceUpgradeability,
    },
    {
      name: 'D. Own.',
      getValue: (entry) => entry.destinationOwnership,
    },
    {
      name: 'D. Upgrd.',
      getValue: (entry) => entry.destinationUpgradeability,
    },
  ]

  return (
    <section className="mt-4">
      <TableView items={items} columns={columns} />
    </section>
  )
}
