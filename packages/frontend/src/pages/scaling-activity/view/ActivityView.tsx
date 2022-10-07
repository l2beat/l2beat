import { Layer2 } from '@l2beat/config'
import React from 'react'

import { ScalingLegend } from '../../../components/ScalingLegend'
import { NoInfoCell } from '../../../components/table/NoInfoCell'
import { NumberCell } from '../../../components/table/NumberCell'
import { ProjectCell } from '../../../components/table/ProjectCell'
import { ColumnConfig, TableView } from '../../../components/table/TableView'

export interface ActivityViewProps {
  items: ActivityViewEntry[]
}

export interface ActivityViewEntry {
  name: string
  slug: string
  provider: Layer2['technology']['provider']
  warning?: string
  tpsDaily: number | undefined
  tpsWeeklyChange: string
  transactionsWeeklyCount: number | undefined
}

export function ActivityView({ items }: ActivityViewProps) {
  const columns: ColumnConfig<ActivityViewEntry>[] = [
    {
      name: '#',
      alignRight: true,
      minimalWidth: true,
      getValue: (entry, index) => index + 1,
    },
    {
      name: 'Name',
      getValue: (project) => <ProjectCell type="layer2" project={project} />,
    },
    {
      name: 'TPS',
      alignRight: true,
      getValue: (project) =>
        project.tpsDaily ? (
          <NumberCell>{project.tpsDaily}</NumberCell>
        ) : (
          <NoInfoCell />
        ),
    },
    {
      name: '7d Change',
      alignRight: true,
      getValue: (project) => (
        <NumberCell signed>{project.tpsWeeklyChange}</NumberCell>
      ),
    },
    {
      name: '7d Count',
      alignRight: true,
      getValue: (project) => (
        <NumberCell>{project.transactionsWeeklyCount}</NumberCell>
      ),
    },
  ]

  return (
    <section className="mt-4">
      <TableView items={items} columns={columns} />
      <ScalingLegend />
    </section>
  )
}
