import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProofSystemCell } from '~/components/table/cells/ProofSystemCell'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import { InfoIcon } from '~/icons/Info'
import { AnomalyIndicator } from '../AnomalyIndicator'
import { IntervalsHeader } from './IntervalsHeader'
import { LivenessIntervalCell } from './LivenessIntervalCell'
import type { ScalingLivenessTableEntry } from './toTableEntry'

const columnHelper = createColumnHelper<ScalingLivenessTableEntry>()

export function getScalingLivenessColumns(hideProofSystem?: boolean) {
  return compact([
    ...getScalingCommonProjectColumns(
      columnHelper,
      (row) => `/scaling/projects/${row.slug}#liveness`,
    ),
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
    !hideProofSystem &&
      columnHelper.accessor('proofSystem', {
        header: 'Proof system',
        cell: (ctx) => <ProofSystemCell {...ctx.row.original} />,
        meta: {
          tooltip:
            'The type of proof system that the project uses to prove its state: either Optimistic (assumed valid unless challenged) or Validity (cryptographically proven upfront)',
        },
      }),
    columnHelper.display({
      header: '30-day\nanomalies',
      cell: (ctx) => {
        const entry = ctx.row.original
        const showComingSoon = !entry.data?.isSynced

        return (
          <AnomalyIndicator
            anomalies={entry.anomalies}
            showComingSoon={showComingSoon}
            hasTrackedContractsChanged={entry.hasTrackedContractsChanged}
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
        cellClassName: 'pr-4!',
      },
    }),
  ])
}
