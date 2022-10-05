import { Layer2 } from '@l2beat/config'
import classNames from 'classnames'
import React from 'react'

import { PercentChange } from '../../../components'
import { NoInfoCell } from '../../../components/NoInfoCell'
import { ProjectLink } from '../../../components/ProjectLink'
import { ColumnConfig, TableView } from '../../../components/TableView'

export interface ActivityViewProps {
  items: ActivityViewEntry[]
  className?: string
}

export interface ActivityViewEntry {
  name: string
  slug: string
  provider: Layer2['technology']['provider']
  tpsDaily: number | undefined
  tpsWeeklyChange: string
  transactionsWeeklyCount: number | undefined
}

export function ActivityView({ items, className }: ActivityViewProps) {
  const columns: ColumnConfig<ActivityViewEntry>[] = [
    {
      name: 'No.',
      getValue: (entry, index) => `${index + 1}.`,
    },
    {
      name: 'Name',
      getValue: (project) => <ProjectLink type="layer2" project={project} />,
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
    <section className={classNames('ActivityView', className)}>
      <TableView items={items} columns={columns} />
    </section>
  )
}
