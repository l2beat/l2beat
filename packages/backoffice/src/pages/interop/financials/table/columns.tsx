import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { Badge } from '~/components/core/Badge'
import { formatTimestamp } from '~/utils/formatTimestamp'
import type { FinancialTransferRow } from '../types'
import { formatAmount, formatId, formatUsd } from '../utils'

const columnHelper = createColumnHelper<FinancialTransferRow>()

export function createFinancialTransfersColumns(): TableOptions<FinancialTransferRow>['columns'] {
  return [
    columnHelper.accessor('transferId', {
      header: 'Transfer ID',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs" title={getValue()}>
          {formatId(getValue())}
        </span>
      ),
      meta: {
        csvHeader: 'Transfer ID',
      },
    }),
    columnHelper.accessor('timestamp', {
      header: 'Timestamp (UTC)',
      cell: ({ getValue }) => formatTimestamp(getValue()),
      meta: {
        csvHeader: 'Timestamp',
        getCsvValue: ({ row }) => formatTimestamp(row.original.timestamp),
      },
    }),
    columnHelper.accessor('plugin', {
      header: 'Plugin',
      meta: {
        csvHeader: 'Plugin',
        filter: { kind: 'select' },
      },
    }),
    columnHelper.accessor('srcChain', {
      header: 'Src chain',
      meta: {
        csvHeader: 'Src chain',
        filter: { kind: 'select' },
      },
    }),
    columnHelper.accessor('srcSymbol', {
      header: 'Src symbol',
      cell: ({ getValue }) => getValue() ?? '-',
      meta: {
        csvHeader: 'Src symbol',
      },
    }),
    columnHelper.accessor('srcAbstractTokenId', {
      header: 'Src abstract ID',
      cell: ({ getValue }) => {
        const value = getValue()
        if (!value) return <span className="text-muted-foreground">-</span>
        return (
          <span className="font-mono text-xs" title={value}>
            {formatId(value)}
          </span>
        )
      },
      meta: {
        csvHeader: 'Src abstract ID',
      },
    }),
    columnHelper.accessor('srcAmount', {
      header: 'Src amount',
      cell: ({ getValue }) => formatAmount(getValue()),
      meta: {
        csvHeader: 'Src amount',
      },
    }),
    columnHelper.accessor('srcPrice', {
      header: 'Src price',
      cell: ({ getValue }) => formatUsd(getValue()),
      meta: {
        csvHeader: 'Src price',
      },
    }),
    columnHelper.accessor('srcValueUsd', {
      header: 'Src value (USD)',
      cell: ({ getValue }) => formatUsd(getValue()),
      meta: {
        csvHeader: 'Src value (USD)',
      },
    }),
    columnHelper.accessor('dstChain', {
      header: 'Dst chain',
      meta: {
        csvHeader: 'Dst chain',
        filter: { kind: 'select' },
      },
    }),
    columnHelper.accessor('dstSymbol', {
      header: 'Dst symbol',
      cell: ({ getValue }) => getValue() ?? '-',
      meta: {
        csvHeader: 'Dst symbol',
      },
    }),
    columnHelper.accessor('dstAbstractTokenId', {
      header: 'Dst abstract ID',
      cell: ({ getValue }) => {
        const value = getValue()
        if (!value) return <span className="text-muted-foreground">-</span>
        return (
          <span className="font-mono text-xs" title={value}>
            {formatId(value)}
          </span>
        )
      },
      meta: {
        csvHeader: 'Dst abstract ID',
      },
    }),
    columnHelper.accessor('dstAmount', {
      header: 'Dst amount',
      cell: ({ getValue }) => formatAmount(getValue()),
      meta: {
        csvHeader: 'Dst amount',
      },
    }),
    columnHelper.accessor('dstPrice', {
      header: 'Dst price',
      cell: ({ getValue }) => formatUsd(getValue()),
      meta: {
        csvHeader: 'Dst price',
      },
    }),
    columnHelper.accessor('dstValueUsd', {
      header: 'Dst value (USD)',
      cell: ({ getValue }) => formatUsd(getValue()),
      meta: {
        csvHeader: 'Dst value (USD)',
      },
    }),
    columnHelper.accessor('isProcessed', {
      header: 'Processed',
      cell: ({ getValue }) =>
        getValue() ? (
          <Badge variant="secondary">Processed</Badge>
        ) : (
          <Badge variant="outline">Unprocessed</Badge>
        ),
      meta: {
        csvHeader: 'Processed',
        getCsvValue: ({ row }) => (row.original.isProcessed ? 'yes' : 'no'),
        filter: {
          kind: 'select',
          label: 'Processed',
          getOptionLabel: (value) => (value ? 'Processed' : 'Unprocessed'),
        },
      },
    }),
  ]
}
