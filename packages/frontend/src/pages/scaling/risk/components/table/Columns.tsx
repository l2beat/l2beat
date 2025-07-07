import { createColumnHelper } from '@tanstack/react-table'
import type { ProjectSectionId } from '~/components/projects/sections/types'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import type { CommonProjectColumnsOptions } from '~/components/table/utils/common-project-columns/CommonProjectColumns'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import type { ScalingRiskEntry } from '~/server/features/scaling/risks/getScalingRiskEntries'

const columnHelper = createColumnHelper<ScalingRiskEntry>()

export const getScalingRiskColumns = (opts?: CommonProjectColumnsOptions) => [
  ...getScalingCommonProjectColumns(
    columnHelper,
    (row) => `/scaling/projects/${row.slug}#risk-analysis`,
    opts,
  ),
  columnHelper.accessor((e) => adjustTableValue(e.risks.stateValidation), {
    header: 'State\nValidation',
    meta: {
      tooltip: 'How is the validity of the system state checked?',
    },
    cell: (ctx) => (
      <TableValueCell
        value={ctx.row.original.risks.stateValidation}
        href={
          ctx.row.original.hasStateValidationSection
            ? getProjectSectionLink(ctx.row.original, 'state-validation')
            : undefined
        }
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.risks.stateValidation,
        b.original.risks.stateValidation,
      ),
  }),
  columnHelper.accessor((e) => adjustTableValue(e.risks.dataAvailability), {
    header: 'Data\nAvailability',
    meta: {
      tooltip: 'Is the data needed to reconstruct the state available?',
    },
    cell: (ctx) => (
      <TableValueCell
        value={ctx.row.original.risks.dataAvailability}
        href={
          ctx.row.original.hasDataAvailabilitySection
            ? getProjectSectionLink(ctx.row.original, 'da-layer')
            : undefined
        }
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.risks.dataAvailability,
        b.original.risks.dataAvailability,
      ),
  }),
  columnHelper.accessor((e) => adjustTableValue(e.risks.exitWindow), {
    header: 'Exit\nWindow',
    meta: {
      tooltip:
        'How much time do users have to exit the system in case of an unwanted upgrade?',
    },
    cell: (ctx) => (
      <TableValueCell
        value={ctx.row.original.risks.exitWindow}
        href={
          ctx.row.original.hasWithdrawalsSection
            ? getProjectSectionLink(ctx.row.original, 'withdrawals')
            : undefined
        }
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.risks.exitWindow, b.original.risks.exitWindow),
  }),
  columnHelper.accessor((e) => adjustTableValue(e.risks.sequencerFailure), {
    header: 'Sequencer\nFailure',
    meta: {
      tooltip:
        "Sequencer is an entity responsible for constructing blocks and deciding on the ordering of user's transactions. What happens if it is offline or censors individual user?",
    },
    cell: (ctx) => (
      <TableValueCell
        value={ctx.row.original.risks.sequencerFailure}
        href={
          ctx.row.original.hasOperatorsSection
            ? getProjectSectionLink(ctx.row.original, 'operator')
            : undefined
        }
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.risks.sequencerFailure,
        b.original.risks.sequencerFailure,
      ),
  }),
  columnHelper.accessor((e) => adjustTableValue(e.risks.proposerFailure), {
    header: 'Proposer\nFailure',
    meta: {
      tooltip:
        'Proposer is an entity responsible for submitting state commitments to Ethereum (optionally, along with the zkProof). What happens if it is offline?',
    },
    cell: (ctx) => (
      <TableValueCell
        value={ctx.row.original.risks.proposerFailure}
        href={
          ctx.row.original.hasOperatorsSection
            ? getProjectSectionLink(ctx.row.original, 'operator')
            : undefined
        }
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.risks.proposerFailure,
        b.original.risks.proposerFailure,
      ),
  }),
]

function getProjectSectionLink(
  project: ScalingRiskEntry,
  sectionId: ProjectSectionId,
) {
  return `/scaling/projects/${project.slug}#${sectionId}`
}
