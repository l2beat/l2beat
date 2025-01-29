import { createColumnHelper } from '@tanstack/react-table'
import { TotalCell } from '~/app/(side-nav)/scaling/summary/_components/table/total-cell'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import { TypeCell } from '~/components/table/cells/type-cell'
import { sortTableValues } from '~/components/table/sorting/functions/sort-table-values'
import { getBridgesCommonProjectColumns } from '~/components/table/utils/common-project-columns/bridges-common-project-columns'
import { type BridgesSummaryEntry } from '~/server/features/bridges/get-bridges-summary-entries'

const columnHelper = createColumnHelper<BridgesSummaryEntry>()

export const bridgesSummaryActiveColumns = [
  ...getBridgesCommonProjectColumns(columnHelper),
  columnHelper.accessor('validatedBy', {
    header: 'Validated by',
    cell: (ctx) => <TableValueCell value={ctx.getValue()} />,
    meta: {
      tooltip: 'How are the messages sent via this bridge checked?',
    },
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.validatedBy, b.original.validatedBy),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (ctx) => <TypeCell>{ctx.getValue()}</TypeCell>,
    meta: {
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
    },
  }),
  columnHelper.accessor(
    (e) => {
      return e.tvl.breakdown?.total
    },
    {
      id: 'total',
      header: 'Total',
      cell: (ctx) => {
        const value = ctx.row.original.tvl
        return (
          <TotalCell
            associatedTokenSymbols={value.associatedTokens}
            tvlWarnings={value.warnings}
            breakdown={value.breakdown}
            change={value.change}
          />
        )
      },
      sortUndefined: 'last',
      meta: {
        align: 'right',
        tooltip:
          'Total value secured in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago.',
      },
    },
  ),
]
