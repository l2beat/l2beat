import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { CellLink } from '~/components/table/CellLink'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { TransferStatsRow } from '../types'
import {
  buildTransferDetailsPath,
  formatDollars,
  formatTransferDuration,
} from '../utils'

const columnHelper = createColumnHelper<TransferStatsRow>()

export const transferStatsColumns: TableOptions<TransferStatsRow>['columns'] = [
  columnHelper.accessor('plugin', {
    header: (props) => <SortableHeader {...props} label="Plugin" />,
    meta: {
      csvHeader: 'Plugin',
    },
  }),
  columnHelper.accessor('type', {
    header: (props) => <SortableHeader {...props} label="Type" />,
    meta: {
      csvHeader: 'Type',
    },
  }),
  columnHelper.accessor('count', {
    header: (props) => <SortableHeader {...props} label="Count" />,
    cell: ({ row }) => (
      <CellLink
        to={buildTransferDetailsPath({
          type: row.original.type,
          plugin: row.original.plugin,
        })}
      >
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
    header: (props) => <SortableHeader {...props} label="Destination value" />,
    cell: ({ row }) => formatDollars(row.original.dstValueSum),
    meta: {
      csvHeader: 'Destination value',
      getCsvValue: ({ row }) => formatDollars(row.original.dstValueSum),
    },
  }),
  columnHelper.accessor((row) => row.chains.length, {
    id: 'chainPairs',
    header: (props) => <SortableHeader {...props} label="Chain pairs" />,
    cell: (row) => row.getValue(),
    meta: {
      csvHeader: 'Chain pairs',
      getCsvValue: ({ row }) => String(row.original.chains.length),
    },
  }),
]
