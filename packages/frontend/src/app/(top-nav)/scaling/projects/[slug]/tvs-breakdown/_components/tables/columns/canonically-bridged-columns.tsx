import { createColumnHelper } from '@tanstack/react-table'
import type { CanonicallyBridgedTokenEntry } from '../canonically-bridged-table'
import { MultipleEscrowsCell } from '../cells/multiple-escrows-cell'
import { TokenAddressCell } from '../cells/token-address-cell'
import { TokenCanonicalAmountCell } from '../cells/token-canonical-amount-cell'
import { TokenCanonicalValueCell } from '../cells/token-canonical-value-cell'
import { TokenNameCell } from '../cells/token-name-cell'

const columnHelper = createColumnHelper<CanonicallyBridgedTokenEntry>()
export function getCanonicallyBridgedColumns(showSharedEscrowTooltip: boolean) {
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
    columnHelper.display({
      id: 'amount',
      header: 'Amount',
      meta: {
        align: 'right',
        tooltip:
          showSharedEscrowTooltip &&
          'The amount of tokens locked in the escrow. Does not account for differences due to pending deposits and withdrawals.',
      },
      cell: (ctx) => {
        const isParentMultiEscrow = Boolean(
          ctx.row.getParentRow()?.original.escrows.length ?? 0 > 1,
        )

        const { amount, escrows } = ctx.row.original

        const isPreminted = escrows.some((escrow) => escrow.isPreminted)

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
      id: 'escrow',
      header: 'Escrow',
      meta: {
        headClassName: 'md:pl-6',
        cellClassName: 'md:pl-6',
      },
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
            url={value.url}
          />
        )
      },
    }),
    columnHelper.display({
      id: 'contract',
      header: 'Contract',
      cell: (ctx) => {
        const value = ctx.row.original

        return value.tokenAddress ? (
          <TokenAddressCell address={value.tokenAddress} url={value.url} />
        ) : (
          '-'
        )
      },
    }),
  ]
}
