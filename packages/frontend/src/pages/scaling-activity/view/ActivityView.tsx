import { Layer2 } from '@l2beat/config'
import React from 'react'

import { PercentChange } from '../../../components'
import { ScalingLegend } from '../../../components/ScalingLegend'
import { NoInfoCell } from '../../../components/table/NoInfoCell'
import { ProjectCell } from '../../../components/table/ProjectCell'
import { ColumnConfig, TableView } from '../../../components/table/TableView'

export interface ActivityViewProps {
  items: ActivityViewEntry[]
}

export interface ActivityViewEntry {
  name: string
  slug: string
  provider: Layer2['technology']['provider']
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
      getValue: (project) => project.tpsDaily ?? <NoInfoCell />,
    },
    {
      name: '7d Change',
      alignRight: true,
      getValue: (project) => <PercentChange value={project.tpsWeeklyChange} />,
    },
    {
      name: '7d Count',
      alignRight: true,
      getValue: (project) => project.transactionsWeeklyCount,
    },
  ]

  return (
    <section className="mt-4">
      <TableView items={items} columns={columns} />
      <ScalingLegend />
    </section>
  )
}
