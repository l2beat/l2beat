import { createColumnHelper } from '@tanstack/react-table'
import type { ProjectSectionId } from '~/components/projects/sections/types'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getLayer2sCommonProjectColumns } from '~/components/table/common-project-columns/Layer2sCommonProjectColumns'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import type { Layer2sRiskEntry } from '~/server/features/layer2s/risks/getLayer2sRiskEntries'
import { ExitWindowCell } from './ExitWindowCell'

const columnHelper = createColumnHelper<Layer2sRiskEntry>()

export const layer2sRiskColumns = [
  ...getLayer2sCommonProjectColumns(
    columnHelper,
    (row) => `/layer2s/projects/${row.slug}#risk-analysis`,
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
      <ExitWindowCell
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
  project: Layer2sRiskEntry,
  sectionId: ProjectSectionId,
) {
  return `/layer2s/projects/${project.slug}#${sectionId}`
}
