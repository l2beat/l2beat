import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { CellLink } from '~/components/table/CellLink'
import type { TransferPairRow } from '../types'
import { formatDollars, formatTransferDuration } from '../utils'

const columnHelper = createColumnHelper<TransferPairRow>()

interface CreateTransferPairsColumnsOptions {
  getDetailsPath: (pair: TransferPairRow) => string
}

export function createTransferPairsColumns({
  getDetailsPath,
}: CreateTransferPairsColumnsOptions): TableOptions<TransferPairRow>['columns'] {
  return [
    columnHelper.accessor('srcChain', {
      header: 'Source chain',
      meta: {
        csvHeader: 'Source chain',
        filter: {
          kind: 'select',
        },
      },
    }),
    columnHelper.accessor('dstChain', {
      header: 'Destination chain',
      meta: {
        csvHeader: 'Destination chain',
        filter: {
          kind: 'select',
        },
      },
    }),
    columnHelper.accessor('count', {
      header: 'Count',
      cell: ({ row }) => (
        <CellLink to={getDetailsPath(row.original)}>
          {row.original.count}
        </CellLink>
      ),
      meta: {
        csvHeader: 'Count',
      },
    }),
    columnHelper.accessor('avgDuration', {
      header: 'Median duration',
      cell: ({ row }) => formatTransferDuration(row.original.avgDuration),
      meta: {
        csvHeader: 'Median duration',
        getCsvValue: ({ row }) =>
          formatTransferDuration(row.original.avgDuration),
      },
    }),
    columnHelper.accessor('srcValueSum', {
      header: 'Source value',
      cell: ({ row }) => formatDollars(row.original.srcValueSum),
      meta: {
        csvHeader: 'Source value',
        getCsvValue: ({ row }) => formatDollars(row.original.srcValueSum),
      },
    }),
    columnHelper.accessor('dstValueSum', {
      header: 'Destination value',
      cell: ({ row }) => formatDollars(row.original.dstValueSum),
      meta: {
        csvHeader: 'Destination value',
        getCsvValue: ({ row }) => formatDollars(row.original.dstValueSum),
      },
    }),
  ]
}
