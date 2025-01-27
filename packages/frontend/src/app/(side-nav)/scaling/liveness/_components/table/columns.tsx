import { createColumnHelper } from '@tanstack/react-table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import {
  TypeCell,
  TypeExplanationTooltip,
} from '~/components/table/cells/type-cell'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { LIVENESS_ANOMALIES_COMING_SOON_PROJECTS } from '~/consts/projects'
import { InfoIcon } from '~/icons/info'
import { AnomalyIndicator } from '../anomaly-indicator'
import { IntervalsHeader } from './intervals-header'
import { LivenessIntervalCell } from './liveness-interval-cell'
import { type ScalingLivenessTableEntry } from './to-table-entry'

const columnHelper = createColumnHelper<ScalingLivenessTableEntry>()

export const columns = [
  ...getScalingCommonProjectColumns(columnHelper),
  columnHelper.group({
    id: 'data',
    header: () => <IntervalsHeader average={true} />,
    columns: [
      columnHelper.accessor('data.batchSubmissions.averageInSeconds', {
        header: 'Tx data\nsubmissions',
        cell: (ctx) => (
          <LivenessIntervalCell
            entry={ctx.row.original}
            dataType="batchSubmissions"
          />
        ),
        sortUndefined: 'last',
        meta: {
          tooltip: 'How often transaction batches are submitted to the L1',
        },
      }),
      columnHelper.accessor('data.proofSubmissions.averageInSeconds', {
        header: 'Proof\nsubmissions',
        cell: (ctx) => (
          <LivenessIntervalCell
            entry={ctx.row.original}
            dataType="proofSubmissions"
          />
        ),
        sortUndefined: 'last',
        meta: {
          tooltip: 'How often validity proofs are submitted to the L1',
        },
      }),
      columnHelper.accessor('data.stateUpdates.averageInSeconds', {
        header: 'State\nupdates',
        cell: (ctx) => (
          <LivenessIntervalCell
            entry={ctx.row.original}
            dataType="stateUpdates"
          />
        ),
        sortUndefined: 'last',
        meta: {
          tooltip: 'How often state roots are submitted to the L1',
        },
      }),
    ],
  }),
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => (
      <TypeCell provider={ctx.row.original.provider}>{ctx.getValue()}</TypeCell>
    ),
    meta: {
      tooltip: <TypeExplanationTooltip showOnlyRollupsDefinitions />,
    },
  }),
  columnHelper.display({
    header: '30-day\nanomalies',
    cell: (ctx) => {
      const entry = ctx.row.original
      const showComingSoon =
        !entry.data?.isSynced ||
        LIVENESS_ANOMALIES_COMING_SOON_PROJECTS.includes(entry.id.toString())

      return (
        <AnomalyIndicator
          anomalies={entry.anomalies}
          showComingSoon={showComingSoon}
        />
      )
    },
    meta: {
      align: 'center',
      tooltip:
        'Anomalies are based on a Z-score. It measures how far away a data point is from a 30-day rolling average. We consider as anomalies the data points with Z-score > 15.',
    },
  }),
  columnHelper.display({
    id: 'explanation',
    cell: (ctx) => {
      const { explanation } = ctx.row.original
      if (!explanation) {
        return null
      }

      return (
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon variant="blue" />
          </TooltipTrigger>
          <TooltipContent>{explanation}</TooltipContent>
        </Tooltip>
      )
    },
    meta: {
      cellClassName: '!pr-4',
    },
  }),
]
