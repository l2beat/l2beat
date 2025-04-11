import { createColumnHelper } from '@tanstack/react-table'
import { ChevronIcon } from '~/icons/chevron'
import { cn } from '~/utils/cn'
import { TokenAddressCell } from '../cells/token-address-cell'
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
        <ChevronIcon
          className={cn(
            'w-[10px] cursor-pointer transition-transform duration-300',
            isExpended && 'rotate-180',
          )}
          onClick={toggleExpandedHandler}
        />
      )
    },
  }),
]
