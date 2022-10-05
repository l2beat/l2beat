import { ProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { ProjectLink } from '../../components/ProjectLink'
import { RiskCell } from '../../components/RiskCell'
import { ColumnConfig, RowConfig, TableView } from '../../components/TableView'

export interface BridgesRiskViewProps {
  items: BridgesRiskViewEntry[]
}

export interface BridgesRiskViewEntry {
  name: string
  slug: string
  type: 'layer2' | 'bridge'
  category: string
  destination: ProjectRiskViewEntry
  validation?: ProjectRiskViewEntry
  sourceUpgradeability?: ProjectRiskViewEntry
  destinationToken?: ProjectRiskViewEntry
}

export function BridgesRiskView({ items }: BridgesRiskViewProps) {
  const onlyBridges = items.filter((x) => x.type === 'bridge')

  const columns: ColumnConfig<BridgesRiskViewEntry>[] = [
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
      getValue: (entry) => <ProjectLink type={entry.type} project={entry} />,
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
      getValue: (entry) => (
        <span className="sm:text-xs md:text-base">{entry.category}</span>
      ),
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

  const rows: RowConfig<BridgesRiskViewEntry> = {
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
