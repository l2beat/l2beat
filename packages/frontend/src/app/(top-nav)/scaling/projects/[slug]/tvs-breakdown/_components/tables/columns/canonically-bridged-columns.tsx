import { createColumnHelper } from '@tanstack/react-table'
import type { CanonicallyBridgedTokenEntry } from '../canonically-bridged-table'
import { TokenCanonicalAmountCell } from '../cells/token-canonical-amount-cell'
import { TokenCanonicalValueCell } from '../cells/token-canonical-value-cell'
import { TokenNameCell } from '../cells/token-name-cell'

const columnHelper = createColumnHelper<CanonicallyBridgedTokenEntry>()
export function getCanonicallyBridgedColumns() {
  return [
    columnHelper.display({
      id: 'token',
      header: 'Token',
      cell: (ctx) => {
        // Do not bloat table if parent row is expanded
        const parentRow = ctx.row.getParentRow()

        if (parentRow?.getIsExpanded()) {
          return null
        }

        return <TokenNameCell {...ctx.row.original} />
      },
    }),
    columnHelper.display({
      id: 'value',
      header: 'Value',
      meta: {
        align: 'right',
      },
      cell: (ctx) => {
        const isParentMultiEscrow = false
        const { usdValue } = ctx.row.original

        return (
          <TokenCanonicalValueCell
            usdValue={usdValue}
            isDescendant={isParentMultiEscrow}
          />
        )
      },
    }),
    columnHelper.display({
      id: 'amount',
      header: 'Amount',
      meta: {
        align: 'right',
      },
      cell: (ctx) => {
        const isParentMultiEscrow = false

        const { amount } = ctx.row.original

        const isPreminted = false

        return (
          <TokenCanonicalAmountCell
            amount={amount}
            isPreminted={isPreminted}
            isDescendant={isParentMultiEscrow}
          />
        )
      },
    }),
  ]
}
