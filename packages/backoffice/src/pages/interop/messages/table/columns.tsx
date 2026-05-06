import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { CellLink } from '~/components/table/CellLink'
import type { MessageStatsRow } from '../types'
import {
  buildMessageDetailsPath,
  formatKnownAppCoverage,
  formatMessageDuration,
} from '../utils'

const columnHelper = createColumnHelper<MessageStatsRow>()

export const messageStatsColumns: TableOptions<MessageStatsRow>['columns'] = [
  columnHelper.accessor('plugin', {
    header: 'Plugin',
    meta: {
      csvHeader: 'Plugin',
      filter: {
        kind: 'select',
      },
    },
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    meta: {
      csvHeader: 'Type',
      filter: {
        kind: 'select',
      },
    },
  }),
  columnHelper.accessor('count', {
    header: 'Count',
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
    header: 'Median duration',
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
      header: 'Known app %',
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
    header: 'Chain pairs',
    cell: (row) => row.getValue(),
    meta: {
      csvHeader: 'Chain pairs',
      getCsvValue: ({ row }) => String(row.original.chains.length),
    },
  }),
]
