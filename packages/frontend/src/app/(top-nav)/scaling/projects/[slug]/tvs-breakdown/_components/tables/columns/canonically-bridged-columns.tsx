import { createColumnHelper } from '@tanstack/react-table'
import type { CanonicallyBridgedTokenEntry } from '../canonically-bridged-table'
import { TokenCanonicalAmountCell } from '../cells/token-canonical-amount-cell'
import { TokenCanonicalValueCell } from '../cells/token-canonical-value-cell'
import { TokenNameCell } from '../cells/token-name-cell'
import { TokenAddressCell } from '../cells/token-address-cell'

const columnHelper = createColumnHelper<CanonicallyBridgedTokenEntry>()
export function getCanonicallyBridgedColumns() {
  return [
    columnHelper.display({
      id: 'token',
      header: 'Token',
      cell: (ctx) => {
        return <TokenNameCell {...ctx.row.original} />
      },
    }),
    columnHelper.display({
      id: 'contract',
      header: 'Contract',
      cell: (ctx) => {
        const { address } = ctx.row.original
        if (!address) return '-'

        if (address === 'multiple')
          return <div className="text-xs font-medium">Multiple</div>

        return <TokenAddressCell address={address.address} url={address.url} />
      },
    }),
    columnHelper.display({
      id: 'value',
      header: 'Value',
      meta: {
        align: 'right',
      },
      cell: (ctx) => {
        const { usdValue } = ctx.row.original

        return <TokenCanonicalValueCell usdValue={usdValue} />
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

        return (
          <TokenCanonicalAmountCell
            amount={amount}
            isDescendant={isParentMultiEscrow}
          />
        )
      },
    }),
  ]
}
