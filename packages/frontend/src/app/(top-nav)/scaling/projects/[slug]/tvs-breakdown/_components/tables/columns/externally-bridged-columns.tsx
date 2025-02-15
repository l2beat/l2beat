import { createColumnHelper } from '@tanstack/react-table'
import { BridgedUsingCell } from '../cells/bridged-using-cell'
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
    cell: (ctx) => <TokenSimpleAmountCell {...ctx.row.original} />,
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
    id: 'contract',
    header: 'Contract',
    cell: (ctx) => {
      const value = ctx.row.original

      return (
        value.tokenAddress && (
          <TokenAddressCell address={value.tokenAddress} url={value.url} />
        )
      )
    },
  }),
]
