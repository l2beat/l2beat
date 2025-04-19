import { createColumnHelper } from '@tanstack/react-table'
import { TotalCell } from '~/app/(side-nav)/scaling/summary/_components/table/total-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sort-table-values'
import { TableLink } from '~/components/table/table-link'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns/common-project-columns'
import { EM_DASH } from '~/consts/characters'
import type { BridgesSummaryEntry } from '~/server/features/bridges/get-bridges-summary-entries'

const columnHelper = createColumnHelper<BridgesSummaryEntry>()

export const bridgesSummarySingleChainColumns = [
  ...getCommonProjectColumns(
    columnHelper,
    (row) => `/bridges/projects/${row.slug}`,
  ),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    cell: (ctx) => {
      const destination = ctx.row.original.destination
      const destinationText =
        destination.length === 1
          ? destination[0]
          : `${destination[0]} & ${destination.length - 1} more`
      return (
        <TableLink href={`/bridges/projects/${ctx.row.original.slug}`}>
          <TwoRowCell className="space-y-0.5">
            <TwoRowCell.First>
              <ProjectNameCell project={ctx.row.original} />
            </TwoRowCell.First>
            <TwoRowCell.Second>{destinationText}</TwoRowCell.Second>
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
        <TotalCell
          href={`/bridges/projects/${ctx.row.original.slug}#tvs`}
          associatedTokenSymbols={value.associatedTokens}
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
    cell: (ctx) => {
      if (!ctx.row.original.livenessFailure) return 'None'
      return <TableValueCell value={ctx.row.original.livenessFailure} />
    },
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.livenessFailure, b.original.livenessFailure),
  }),
  columnHelper.accessor((e) => adjustTableValue(e.sourceUpgradeability), {
    header: 'Governance',
    cell: (ctx) => (
      <>
        <div>
          <span className="font-bold">Upgrades: </span>
          {ctx.row.original.sourceUpgradeability?.value ?? EM_DASH}
        </div>
        <div>
          <span className="font-bold">Pause: </span>
          {ctx.row.original.sourceUpgradeability?.secondLine ?? EM_DASH}
        </div>
      </>
    ),
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.sourceUpgradeability,
        b.original.sourceUpgradeability,
      ),
  }),
  columnHelper.accessor((e) => e.otherConsiderations, {
    header: 'Other\nconsiderations',
    cell: (ctx) => (
      <span>{ctx.row.original.otherConsiderations?.length ?? 'None'}</span>
    ),
    sortUndefined: 'last',
  }),
]
