import { createColumnHelper } from '@tanstack/react-table'
import { formatNumberWithCommas } from '~/utils/format-number'
import { type CanonicallyBridgedTokenEntry } from '../canonically-bridged-table'
import { MultipleEscrowsCell } from '../cells/multiple-escrows-cell'
import { TokenAddressCell } from '../cells/token-address-cell'
import { TokenCanonicalAmountCell } from '../cells/token-canonical-amount-cell'
import { TokenCanonicalValueCell } from '../cells/token-canonical-value-cell'
import { TokenNameCell } from '../cells/token-name-cell'

const columnHelper = createColumnHelper<CanonicallyBridgedTokenEntry>()
export const canonicallyBridgedColumns = [
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
    id: 'escrow',
    header: 'Escrow',
    cell: (ctx) => {
      const value = ctx.row.original
      const isExpended = ctx.row.getIsExpanded()
      const toggleExpandedHandler = ctx.row.getToggleExpandedHandler()

      if (value.escrows.length > 1) {
        return (
          <MultipleEscrowsCell
            setIsExpanded={toggleExpandedHandler}
            isExpanded={isExpended}
          />
        )
      }

      return (
        <TokenAddressCell
          address={value.escrows[0]!.escrowAddress}
          explorer={value.explorerUrl}
        />
      )
    },
  }),
  columnHelper.display({
    id: 'price',
    header: 'Price',
    meta: {
      align: 'right',
      tooltip: 'Prices are fetched from CoinGecko',
    },
    cell: (ctx) => {
      // Do not bloat table if parent row is expanded
      const parentRow = ctx.row.getParentRow()

      if (parentRow?.getIsExpanded()) {
        return null
      }

      return (
        <div className="pr-2 text-xs font-medium">
          ${formatNumberWithCommas(Number(ctx.row.original.usdPrice))}
        </div>
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
      const isParentMultiEscrow = Boolean(
        ctx.row.getParentRow()?.original.escrows.length ?? 0 > 1,
      )

      const { amount } = ctx.row.original

      const isPreminted = ctx.row.original.escrows.some(
        (escrow) => escrow.isPreminted,
      )

      return (
        <TokenCanonicalAmountCell
          amount={amount}
          isPreminted={isPreminted}
          isDescendant={isParentMultiEscrow}
        />
      )
    },
  }),
  columnHelper.display({
    id: 'value',
    header: 'Value',
    meta: {
      align: 'right',
    },
    cell: (ctx) => {
      const isParentMultiEscrow = Boolean(
        ctx.row.getParentRow()?.original.escrows.length ?? 0 > 1,
      )

      const { usdValue } = ctx.row.original

      return (
        <TokenCanonicalValueCell
          usdValue={usdValue}
          isDescendant={isParentMultiEscrow}
        />
      )
    },
  }),
]
