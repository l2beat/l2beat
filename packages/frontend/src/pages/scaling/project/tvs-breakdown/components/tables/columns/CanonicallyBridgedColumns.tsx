import { createColumnHelper } from '@tanstack/react-table'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import type { CanonicallyBridgedTokenEntry } from '../CanonicallyBridgedTable'
import { categoryToLabel } from '../categoryToLabel'
import { TokenAddressCell } from '../cells/TokenAddressCell'
import { TokenNameCell } from '../cells/TokenNameCell'
import { TokenValueCell } from '../cells/TokenValueCell'

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
    id: 'category',
    header: 'Category',
    cell: (ctx) => (
      <div className="font-medium text-xs">
        {categoryToLabel(ctx.row.original.category)}
      </div>
    ),
  }),
  columnHelper.display({
    id: 'contract',
    header: 'Contract',
    cell: (ctx) => {
      const { address } = ctx.row.original
      if (!address) return '-'

      if (address === 'multiple')
        return <div className="font-medium text-xs">Multiple</div>

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
        return <div className="font-medium text-xs">Multiple</div>

      return (
        <TokenAddressCell
          address={escrow.address}
          url={escrow.url}
          name={escrow.name}
        />
      )
    },
  }),
  columnHelper.display({
    id: 'value',
    header: 'TVS-Adjusted Value',
    meta: {
      align: 'right',
      tooltip:
        'The value is calculated by multiplying the amount by the token price for most tokens. For some tokens, we use custom calculations to avoid double counting. Expand the section to learn more.',
    },
    cell: (ctx) => {
      return <TokenValueCell {...ctx.row.original} />
    },
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
              'w-[10px] transition-transform duration-300',
              isExpended && 'rotate-180',
            )}
          />
        </button>
      )
    },
  }),
]
