import { createColumnHelper } from '@tanstack/react-table'
import { ChevronIcon } from '~/icons/chevron'
import { cn } from '~/utils/cn'
import type { CanonicallyBridgedTokenEntry } from '../canonically-bridged-table'
import { TokenAddressCell } from '../cells/token-address-cell'
import { TokenAmountCell } from '../cells/token-amount-cell'
import { TokenNameCell } from '../cells/token-name-cell'
import { TokenValueCell } from '../cells/token-value-cell'

const columnHelper = createColumnHelper<CanonicallyBridgedTokenEntry>()
export const canonicallyBridgedColumns = [
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
    id: 'escrow',
    header: 'Escrow',
    cell: (ctx) => {
      const { escrow } = ctx.row.original
      if (!escrow) return '-'

      if (escrow === 'multiple')
        return <div className="text-xs font-medium">Multiple</div>

      return <TokenAddressCell address={escrow.address} url={escrow.url} />
    },
  }),
  columnHelper.display({
    id: 'value',
    header: 'Value',
    meta: {
      align: 'right',
    },
    cell: (ctx) => {
      return <TokenValueCell {...ctx.row.original} />
    },
  }),
  columnHelper.display({
    id: 'amount',
    header: 'Amount',
    meta: {
      align: 'right',
    },
    cell: (ctx) => <TokenAmountCell {...ctx.row.original} />,
  }),
  columnHelper.display({
    id: 'expand',
    meta: {
      align: 'right',
    },
    cell: (ctx) => {
      if (!ctx.row.getCanExpand()) return null
      const isExpended = ctx.row.getIsExpanded()
      const toggleExpandedHandler = ctx.row.getToggleExpandedHandler()

      return (
        <button
          onClick={toggleExpandedHandler}
          className="h-full cursor-pointer px-2 align-middle"
        >
          <ChevronIcon
            className={cn(
              'w-[10px]   transition-transform duration-300',
              isExpended && 'rotate-180',
            )}
          />
        </button>
      )
    },
  }),
]
