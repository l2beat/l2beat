import { createColumnHelper } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import { sortTableValues } from '~/components/table/sorting/functions/sort-table-values'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { type ScalingRiskEntry } from '~/server/features/scaling/risks/get-scaling-risk-entries'

const columnHelper = createColumnHelper<ScalingRiskEntry>()

export const scalingRiskColumns = [
  ...getScalingCommonProjectColumns(columnHelper),
  columnHelper.accessor('risks.stateValidation', {
    header: 'State\nValidation',
    meta: {
      tooltip: 'How is the validity of the system state checked?',
    },
    cell: (ctx) => <TableValueCell value={ctx.getValue()} />,
    sortUndefined: 'last',
    sortDescFirst: true,
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.risks.stateValidation,
        b.original.risks.stateValidation,
      ),
  }),
  columnHelper.accessor('risks.dataAvailability', {
    header: 'Data\nAvailability',
    meta: {
      tooltip: 'Is the data needed to reconstruct the state available?',
    },
    cell: (ctx) => <TableValueCell value={ctx.getValue()} />,
    sortUndefined: 'last',
    sortDescFirst: true,
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.risks.dataAvailability,
        b.original.risks.dataAvailability,
      ),
  }),
  columnHelper.accessor('risks.exitWindow', {
    header: 'Exit\nWindow',
    meta: {
      tooltip:
        'How much time do users have to exit the system in case of an unwanted upgrade?',
    },
    cell: (ctx) => <TableValueCell value={ctx.getValue()} />,
    sortUndefined: 'last',
    sortDescFirst: true,
    sortingFn: (a, b) =>
      sortTableValues(a.original.risks.exitWindow, b.original.risks.exitWindow),
  }),
  columnHelper.accessor('risks.sequencerFailure', {
    header: 'Sequencer\nFailure',
    meta: {
      tooltip:
        "Sequencer is an entity responsible for constructing blocks and deciding on the ordering of user's transactions. What happens if it is offline or censors individual user?",
    },
    cell: (ctx) => <TableValueCell value={ctx.getValue()} />,
    sortUndefined: 'last',
    sortDescFirst: true,
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.risks.sequencerFailure,
        b.original.risks.sequencerFailure,
      ),
  }),
  columnHelper.accessor('risks.proposerFailure', {
    header: 'Proposer\nFailure',
    meta: {
      tooltip:
        'Proposer is an entity responsible for submitting state commitments to Ethereum (optionally, along with the zkProof). What happens if it is offline?',
    },
    cell: (ctx) => <TableValueCell value={ctx.getValue()} />,
    sortUndefined: 'last',
    sortDescFirst: true,
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.risks.proposerFailure,
        b.original.risks.proposerFailure,
      ),
  }),
]
