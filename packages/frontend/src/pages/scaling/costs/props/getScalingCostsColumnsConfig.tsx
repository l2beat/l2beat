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
            <CostsTableCell data={project.costs} type="total" />
          ),
          tooltip:
            'The sum of the costs for calldata, blob data, computation, and an additional 21000 gas overhead per transaction for the selected time period.',
          align: 'center',
          sorting: {
            getOrderValue: (project) => ({
              '24H': project.costs.last24h.total.gas.value,
              '7D': project.costs.last7d.total.gas.value,
              '30D': project.costs.last30d.total.gas.value,
              '90D': project.costs.last90d.total.gas.value,
            }),
            defaultOrderKey: '7D',
            rule: 'numeric',
          },
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
      sorting: {
        getOrderValue: (project) => ({
          '24H': project.costs.last24h.calldata.gas.value,
          '7D': project.costs.last7d.calldata.gas.value,
          '30D': project.costs.last30d.calldata.gas.value,
          '90D': project.costs.last90d.calldata.gas.value,
        }),
        defaultOrderKey: '7D',
        rule: 'numeric',
      },
    },
    {
      name: 'Blobs',
      getValue: (project) => (
        <CostsTableCell data={project.costs} type="blobs" />
      ),
      tooltip:
        'The sum of the costs for posting data as blobs on Ethereum for the selected time period.',
      align: 'right',
      sorting: {
        getOrderValue: (project) => ({
          '24H': project.costs.last24h.blobs.gas.value,
          '7D': project.costs.last7d.blobs.gas.value,
          '30D': project.costs.last30d.blobs.gas.value,
          '90D': project.costs.last90d.blobs.gas.value,
        }),
        defaultOrderKey: '7D',
        rule: 'numeric',
      },
    },
    {
      name: 'Compute',
      getValue: (project) => (
        <CostsTableCell data={project.costs} type="compute" />
      ),
      tooltip:
        'The sum of the costs for carrying out different operations within a transaction for the selected time period.',
      align: 'right',
      sorting: {
        getOrderValue: (project) => ({
          '24H': project.costs.last24h.compute.gas.value,
          '7D': project.costs.last7d.compute.gas.value,
          '30D': project.costs.last30d.compute.gas.value,
          '90D': project.costs.last90d.compute.gas.value,
        }),
        defaultOrderKey: '7D',
        rule: 'numeric',
      },
    },
    {
      name: 'Overhead',
      getValue: (project) => (
        <CostsTableCell data={project.costs} type="overhead" className="pr-4" />
      ),
      headClassName: '!pr-4',
      tooltip:
        'Hey Adi 👋 If you see this I probably forgot to ask for this tooltip.',
      align: 'right',
      sorting: {
        getOrderValue: (project) => ({
          '24H': project.costs.last24h.overhead.gas.value,
          '7D': project.costs.last7d.overhead.gas.value,
          '30D': project.costs.last30d.overhead.gas.value,
          '90D': project.costs.last90d.overhead.gas.value,
        }),
        defaultOrderKey: '7D',
        rule: 'numeric',
      },
    },
  ]
  return columns
}
