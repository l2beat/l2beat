import { createColumnHelper } from '@tanstack/react-table'
import { TokenNameCell } from '../cells/token-name-cell'
import { TokenSimpleAmountCell } from '../cells/token-simple-amount-cell'
import { TokenSimpleValueCell } from '../cells/token-simple-value-cell'
import type { NativelyMintedTokenEntry } from '../natively-minted-table'
import { TokenAddressCell } from '../cells/token-address-cell'

const columnHelper = createColumnHelper<NativelyMintedTokenEntry>()

export const nativelyMintedColumns = [
  columnHelper.display({
    id: 'Token',
    header: 'Token',
    cell: (ctx) => <TokenNameCell {...ctx.row.original} />,
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
