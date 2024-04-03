import React from 'react'

import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import { ColumnConfig, SortingConfig } from '../../../../components/table/types'
import { getColumnHeaderUnderline } from '../../../../utils/table/getColumnHeaderUnderline'
import { CostsDataDetails, ScalingCostsViewEntry } from '../types'
import { CostsBreakdownValueCell } from '../view/CostsBreakdownValueCell'
import { CostsTotalCell } from '../view/CostsTotalCell'
import { CostsTxCountCell } from '../view/CostsTxCountCell'

export function getScalingCostsColumnsConfig() {
  const columns: ColumnConfig<ScalingCostsViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      type: 'group',
      columns: [
        {
          name: 'Total Cost',
          getValue: (project) => <CostsTotalCell data={project.data} />,
          tooltip:
            'The sum of the costs for calldata, blob data, computation, and an additional 21,000 gas overhead per transaction for the selected time period.',
          align: 'center',
          sorting: getSorting('total'),
        },
      ],
    },
    {
      name: 'Calldata',
      getValue: (project) => (
        <CostsBreakdownValueCell data={project.data} type="calldata" />
      ),
      headClassName: getColumnHeaderUnderline(
        'before:bg-sky-550',
        'dark:before:bg-sky-500',
      ),
      tooltip:
        'The sum of the costs for posting data as calldata on Ethereum for the selected time period.',
      align: 'right',
      sorting: getSorting('calldata'),
    },
    {
      name: 'Blobs',
      getValue: (project) => (
        <CostsBreakdownValueCell data={project.data} type="blobs" />
      ),
      headClassName: getColumnHeaderUnderline(
        'before:bg-orange-400',
        'dark:before:bg-yellow-100',
      ),
      tooltip:
        'The sum of the costs for posting data as blobs on Ethereum for the selected time period.',
      align: 'right',
      sorting: getSorting('blobs'),
    },
    {
      name: 'Compute',
      getValue: (project) => (
        <CostsBreakdownValueCell data={project.data} type="compute" />
      ),
      headClassName: getColumnHeaderUnderline('before:bg-pink-100'),
      tooltip:
        'The sum of the costs for carrying out different operations within a transaction for the selected time period.',
      align: 'right',
      sorting: getSorting('compute'),
    },
    {
      name: 'Overhead',
      getValue: (project) => (
        <CostsBreakdownValueCell
          data={project.data}
          type="overhead"
          className="pr-4"
        />
      ),
      headClassName: getColumnHeaderUnderline('before:bg-purple-100'),
      tooltip:
        'The sum of the fixed 21,000 GAS overhead per transaction for the selected time period.',
      align: 'right',
      sorting: getSorting('overhead'),
    },
    {
      name: 'L2 Tx count',
      tooltip: 'Total number of L2 transactions over the selected time period.',
      getValue: (project) => (
        <CostsTxCountCell data={project.data} className="pr-4" />
      ),
      headClassName: '!pr-4',
      align: 'right',
      sorting: {
        getOrderValue: (project) => ({
          '24H': project.data.last24h.txCount?.value,
          '7D': project.data.last7d.txCount?.value,
          '30D': project.data.last30d.txCount?.value,
          '90D': project.data.last90d.txCount?.value,
          '180D': project.data.last180d.txCount?.value,
        }),
        defaultOrderKey: '7D',
        rule: 'numeric',
      },
    },
  ]
  return columns
}

function getSorting(
  type: Exclude<keyof CostsDataDetails, 'txCount'>,
): SortingConfig<ScalingCostsViewEntry> {
  return {
    getOrderValue: (project) => ({
      '1D-GAS-TOTAL': project.data.last24h[type]?.gas.value,
      '7D-GAS-TOTAL': project.data.last7d[type]?.gas.value,
      '30D-GAS-TOTAL': project.data.last30d[type]?.gas.value,
      '90D-GAS-TOTAL': project.data.last90d[type]?.gas.value,
      '180D-GAS-TOTAL': project.data.last180d[type]?.gas.value,
      '1D-ETH-TOTAL': project.data.last24h[type]?.ethCost.value,
      '7D-ETH-TOTAL': project.data.last7d[type]?.ethCost.value,
      '30D-ETH-TOTAL': project.data.last30d[type]?.ethCost.value,
      '90D-ETH-TOTAL': project.data.last90d[type]?.ethCost.value,
      '180D-ETH-TOTAL': project.data.last180d[type]?.ethCost.value,
      '1D-USD-TOTAL': project.data.last24h[type]?.usdCost.value,
      '7D-USD-TOTAL': project.data.last7d[type]?.usdCost.value,
      '30D-USD-TOTAL': project.data.last30d[type]?.usdCost.value,
      '90D-USD-TOTAL': project.data.last90d[type]?.usdCost.value,
      '180D-USD-TOTAL': project.data.last180d[type]?.usdCost.value,
      '1D-GAS-PER-L2-TX': project.data.last24h[type]?.gas.perL2Tx?.value,
      '7D-GAS-PER-L2-TX': project.data.last7d[type]?.gas.perL2Tx?.value,
      '30D-GAS-PER-L2-TX': project.data.last30d[type]?.gas.perL2Tx?.value,
      '90D-GAS-PER-L2-TX': project.data.last90d[type]?.gas.perL2Tx?.value,
      '180D-GAS-PER-L2-TX': project.data.last180d[type]?.gas.perL2Tx?.value,
      '1D-ETH-PER-L2-TX': project.data.last24h[type]?.ethCost.perL2Tx?.value,
      '7D-ETH-PER-L2-TX': project.data.last7d[type]?.ethCost.perL2Tx?.value,
      '30D-ETH-PER-L2-TX': project.data.last30d[type]?.ethCost.perL2Tx?.value,
      '90D-ETH-PER-L2-TX': project.data.last90d[type]?.ethCost.perL2Tx?.value,
      '180D-ETH-PER-L2-TX': project.data.last180d[type]?.ethCost.perL2Tx?.value,
      '1D-USD-PER-L2-TX': project.data.last24h[type]?.usdCost.perL2Tx?.value,
      '7D-USD-PER-L2-TX': project.data.last7d[type]?.usdCost.perL2Tx?.value,
      '30D-USD-PER-L2-TX': project.data.last30d[type]?.usdCost.perL2Tx?.value,
      '90D-USD-PER-L2-TX': project.data.last90d[type]?.usdCost.perL2Tx?.value,
      '180D-USD-PER-L2-TX': project.data.last180d[type]?.usdCost.perL2Tx?.value,
    }),
    defaultOrderKey: '7D-USD-TOTAL',
    rule: 'numeric',
  }
}
