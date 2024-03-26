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
          sorting: {
            getOrderValue: (project) => ({
              '24H': project.data.last24h.total.gas,
              '7D': project.data.last7d.total.gas,
              '30D': project.data.last30d.total.gas,
              '90D': project.data.last90d.total.gas,
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
        <CostsTableCell data={project.data} type="calldata" />
      ),
      tooltip:
        'The sum of the costs for posting data as calldata on Ethereum for the selected time period.',
      align: 'right',
      sorting: {
        getOrderValue: (project) => ({
          '24H': project.data.last24h.calldata.gas,
          '7D': project.data.last7d.calldata.gas,
          '30D': project.data.last30d.calldata.gas,
          '90D': project.data.last90d.calldata.gas,
        }),
        defaultOrderKey: '7D',
        rule: 'numeric',
      },
    },
    {
      name: 'Blobs',
      getValue: (project) => (
        <CostsTableCell data={project.data} type="blobs" />
      ),
      tooltip:
        'The sum of the costs for posting data as blobs on Ethereum for the selected time period.',
      align: 'right',
      sorting: {
        getOrderValue: (project) => ({
          '24H': project.data.last24h.blobs.gas,
          '7D': project.data.last7d.blobs.gas,
          '30D': project.data.last30d.blobs.gas,
          '90D': project.data.last90d.blobs.gas,
        }),
        defaultOrderKey: '7D',
        rule: 'numeric',
      },
    },
    {
      name: 'Compute',
      getValue: (project) => (
        <CostsTableCell data={project.data} type="compute" />
      ),
      tooltip:
        'The sum of the costs for carrying out different operations within a transaction for the selected time period.',
      align: 'right',
      sorting: {
        getOrderValue: (project) => ({
          '24H': project.data.last24h.compute.gas,
          '7D': project.data.last7d.compute.gas,
          '30D': project.data.last30d.compute.gas,
          '90D': project.data.last90d.compute.gas,
        }),
        defaultOrderKey: '7D',
        rule: 'numeric',
      },
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
      sorting: {
        getOrderValue: (project) => ({
          '24H': project.data.last24h.overhead.gas,
          '7D': project.data.last7d.overhead.gas,
          '30D': project.data.last30d.overhead.gas,
          '90D': project.data.last90d.overhead.gas,
        }),
        defaultOrderKey: '7D',
        rule: 'numeric',
      },
    },
  ]
  return columns
}
