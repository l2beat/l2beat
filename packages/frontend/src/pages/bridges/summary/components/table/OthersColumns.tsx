import { createColumnHelper } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { getBridgesCommonProjectColumns } from '~/components/table/utils/common-project-columns/BridgesCommonProjectColumns'
import type { BridgesSummaryEntry } from '~/server/features/bridges/getBridgesSummaryEntries'
import { TotalCellWithTokenBreakdown } from './TotalCellWithTokenBreakdown'

const columnHelper = createColumnHelper<BridgesSummaryEntry>()

export const bridgesSummaryOthersColumns = [
  ...getBridgesCommonProjectColumns(
    columnHelper,
    (row) => `/bridges/projects/${row.slug}`,
  ),
  columnHelper.accessor((e) => adjustTableValue(e.destination), {
    header: 'Destination',
    meta: {
      tooltip: 'What chains can you get to using this bridge?',
    },
    cell: (ctx) => <TableValueCell value={ctx.row.original.destination} />,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.destination, b.original.destination),
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
]
