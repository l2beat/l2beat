import { createColumnHelper } from '@tanstack/react-table'
import { TokenNameCell } from '../cells/token-name-cell'
import { TokenSimpleAmountCell } from '../cells/token-simple-amount-cell'
import { TokenSimpleValueCell } from '../cells/token-simple-value-cell'
import type { ExternallyBridgedTokenEntry } from '../externally-bridges-table'

const columnHelper = createColumnHelper<ExternallyBridgedTokenEntry>()

export const externallyBridgedColumns = [
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
