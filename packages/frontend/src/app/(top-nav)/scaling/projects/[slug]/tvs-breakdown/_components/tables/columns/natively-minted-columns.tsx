import { createColumnHelper } from '@tanstack/react-table'
import { TokenNameCell } from '../cells/token-name-cell'
import { TokenSimpleAmountCell } from '../cells/token-simple-amount-cell'
import { TokenSimpleValueCell } from '../cells/token-simple-value-cell'
import type { NativelyMintedTokenEntry } from '../natively-minted-table'

const columnHelper = createColumnHelper<NativelyMintedTokenEntry>()

export const nativelyMintedColumns = [
  columnHelper.display({
    id: 'Token',
    header: 'Token',
    cell: (ctx) => <TokenNameCell {...ctx.row.original} />,
  }),
  columnHelper.display({
    id: 'value',
    header: 'Value',
    meta: {
      align: 'right',
    },
    cell: (ctx) => <TokenSimpleValueCell {...ctx.row.original} />,
  }),
  columnHelper.display({
    id: 'amount',
    header: 'Amount',
    meta: {
      align: 'right',
    },
    cell: (ctx) => <TokenSimpleAmountCell amount={ctx.row.original.amount} />,
  }),
]
