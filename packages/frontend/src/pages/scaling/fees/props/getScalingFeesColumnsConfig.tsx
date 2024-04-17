import React from 'react'

import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import { ColumnConfig } from '../../../../components/table/types'
import { ScalingFeesViewEntry } from '../types'

export function getScalingFeesColumnsConfig() {
  const columns: ColumnConfig<ScalingFeesViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      name: 'Native token transfer',
      tooltip: 'Total number of L2 transactions over the selected time period.',
      getValue: (project) =>
        project.data && (
          <span className="pr-4">${project.data.ethTransfer.usdFee}</span>
        ),
      headClassName: '!pr-4',
    },
    {
      name: 'ERC-20 token transfer',
      tooltip: 'Total number of L2 transactions over the selected time period.',
      getValue: (project) =>
        project.data && (
          <span className="pr-4">${project.data.erc20Transfer.usdFee}</span>
        ),
      headClassName: '!pr-4',
    },
    {
      name: 'Swap',
      tooltip: 'Total number of L2 transactions over the selected time period.',
      getValue: (project) =>
        project.data && (
          <span className="pr-4">${project.data.swap.usdFee}</span>
        ),
      headClassName: '!pr-4',
    },
  ]
  return columns
}
