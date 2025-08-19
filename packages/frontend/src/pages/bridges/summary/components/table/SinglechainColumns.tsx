import { createColumnHelper } from '@tanstack/react-table'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { TableLink } from '~/components/table/TableLink'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns/CommonProjectColumns'
import type { BridgesSummaryEntry } from '~/server/features/bridges/getBridgesSummaryEntries'
import { OthersConsiderationCell } from './OthersConsiderationCell'
import { TotalCellWithTokenBreakdown } from './TotalCellWithTokenBreakdown'

const columnHelper = createColumnHelper<BridgesSummaryEntry>()

export const bridgesSummarySingleChainColumns = [
  ...getCommonProjectColumns(
    columnHelper,
    (row) => `/bridges/projects/${row.slug}`,
  ),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    cell: (ctx) => {
      const destination = ctx.row.original.destination.value
      return (
        <TableLink href={`/bridges/projects/${ctx.row.original.slug}`}>
          <TwoRowCell className="space-y-0.5">
            <TwoRowCell.First>
              <ProjectNameCell project={ctx.row.original} />
            </TwoRowCell.First>
            <TwoRowCell.Second>to {destination}</TwoRowCell.Second>
          </TwoRowCell>
        </TableLink>
      )
    },
  }),
  columnHelper.accessor((e) => e.tvs.breakdown?.total, {
    id: 'tvs',
    header: 'Tvs',
    meta: {
      align: 'right',
      tooltip:
        'Total value secured in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago.',
    },
    cell: (ctx) => {
      const value = ctx.row.original.tvs
      return (
        <TotalCellWithTokenBreakdown
          href={`/bridges/projects/${ctx.row.original.slug}#tvs`}
          associatedTokens={value.associatedTokens}
          tvsWarnings={value.warnings}
          breakdown={value.breakdown}
          change={value.change}
        />
      )
    },
    sortUndefined: 'last',
  }),
  columnHelper.accessor((e) => adjustTableValue(e.validatedBy), {
    header: 'Validation\nmechanism',
    meta: {
      tooltip: 'How are the messages sent via this bridge checked?',
    },
    cell: (ctx) => <TableValueCell value={ctx.row.original.validatedBy} />,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.validatedBy, b.original.validatedBy),
  }),
  columnHelper.accessor((e) => adjustTableValue(e.livenessFailure), {
    header: 'Liveness\nfailure',
    meta: {
      tooltip:
        'Indicates whether there is a mechanism to reclaim deposited funds in case the bridge operators are down.',
    },
    cell: (ctx) => {
      if (!ctx.row.original.livenessFailure) return 'None'
      return <TableValueCell value={ctx.row.original.livenessFailure} />
    },
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.livenessFailure, b.original.livenessFailure),
  }),
  columnHelper.accessor((e) => e.governance, {
    header: 'Governance',
    meta: {
      tooltip:
        'Shows the entities allowed to perform upgrades and pause the bridge.',
    },
    cell: (ctx) => (
      <>
        <div className="flex items-center gap-px">
          <span className="font-bold">Upgrades: </span>
          <TableValueCell
            value={ctx.row.original.governance?.upgrade}
            emptyMode="em-dash"
          />
        </div>
        <div className="flex items-center gap-px">
          <span className="font-bold">Pause: </span>
          <TableValueCell
            value={ctx.row.original.governance?.pause}
            emptyMode="em-dash"
          />
        </div>
      </>
    ),
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.governance?.upgrade,
        b.original.governance?.upgrade,
      ),
  }),
  columnHelper.accessor((e) => e.otherConsiderations, {
    header: 'Other\nconsiderations',
    cell: (ctx) => (
      <OthersConsiderationCell
        otherConsiderations={ctx.row.original.otherConsiderations}
      />
    ),
    sortUndefined: 'last',
  }),
]
