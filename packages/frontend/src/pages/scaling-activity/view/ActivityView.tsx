import { Layer2 } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { ScalingLegend } from '../../../components/ScalingLegend'
import { ComingSoonCell } from '../../../components/table/ComingSoonCell'
import { EthereumCell } from '../../../components/table/EthereumCell'
import { IndexCell } from '../../../components/table/IndexCell'
import { NumberCell } from '../../../components/table/NumberCell'
import { ProjectCell } from '../../../components/table/ProjectCell'
import { getScalingRowProps } from '../../../components/table/props/getScalingRowProps'
import {
  ColumnConfig,
  RowConfig,
  TableView,
} from '../../../components/table/TableView'
import { formatLargeNumber } from '../../../utils'
import { formatTps } from '../../../utils/formatTps'

export interface ActivityViewProps {
  items: ActivityViewEntry[]
}

export interface ActivityViewEntry {
  name: string
  slug: string
  provider?: Layer2['display']['provider']
  warning?: string
  isVerified?: boolean
  isUpcoming?: boolean
  isArchived?: boolean
  showProjectUnderReview?: boolean
  dataSource?: string
  tpsDaily?: number
  tpsWeeklyChange: string
  transactionsMonthlyCount: number | undefined
  maxTps?: number
  maxTpsDate?: string
}

export function ActivityView({ items }: ActivityViewProps) {
  const columns: ColumnConfig<ActivityViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      minimalWidth: true,
      getValue: (project) =>
        project.slug !== 'ethereum' ? (
          <ProjectCell type="layer2" project={project} />
        ) : (
          <EthereumCell project={project} />
        ),
    },
    {
      name: 'Past day TPS',
      tooltip: 'Transactions per second averaged over the past day.',
      alignRight: true,
      getValue: (project) =>
        project.tpsDaily !== undefined ? (
          <NumberCell>{formatTps(project.tpsDaily)}</NumberCell>
        ) : (
          <ComingSoonCell />
        ),
    },
    {
      name: '7d Change',
      tooltip:
        'Observed change in average daily transactions per second as compared to a week ago.',
      alignRight: true,
      getValue: (project) => (
        <NumberCell signed>{project.tpsWeeklyChange}</NumberCell>
      ),
    },
    {
      name: 'Max daily TPS',
      tooltip:
        'Highest observed transactions per second averaged over a single day.',
      alignRight: true,
      getValue: (project) =>
        project.maxTps !== undefined && (
          <span className="flex items-baseline justify-end gap-1.5">
            <NumberCell>{formatTps(project.maxTps)}</NumberCell>
            <span
              className={cx(
                'text-gray-700 dark:text-gray-300',
                'block min-w-[115px] text-left',
              )}
            >
              on {project.maxTpsDate}
            </span>
          </span>
        ),
    },
    {
      name: '30D Count',
      tooltip: 'Total number of transactions over the past month.',
      alignRight: true,
      getValue: (project) =>
        project.transactionsMonthlyCount ? (
          <NumberCell>
            {formatLargeNumber(project.transactionsMonthlyCount)}
          </NumberCell>
        ) : undefined,
    },
    {
      name: 'Data source',
      tooltip: 'Where is the transaction data coming from.',
      getValue: (project) => project.dataSource,
    },
  ]

  const rows: RowConfig<ActivityViewEntry> = {
    getProps: getScalingRowProps,
  }

  return (
    <section className="mt-4 sm:mt-8">
      <TableView items={items} columns={columns} rows={rows} />
      <ScalingLegend />
    </section>
  )
}
