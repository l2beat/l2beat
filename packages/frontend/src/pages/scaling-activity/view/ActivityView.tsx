import { Layer2 } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { ScalingLegend } from '../../../components/ScalingLegend'
import { EthereumCell } from '../../../components/table/EthereumCell'
import { NoInfoCell } from '../../../components/table/NoInfoCell'
import { NumberCell } from '../../../components/table/NumberCell'
import { ProjectCell } from '../../../components/table/ProjectCell'
import {
  ColumnConfig,
  RowConfig,
  TableView,
} from '../../../components/table/TableView'

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
      getValue: (project) =>
        project.slug !== 'ethereum' ? (
          <ProjectCell type="layer2" project={project} />
        ) : (
          <EthereumCell project={project} />
        ),
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

  const rows: RowConfig<ActivityViewEntry> = {
    getProps: (entry) =>
      entry.name === 'Ethereum'
        ? {
            className: cx(
              'bg-blue-400 hover:bg-blue-400 border-b-blue-600',
              'dark:bg-blue-900 dark:border-b-blue-500 dark:hover:bg-blue-900',
            ),
          }
        : {},
  }

  return (
    <section className="mt-4 sm:mt-8">
      <TableView items={items} columns={columns} rows={rows} />
      <ScalingLegend />
    </section>
  )
}
