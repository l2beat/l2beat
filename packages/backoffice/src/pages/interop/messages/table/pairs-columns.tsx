import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { InternalLink } from '~/components/InternalLink'
import type { MessagePairRow } from '../types'
import { formatMessageDuration } from '../utils'

const columnHelper = createColumnHelper<MessagePairRow>()

interface CreateMessagePairsColumnsOptions {
  getDetailsPath: (pair: MessagePairRow) => string
}

export function createMessagePairsColumns({
  getDetailsPath,
}: CreateMessagePairsColumnsOptions): TableOptions<MessagePairRow>['columns'] {
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
        <InternalLink to={getDetailsPath(row.original)}>
          {row.original.count}
        </InternalLink>
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
        getCsvValue: ({ row }) =>
          formatMessageDuration(row.original.avgDuration),
      },
    }),
  ]
}
