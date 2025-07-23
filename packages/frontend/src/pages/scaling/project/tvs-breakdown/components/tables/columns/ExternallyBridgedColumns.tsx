import { createColumnHelper } from '@tanstack/react-table'
import capitalize from 'lodash/capitalize'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { BridgedUsingCell } from '../cells/BridgedUsingCell'
import { TokenAddressCell } from '../cells/TokenAddressCell'
import { TokenAmountCell } from '../cells/TokenAmountCell'
import { TokenNameCell } from '../cells/TokenNameCell'
import { TokenValueCell } from '../cells/TokenValueCell'
import type { ExternallyBridgedTokenEntry } from '../ExternallyBridgesTable'

const columnHelper = createColumnHelper<ExternallyBridgedTokenEntry>()

export const externallyBridgedColumns = [
  columnHelper.display({
    id: 'Token',
    header: 'Token',
    cell: (ctx) => <TokenNameCell {...ctx.row.original} />,
  }),
  columnHelper.display({
    id: 'category',
    header: 'Category',
    cell: (ctx) => (
      <div className="font-medium text-xs">
        {capitalize(ctx.row.original.category)}
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
    id: 'bridge',
    header: 'Bridged Using',
    meta: {
      headClassName: 'md:pl-6',
      cellClassName: 'md:pl-6',
    },
    cell: (ctx) => <BridgedUsingCell {...ctx.row.original} />,
  }),
  columnHelper.display({
    id: 'value',
    header: 'Value',
    meta: {
      align: 'right',
    },
    cell: (ctx) => <TokenValueCell {...ctx.row.original} />,
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
              'w-[10px] transition-transform duration-300',
              isExpended && 'rotate-180',
            )}
          />
        </button>
      )
    },
  }),
]
