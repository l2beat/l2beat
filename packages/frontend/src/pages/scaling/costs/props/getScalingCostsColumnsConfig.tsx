import React from 'react'

import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import { ColumnConfig, SortingConfig } from '../../../../components/table/types'
import { CostsDataDetails, ScalingCostsViewEntry } from '../types'
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
            <CostsTableCell data={project.costs} type="total" />
          ),
          tooltip:
            'The sum of the costs for calldata, blob data, computation, and an additional 21000 gas overhead per transaction for the selected time period.',
          align: 'center',
          sorting: getSorting('total'),
        },
      ],
    },
    {
      name: 'Calldata',
      getValue: (project) => (
        <CostsTableCell data={project.costs} type="calldata" />
      ),
      tooltip:
        'The sum of the costs for posting data as calldata on Ethereum for the selected time period.',
      align: 'right',
      sorting: getSorting('calldata'),
    },
    {
      name: 'Blobs',
      getValue: (project) => (
        <CostsTableCell data={project.costs} type="blobs" />
      ),
      tooltip:
        'The sum of the costs for posting data as blobs on Ethereum for the selected time period.',
      align: 'right',
      sorting: getSorting('blobs'),
    },
    {
      name: 'Compute',
      getValue: (project) => (
        <CostsTableCell data={project.costs} type="compute" />
      ),
      tooltip:
        'The sum of the costs for carrying out different operations within a transaction for the selected time period.',
      align: 'right',
      sorting: getSorting('compute'),
    },
    {
      name: 'Overhead',
      getValue: (project) => (
        <CostsTableCell data={project.costs} type="overhead" className="pr-4" />
      ),
      headClassName: '!pr-4',
      tooltip:
        'The sum of the fixed 21000 GAS overhead per transaction for the selected time period.',
      align: 'right',
      sorting: getSorting('overhead'),
    },
  ]
  return columns
}

function getSorting(
  type: keyof CostsDataDetails,
): SortingConfig<ScalingCostsViewEntry> {
  return {
    getOrderValue: (project) => ({
      '24H-GAS': project.costs.last24h[type]?.gas.value,
      '7D-GAS': project.costs.last7d[type]?.gas.value,
      '30D-GAS': project.costs.last30d[type]?.gas.value,
      '90D-GAS': project.costs.last90d[type]?.gas.value,
      '24H-ETH': project.costs.last24h[type]?.ethCost.value,
      '7D-ETH': project.costs.last7d[type]?.ethCost.value,
      '30D-ETH': project.costs.last30d[type]?.ethCost.value,
      '90D-ETH': project.costs.last90d[type]?.ethCost.value,
      '24H-USD': project.costs.last24h[type]?.usdCost.value,
      '7D-USD': project.costs.last7d[type]?.usdCost.value,
      '30D-USD': project.costs.last30d[type]?.usdCost.value,
      '90D-USD': project.costs.last90d[type]?.usdCost.value,
    }),
    defaultOrderKey: '7D-USD',
    rule: 'numeric',
  }
}
