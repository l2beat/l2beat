import { ProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { ProjectLink } from '../../components/ProjectLink'
import { Column, TableView } from '../../components/TableView'
import { RiskCell } from './RiskCell'

export interface BridgesRiskViewProps {
  items: BridgesRiskViewEntry[]
}

export interface BridgesRiskViewEntry {
  name: string
  slug: string
  type: string
  destination: ProjectRiskViewEntry
  validation?: ProjectRiskViewEntry
  sourceUpgradeability?: ProjectRiskViewEntry
  destinationToken?: ProjectRiskViewEntry
}

export function BridgesRiskView({ items }: BridgesRiskViewProps) {
  const columns: Column<BridgesRiskViewEntry>[] = [
    {
      name: 'Name',
      getValue: (entry) => <ProjectLink type="bridge" project={entry} />,
    },
    {
      name: 'Destination',
      getValue: (entry) => <RiskCell item={entry.destination} />,
    },
    {
      name: 'Validation',
      getValue: (entry) => <RiskCell item={entry.validation} />,
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
