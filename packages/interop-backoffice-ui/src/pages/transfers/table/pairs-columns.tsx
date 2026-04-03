import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { CellLink } from '~/components/table/CellLink'
import { SortableHeader } from '~/components/table/SortableHeader'
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
      header: (props) => <SortableHeader {...props} label="Source chain" />,
      meta: {
        csvHeader: 'Source chain',
      },
    }),
    columnHelper.accessor('dstChain', {
      header: (props) => (
        <SortableHeader {...props} label="Destination chain" />
      ),
      meta: {
        csvHeader: 'Destination chain',
      },
    }),
    columnHelper.accessor('count', {
      header: (props) => <SortableHeader {...props} label="Count" />,
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
      header: (props) => <SortableHeader {...props} label="Median duration" />,
      cell: ({ row }) => formatTransferDuration(row.original.avgDuration),
      meta: {
        csvHeader: 'Median duration',
        getCsvValue: ({ row }) =>
          formatTransferDuration(row.original.avgDuration),
      },
    }),
    columnHelper.accessor('srcValueSum', {
      header: (props) => <SortableHeader {...props} label="Source value" />,
      cell: ({ row }) => formatDollars(row.original.srcValueSum),
      meta: {
        csvHeader: 'Source value',
        getCsvValue: ({ row }) => formatDollars(row.original.srcValueSum),
      },
    }),
    columnHelper.accessor('dstValueSum', {
      header: (props) => (
        <SortableHeader {...props} label="Destination value" />
      ),
      cell: ({ row }) => formatDollars(row.original.dstValueSum),
      meta: {
        csvHeader: 'Destination value',
        getCsvValue: ({ row }) => formatDollars(row.original.dstValueSum),
      },
    }),
  ]
}
