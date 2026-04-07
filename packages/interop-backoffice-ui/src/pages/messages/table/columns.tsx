import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { CellLink } from '~/components/table/CellLink'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { MessageStatsRow } from '../types'
import {
  buildMessageDetailsPath,
  formatKnownAppCoverage,
  formatMessageDuration,
} from '../utils'

const columnHelper = createColumnHelper<MessageStatsRow>()

export const messageStatsColumns: TableOptions<MessageStatsRow>['columns'] = [
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
        to={buildMessageDetailsPath({
          plugin: row.original.plugin,
          type: row.original.type,
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
    cell: ({ row }) => formatMessageDuration(row.original.avgDuration),
    meta: {
      csvHeader: 'Median duration',
      getCsvValue: ({ row }) => formatMessageDuration(row.original.avgDuration),
    },
  }),
  columnHelper.accessor(
    (row) => (row.count === 0 ? 0 : row.knownAppCount / row.count),
    {
      id: 'knownAppCoverage',
      header: (props) => <SortableHeader {...props} label="Known app %" />,
      cell: ({ row }) =>
        formatKnownAppCoverage(row.original.count, row.original.knownAppCount),
      meta: {
        csvHeader: 'Known app %',
        getCsvValue: ({ row }) =>
          formatKnownAppCoverage(
            row.original.count,
            row.original.knownAppCount,
          ),
      },
    },
  ),
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
