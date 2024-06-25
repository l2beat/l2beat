import React from 'react'

import { Badge } from '../../../../components/badge/Badge'
import { FinalityDurationCell } from '../../../../components/table/FinalityDurationCell'
import {
  TypeCell,
  TypeColumnTooltip,
} from '../../../../components/table/TypeCell'
import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
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
        // Replace the first space with a non-breaking space
        project.dataAvailabilityMode?.replace(' ', ' ') ?? <span>&mdash;</span>,
      className: 'whitespace-nowrap md:whitespace-normal',
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
          <FinalityDurationCell
            scope="timeToInclusion"
            warning={project.data.timeToInclusion.warning}
            timings={project.data.timeToInclusion}
            syncStatus={project.data.syncStatus}
          />
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
        'Time interval between time to inclusion and state root submission.',
      getValue: (project) => {
        return project.data && project.data.stateUpdateDelay ? (
          project.data.stateUpdateDelay.averageInSeconds === 0 ? (
            'None'
          ) : (
            <FinalityDurationCell
              scope="stateUpdateDelay"
              warning={project.data.stateUpdateDelay.warning}
              timings={project.data.stateUpdateDelay}
              syncStatus={project.data.syncStatus}
            />
          )
        ) : (
          <Badge type="gray">COMING SOON</Badge>
        )
      },
      sorting: {
        rule: 'numeric',
        getOrderValue: (project) =>
          project.data?.stateUpdateDelay?.averageInSeconds,
      },
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
