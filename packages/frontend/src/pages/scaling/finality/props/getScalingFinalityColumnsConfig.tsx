import React from 'react'

import { Badge } from '../../../../components/badge/Badge'
import { FinalityDurationCell } from '../../../../components/table/FinalityDurationCell'
import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import {
  TypeCell,
  TypeColumnTooltip,
} from '../../../../components/table/TypeCell'
import { ColumnConfig } from '../../../../components/table/types'
import { ScalingFinalityViewEntry } from '../types'

export function getScalingFinalityColumnsConfig() {
  const columns: ColumnConfig<ScalingFinalityViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip />,
      shortName: 'Type',
      getValue: (project) => (
        <TypeCell provider={project.provider}>{project.category}</TypeCell>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'DA MODE',
      getValue: (project) =>
        project.dataAvailabilityMode ?? <span>&mdash;</span>,
      tooltip:
        'The type shows whether projects are posting transaction data batches or state diffs to the L1.',
      sorting: {
        getOrderValue: (project) => project.dataAvailabilityMode,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Past day avg.\nTime to inclusion',
      getValue: (project) =>
        project.data ? (
          <FinalityDurationCell data={project.data} />
        ) : (
          <Badge type="gray">COMING SOON</Badge>
        ),
      tooltip:
        'The average time it would take for an L2 transaction to be included on the L1. Please note, this is an approximate estimation and is different than Time to finality since it ignores the overhead time to reach L1 finality after L1 inclusion.',
      sorting: {
        rule: 'numeric',
        getOrderValue: (project) =>
          project.data?.timeToInclusion.averageInSeconds,
      },
    },
    {
      name: 'State update\ndelay',
      tooltip:
        'Time interval between time to finality and state root submission.',
      getValue: () => <Badge type="gray">COMING SOON</Badge>,
    },
    {
      name: 'Execution\ndelay',
      tooltip:
        'Time interval between state root submission and state root finalization. For Optimistic Rollups, this usually corresponds to the challenge period, whereas for ZK Rollups, it might be added as a safety precaution.',
      getValue: (project) => <span>{project.finalizationPeriod}</span>,
    },
  ]
  return columns
}
