import React from 'react'

import { AnomalyIndicator } from '../../../../components/AnomalyIndicator'
import { Badge } from '../../../../components/badge/Badge'
import { InfoIcon } from '../../../../components/icons'
import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import {
  TypeCell,
  TypeColumnTooltip,
} from '../../../../components/table/TypeCell'
import { ColumnConfig } from '../../../../components/table/types'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/tooltip/Tooltip'
import { ScalingLivenessViewEntry } from '../types'
import { LivenessDurationTimeRangeCell } from '../view/LivenessDurationTimeRangeCell'
import { LivenessTimeRangeCell } from '../view/LivenessTimeRangeCell'

export function getScalingLivenessColumnsConfig() {
  const columns: ColumnConfig<ScalingLivenessViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      type: 'group',
      title: (
        <LivenessTimeRangeCell
          last30Days={'30-day average intervals'}
          last90Days={'90-day average intervals'}
          max={'all-time average intervals'}
        />
      ),
      columns: [
        {
          name: 'Tx data\nsubmissions',
          tooltip: 'How often transaction batches are submitted to the L1',
          colSpan: (project) => (!project.isSynced ? 3 : undefined),
          getValue: (project) =>
            project.isSynced ? (
              <LivenessDurationTimeRangeCell
                data={project.batchSubmissions}
                project={project}
                dataType="batchSubmissions"
              />
            ) : (
              <Badge type="gray" className="mr-0 w-full text-center lg:mr-4">
                COMING SOON
              </Badge>
            ),
          sorting: {
            getOrderValue: (project) => {
              if (!project.isSynced)
                return {
                  '30D': undefined,
                  '90D': undefined,
                  MAX: undefined,
                }
              return {
                '30D': project.batchSubmissions?.last30Days?.averageInSeconds,
                '90D': project.batchSubmissions?.last90Days?.averageInSeconds,
                MAX: project.batchSubmissions?.allTime?.averageInSeconds,
              }
            },
            defaultOrderKey: '30D',
            rule: 'numeric',
          },
        },
        {
          name: 'Proof\nsubmissions',
          tooltip: 'How often validity proofs are submitted to the L1',
          getValue: (project) =>
            project.isSynced ? (
              <LivenessDurationTimeRangeCell
                data={project.proofSubmissions}
                project={project}
                dataType="proofSubmissions"
              />
            ) : undefined,
          removeCellOnFalsyValue: true,
          sorting: {
            getOrderValue: (project) => {
              if (!project.isSynced)
                return {
                  '30D': undefined,
                  '90D': undefined,
                  MAX: undefined,
                }
              return {
                '30D': project.proofSubmissions?.last30Days?.averageInSeconds,
                '90D': project.proofSubmissions?.last90Days?.averageInSeconds,
                MAX: project.proofSubmissions?.allTime?.averageInSeconds,
              }
            },
            defaultOrderKey: '30D',
            rule: 'numeric',
          },
        },
        {
          name: 'State\nupdates',
          tooltip: 'How often state roots are submitted to the L1',
          getValue: (project) =>
            project.isSynced ? (
              <LivenessDurationTimeRangeCell
                data={project.stateUpdates}
                project={project}
                dataType="stateUpdates"
              />
            ) : undefined,
          removeCellOnFalsyValue: true,
          sorting: {
            getOrderValue: (project) => {
              if (!project.isSynced)
                return {
                  '30D': undefined,
                  '90D': undefined,
                  MAX: undefined,
                }
              return {
                '30D': project.stateUpdates?.last30Days?.averageInSeconds,
                '90D': project.stateUpdates?.last90Days?.averageInSeconds,
                MAX: project.stateUpdates?.allTime?.averageInSeconds,
              }
            },
            defaultOrderKey: '30D',
            rule: 'numeric',
          },
        },
      ],
    },
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip showOnlyRollupsDefinitions />,
      shortName: 'Type',
      getValue: (project) => (
        <TypeCell provider={project.provider} disableColors>
          {project.category}
        </TypeCell>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: '30-day\nanomalies',
      tooltip:
        'Anomalies are based on a Z-score. It measures how far away a data point is from a 30-day rolling average. We consider as anomalies the data points with Z-score > 15.',
      align: 'center',
      getValue: (project) => (
        <AnomalyIndicator
          anomalyEntries={project.isSynced ? project.anomalyEntries : []}
          showComingSoon={
            !project.isSynced ||
            project.slug === 'linea' ||
            project.slug === 'starknet'
          }
        />
      ),
    },
    {
      name: '',
      getValue: (project) =>
        project.explanation ? (
          <Tooltip className="pr-4">
            <TooltipTrigger>
              <InfoIcon className="fill-blue-550" />
            </TooltipTrigger>
            <TooltipContent>{project.explanation}</TooltipContent>
          </Tooltip>
        ) : null,
    },
  ]
  return columns
}
