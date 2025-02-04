import { createColumnHelper } from '@tanstack/react-table'
import { TotalCell } from '~/app/(side-nav)/scaling/summary/_components/table/total-cell'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import { TypeInfo } from '~/components/table/cells/type-info'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sort-table-values'
import { getBridgesCommonProjectColumns } from '~/components/table/utils/common-project-columns/bridges-common-project-columns'
import type { BridgesSummaryEntry } from '~/server/features/bridges/get-bridges-summary-entries'

const columnHelper = createColumnHelper<BridgesSummaryEntry>()

export const bridgesSummaryActiveColumns = [
  ...getBridgesCommonProjectColumns(columnHelper),
  columnHelper.accessor((e) => adjustTableValue(e.validatedBy), {
    header: 'Validated by',
    meta: {
      tooltip: 'How are the messages sent via this bridge checked?',
    },
    cell: (ctx) => <TableValueCell value={ctx.row.original.validatedBy} />,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.validatedBy, b.original.validatedBy),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    meta: {
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
    },
    cell: (ctx) => <TypeInfo>{ctx.getValue()}</TypeInfo>,
  }),
  columnHelper.accessor((e) => e.tvs.breakdown?.total, {
    id: 'total',
    header: 'Total',
    meta: {
      align: 'right',
      tooltip:
        'Total value secured in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago.',
    },
    cell: (ctx) => {
      const value = ctx.row.original.tvs
      return (
        <TotalCell
          associatedTokenSymbols={value.associatedTokens}
          tvsWarnings={value.warnings}
          breakdown={value.breakdown}
          change={value.change}
        />
      )
    },
    sortUndefined: 'last',
  }),
]
