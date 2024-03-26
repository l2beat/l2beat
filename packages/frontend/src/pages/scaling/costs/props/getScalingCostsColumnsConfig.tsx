import React from 'react'

import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import { ColumnConfig } from '../../../../components/table/types'
import { ScalingCostsViewEntry } from '../types'
import { CostsTableCell } from '../view/CostsTimeRangeCell'

export function getScalingCostsColumnsConfig() {
  const columns: ColumnConfig<ScalingCostsViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      type: 'group',
      columns: [
        {
          name: 'Total Cost',
          getValue: (project) => (
            <CostsTableCell data={project.data} type="total" />
          ),
          tooltip:
            'The sum of the costs for calldata, blob data, computation, and an additional 21000 gas overhead per transaction for the selected time period.',
          align: 'center',
        },
      ],
    },
    {
      name: 'Calldata',
      getValue: (project) => (
        <CostsTableCell data={project.data} type="calldata" />
      ),
      tooltip:
        'The sum of the costs for posting data as calldata on Ethereum for the selected time period.',
      align: 'right',
    },
    {
      name: 'Blobs',
      getValue: (project) => (
        <CostsTableCell data={project.data} type="blobs" />
      ),
      tooltip:
        'The sum of the costs for posting data as blobs on Ethereum for the selected time period.',
      align: 'right',
    },
    {
      name: 'Compute',
      getValue: (project) => (
        <CostsTableCell data={project.data} type="compute" />
      ),
      tooltip:
        'The sum of the costs for carrying out different operations within a transaction for the selected time period.',
      align: 'right',
    },
    {
      name: 'Overhead',
      getValue: (project) => (
        <CostsTableCell data={project.data} type="overhead" className="pr-4" />
      ),
      headClassName: '!pr-4',
      tooltip:
        'Hey Adi 👋 If you see this I probably forgot to ask for this tooltip.',
      align: 'right',
    },
  ]
  return columns
}
