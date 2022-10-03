import classNames from 'classnames'
import React from 'react'

import { PercentChange } from '../../../components'
import { ColumnConfig, TableView } from '../../../components/TableView'

export interface ActivityViewProps {
  items: ActivityViewEntry[]
  className?: string
}

export interface ActivityViewEntry {
  name: string
  slug: string
  tpsDaily: string
  tpsWeeklyChange: string
  transactionsWeeklyCount: string
}

export function ActivityView({ items, className }: ActivityViewProps) {
  const columns: ColumnConfig<ActivityViewEntry>[] = [
    {
      name: 'No.',
      getValue: (entry, index) => `${index + 1}.`,
    },
    {
      name: 'Name',
      getValue: (project) => project.name,
    },
    {
      name: 'TPS',
      alignRight: true,
      getValue: (project) => project.tpsDaily,
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
