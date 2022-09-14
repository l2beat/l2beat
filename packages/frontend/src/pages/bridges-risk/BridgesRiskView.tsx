import { Layer2RiskViewEntry } from '@l2beat/config'
import React from 'react'

import { Column, TableView } from '../../components/TableView'
import { RiskCell } from './RiskCell'

export interface BridgesRiskViewProps {
  items: BridgesRiskViewEntry[]
}

export interface BridgesRiskViewEntry {
  name: string
  destination?: { value: string; description?: string }
  validation?: string
  type: string
  sourceUpgradeability?: Layer2RiskViewEntry
  destinationToken?: Layer2RiskViewEntry
}

export function RiskView({ items }: BridgesRiskViewProps) {
  const columns: Column<BridgesRiskViewEntry>[] = [
    {
      name: 'Name',
      getValue: (entry) => <strong>{entry.name}</strong>,
    },
    {
      name: 'Destination',
      getValue: (entry) => <span>{entry.destination?.value ?? '-'}</span>,
    },
    {
      name: 'Validation',
      getValue: (entry) => <span>{entry.validation}</span>,
    },
    {
      name: 'Type',
      getValue: (entry) => <span>{entry.type}</span>,
    },
    {
      name: 'Upgradeability',
      getValue: (entry) => <RiskCell item={entry.sourceUpgradeability} />,
    },
    {
      name: 'Destination Token',
      getValue: (entry) => <RiskCell item={entry.destinationToken} />,
    },
  ]

  return (
    <section className="mt-4">
      <TableView items={items} columns={columns} />
    </section>
  )
}
