import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { type ScalingLivenessTableEntry } from './to-table-entry'
import {
  TypeCell,
  TypeExplanationTooltip,
} from '~/app/_components/table/cells/type-cell'
import { AnomalyIndicator } from '../anomaly-indicator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import InfoIcon from '~/icons/info.svg'
import { LivenessIntervalCell } from './liveness-interval-cell'
import { IntervalsHeader } from './intervals-header'

const columnHelper = createColumnHelper<ScalingLivenessTableEntry>()

export const columns = [
  // TODO: Make sure this is centered
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    meta: {
      headClassName: 'w-0',
      cellClassName: 'flex items-center',
    },
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <Image
        className="min-h-[18px] min-w-[18px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={18}
        height={18}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    meta: {
      headClassName: 'w-0',
      cellClassName: '!pr-0 md:pl-1',
    },
  }),
  columnHelper.accessor('name', {
    cell: (ctx) => (
      <ProjectNameCell
        project={ctx.row.original}
        type={ctx.row.original.type}
      />
    ),
  }),
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
  columnHelper.accessor('anomalies', {
    header: '30-day\nanomalies',
    enableSorting: false,
    cell: (ctx) => {
      const entry = ctx.row.original
      const showComingSoon =
        !entry.data?.syncStatus.isSynced ||
        entry.slug === 'linea' ||
        entry.slug === 'starknet' ||
        entry.slug === 'scroll'

      return (
        <AnomalyIndicator
          anomalyEntries={ctx.getValue()}
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
            <InfoIcon className="fill-blue-550" />
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
