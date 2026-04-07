import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { ExternalLink } from '~/components/ExternalLink'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { MessageDetailsRow } from '../../types'
import {
  formatMessageDuration,
  formatMessageLabel,
  formatMessageTimestamp,
  shortenHash,
  toCsvIsoTimestamp,
} from '../../utils'

const columnHelper = createColumnHelper<MessageDetailsRow>()

function renderIdentifier(value: string | undefined) {
  if (value === undefined || value.trim().length === 0) {
    return <span className="text-muted-foreground">-</span>
  }

  return (
    <code
      className="whitespace-nowrap font-mono text-muted-foreground text-xs"
      title={value}
    >
      {shortenHash(value)}
    </code>
  )
}

export function createMessageDetailsColumns(options: {
  getExplorerUrl: (chain: string) => string | undefined
}): TableOptions<MessageDetailsRow>['columns'] {
  return [
    columnHelper.accessor('timestamp', {
      header: (props) => <SortableHeader {...props} label="Timestamp UTC" />,
      cell: ({ row }) => formatMessageTimestamp(row.original.timestamp),
      meta: {
        csvHeader: 'Timestamp UTC',
        getCsvValue: ({ row }) => toCsvIsoTimestamp(row.original.timestamp),
      },
    }),
    columnHelper.accessor('duration', {
      header: (props) => <SortableHeader {...props} label="Duration" />,
      cell: ({ row }) => formatMessageDuration(row.original.duration),
      meta: {
        csvHeader: 'Duration',
        getCsvValue: ({ row }) => formatMessageDuration(row.original.duration),
      },
    }),
    columnHelper.accessor('plugin', {
      header: (props) => <SortableHeader {...props} label="Plugin" />,
      meta: {
        csvHeader: 'Plugin',
      },
    }),
    columnHelper.accessor('app', {
      header: (props) => <SortableHeader {...props} label="App" />,
      cell: ({ row }) => formatMessageLabel(row.original.app),
      meta: {
        csvHeader: 'App',
        getCsvValue: ({ row }) => formatMessageLabel(row.original.app),
      },
    }),
    columnHelper.accessor('messageId', {
      header: (props) => <SortableHeader {...props} label="Message ID" />,
      cell: ({ row }) => renderIdentifier(row.original.messageId),
      meta: {
        csvHeader: 'Message ID',
      },
    }),
    columnHelper.accessor('srcChain', {
      header: (props) => <SortableHeader {...props} label="Source chain" />,
      cell: ({ row }) => row.original.srcChain ?? '-',
      meta: {
        csvHeader: 'Source chain',
        getCsvValue: ({ row }) => row.original.srcChain ?? '-',
      },
    }),
    columnHelper.accessor('srcTime', {
      header: (props) => <SortableHeader {...props} label="Source time" />,
      cell: ({ row }) => formatMessageTimestamp(row.original.srcTime),
      meta: {
        csvHeader: 'Source time',
        getCsvValue: ({ row }) => toCsvIsoTimestamp(row.original.srcTime),
      },
    }),
    columnHelper.accessor('srcTxHash', {
      header: (props) => <SortableHeader {...props} label="Source tx" />,
      cell: ({ row }) => {
        const hash = row.original.srcTxHash

        if (!hash) {
          return <span className="text-muted-foreground">-</span>
        }

        const explorerUrl =
          row.original.srcChain && options.getExplorerUrl(row.original.srcChain)
        const label = shortenHash(hash)

        if (!explorerUrl) {
          return <span className="font-mono text-xs">{label}</span>
        }

        return (
          <ExternalLink
            href={`${explorerUrl}/tx/${hash}`}
            className="font-mono text-xs"
          >
            {label}
          </ExternalLink>
        )
      },
      enableSorting: false,
      meta: {
        csvHeader: 'Source tx',
        getCsvValue: ({ row }) => row.original.srcTxHash ?? '-',
      },
    }),
    columnHelper.accessor('srcLogIndex', {
      header: (props) => <SortableHeader {...props} label="Source log index" />,
      cell: ({ row }) => row.original.srcLogIndex ?? '-',
      meta: {
        csvHeader: 'Source log index',
        getCsvValue: ({ row }) => String(row.original.srcLogIndex ?? '-'),
      },
    }),
    columnHelper.accessor('srcEventId', {
      header: (props) => <SortableHeader {...props} label="Source event ID" />,
      cell: ({ row }) => renderIdentifier(row.original.srcEventId),
      meta: {
        csvHeader: 'Source event ID',
        getCsvValue: ({ row }) => row.original.srcEventId ?? '-',
      },
    }),
    columnHelper.accessor('dstChain', {
      header: (props) => (
        <SortableHeader {...props} label="Destination chain" />
      ),
      cell: ({ row }) => row.original.dstChain ?? '-',
      meta: {
        csvHeader: 'Destination chain',
        getCsvValue: ({ row }) => row.original.dstChain ?? '-',
      },
    }),
    columnHelper.accessor('dstTime', {
      header: (props) => <SortableHeader {...props} label="Destination time" />,
      cell: ({ row }) => formatMessageTimestamp(row.original.dstTime),
      meta: {
        csvHeader: 'Destination time',
        getCsvValue: ({ row }) => toCsvIsoTimestamp(row.original.dstTime),
      },
    }),
    columnHelper.accessor('dstTxHash', {
      header: (props) => <SortableHeader {...props} label="Destination tx" />,
      cell: ({ row }) => {
        const hash = row.original.dstTxHash

        if (!hash) {
          return <span className="text-muted-foreground">-</span>
        }

        const explorerUrl =
          row.original.dstChain && options.getExplorerUrl(row.original.dstChain)
        const label = shortenHash(hash)

        if (!explorerUrl) {
          return <span className="font-mono text-xs">{label}</span>
        }

        return (
          <ExternalLink
            href={`${explorerUrl}/tx/${hash}`}
            className="font-mono text-xs"
          >
            {label}
          </ExternalLink>
        )
      },
      enableSorting: false,
      meta: {
        csvHeader: 'Destination tx',
        getCsvValue: ({ row }) => row.original.dstTxHash ?? '-',
      },
    }),
    columnHelper.accessor('dstLogIndex', {
      header: (props) => (
        <SortableHeader {...props} label="Destination log index" />
      ),
      cell: ({ row }) => row.original.dstLogIndex ?? '-',
      meta: {
        csvHeader: 'Destination log index',
        getCsvValue: ({ row }) => String(row.original.dstLogIndex ?? '-'),
      },
    }),
    columnHelper.accessor('dstEventId', {
      header: (props) => (
        <SortableHeader {...props} label="Destination event ID" />
      ),
      cell: ({ row }) => renderIdentifier(row.original.dstEventId),
      meta: {
        csvHeader: 'Destination event ID',
        getCsvValue: ({ row }) => row.original.dstEventId ?? '-',
      },
    }),
  ]
}
