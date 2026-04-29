import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import type { ProcessorStatusRow } from '../types'
import { formatProcessorTimestamp } from '../utils'

const columnHelper = createColumnHelper<ProcessorStatusRow>()

export const processorStatusColumns: TableOptions<ProcessorStatusRow>['columns'] =
  [
    columnHelper.accessor('chain', {
      header: 'Chain',
      meta: {
        csvHeader: 'Chain',
      },
    }),
    columnHelper.accessor('block', {
      header: 'Latest block',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue()}</span>
      ),
      meta: {
        csvHeader: 'Latest block',
      },
    }),
    columnHelper.accessor('timestamp', {
      header: 'Latest timestamp',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">
          {formatProcessorTimestamp(getValue())}
        </span>
      ),
      meta: {
        csvHeader: 'Latest timestamp',
        getCsvValue: ({ row }) =>
          formatProcessorTimestamp(row.original.timestamp),
      },
    }),
  ]
