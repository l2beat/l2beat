import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { TransferPairRow } from '../types'
import { formatDollars, formatTransferDuration } from '../utils'

const columnHelper = createColumnHelper<TransferPairRow>()

export const transferPairsColumns = [
  columnHelper.accessor('srcChain', {
    header: (props) => <SortableHeader {...props} label="Source chain" />,
    meta: {
      csvHeader: 'Source chain',
    },
  }),
  columnHelper.accessor('dstChain', {
    header: (props) => <SortableHeader {...props} label="Destination chain" />,
    meta: {
      csvHeader: 'Destination chain',
    },
  }),
  columnHelper.accessor('count', {
    header: (props) => <SortableHeader {...props} label="Count" />,
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
    header: (props) => <SortableHeader {...props} label="Destination value" />,
    cell: ({ row }) => formatDollars(row.original.dstValueSum),
    meta: {
      csvHeader: 'Destination value',
      getCsvValue: ({ row }) => formatDollars(row.original.dstValueSum),
    },
  }),
] as ColumnDef<TransferPairRow>[]
