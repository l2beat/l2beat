import React from 'react'

import { Badge } from '../../../../components/badge/Badge'
import { NumberCell } from '../../../../components/table/NumberCell'
import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import { ColumnConfig } from '../../../../components/table/types'
import { formatNumber } from '../../../../utils'
import { cn } from '../../../../utils/cn'
import { formatTps } from '../../../../utils/formatTps'
import { ActivityViewEntry } from '../types'

export function getScalingActivityColumnsConfig() {
  const columns: ColumnConfig<ActivityViewEntry>[] = [
    ...getProjectWithIndexColumns(),
    {
      name: 'Past day TPS',
      tooltip: 'Transactions per second averaged over the past day.',
      align: 'right',
      colSpan: (project) => (project.data === undefined ? 5 : undefined),
      getValue: (project) =>
        project.data ? (
          <NumberCell>{formatTps(project.data.tpsDaily)}</NumberCell>
        ) : (
          <Badge type="gray" className="mr-0 w-full text-center lg:mr-4">
            MISSING DATA
          </Badge>
        ),
      removeCellOnFalsyValue: true,
      sorting: {
        getOrderValue: (project) => project.data?.tpsDaily,
        rule: 'numeric',
        defaultState: 'desc',
      },
    },
    {
      name: '7d Change',
      tooltip:
        'Observed change in average daily transactions per second as compared to a week ago.',
      align: 'right',
      getValue: (project) =>
        project.data && (
          <NumberCell signed>{project.data.tpsWeeklyChange}</NumberCell>
        ),
      removeCellOnFalsyValue: true,
      sorting: {
        getOrderValue: (project) => project.data?.tpsWeeklyChange,
        rule: 'numeric',
      },
    },
    {
      name: 'Max daily TPS',
      tooltip:
        'Highest observed transactions per second averaged over a single day.',
      align: 'right',
      getValue: (project) =>
        project.data !== undefined && (
          <span className="flex items-baseline justify-end gap-1.5">
            <NumberCell>{formatTps(project.data.maxTps)}</NumberCell>
            <span
              className={cn(
                'text-gray-700 dark:text-gray-300',
                'block min-w-[115px] text-left',
              )}
            >
              on {project.data.maxTpsDate}
            </span>
          </span>
        ),
      removeCellOnFalsyValue: true,
      sorting: {
        getOrderValue: (project) => project.data?.maxTps,
        rule: 'numeric',
      },
    },
    {
      name: '30D Count',
      tooltip: 'Total number of transactions over the past month.',
      align: 'right',
      getValue: (project) =>
        project.data && (
          <NumberCell>
            {formatNumber(project.data.transactionsMonthlyCount)}
          </NumberCell>
        ),
      removeCellOnFalsyValue: true,
      sorting: {
        getOrderValue: (project) => project.data?.transactionsMonthlyCount,
        rule: 'numeric',
      },
    },
    {
      name: 'Data source',
      tooltip: 'Where is the transaction data coming from.',
      getValue: (project) => project.data !== undefined && project.dataSource,
      removeCellOnFalsyValue: true,
    },
  ]
  return columns
}
