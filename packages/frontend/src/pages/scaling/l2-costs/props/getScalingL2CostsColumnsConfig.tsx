import React from 'react'

import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import { ColumnConfig } from '../../../../components/table/types'
import { ScalingL2CostsViewEntry } from '../types'
import { L2CostsTableCell } from '../view/L2CostsTimeRangeCell'

export function getScalingL2CostsColumnsConfig() {
  const columns: ColumnConfig<ScalingL2CostsViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      type: 'group',
      columns: [
        {
          name: '7D Total Costs',
          getValue: (project) => (
            <L2CostsTableCell data={project.data} type="total" />
          ),
          tooltip:
            'The sum of the costs for calldata, blob data, computation, and an additional 21000 gas overhead per transaction for the selected time period.',
          align: 'right',
        },
      ],
    },
    {
      name: '7D Calldata Costs',
      getValue: (project) => (
        <L2CostsTableCell data={project.data} type="calldata" />
      ),
      tooltip:
        'The sum of the costs for posting data as calldata on Ethereum for the selected time period.',
      align: 'right',
    },
    {
      name: '7D Blobs Costs',
      getValue: (project) => (
        <L2CostsTableCell data={project.data} type="blobs" />
      ),
      tooltip:
        'The sum of the costs for posting data as blobs on Ethereum for the selected time period.',
      align: 'right',
    },
    {
      name: '7D Compute Costs',
      getValue: (project) => (
        <L2CostsTableCell data={project.data} type="compute" />
      ),
      tooltip:
        'The sum of the costs for carrying out different operations within a transaction for the selected time period.',
      align: 'right',
    },
  ]
  return columns
}
