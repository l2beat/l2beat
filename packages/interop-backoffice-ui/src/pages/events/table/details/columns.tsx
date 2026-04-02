import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { ExternalLink } from '~/components/ExternalLink'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { EventDetailsRow } from '../../types'
import { shortenHash } from '../../utils/shorten-hash'
import { formatEventTimestamp, toCsvIsoTimestamp } from '../../utils/timestamps'

const columnHelper = createColumnHelper<EventDetailsRow>()

export function createEventDetailsColumns(options: {
  getExplorerUrl: (chain: string) => string | undefined
}): TableOptions<EventDetailsRow>['columns'] {
  return [
    columnHelper.accessor('timestamp', {
      header: (props) => <SortableHeader {...props} label="Timestamp UTC" />,
      cell: ({ row }) => formatEventTimestamp(row.original.timestamp),
      meta: {
        csvHeader: 'Timestamp UTC',
        getCsvValue: ({ row }) => toCsvIsoTimestamp(row.original.timestamp),
      },
    }),
    columnHelper.accessor('plugin', {
      header: (props) => <SortableHeader {...props} label="Plugin" />,
      meta: {
        csvHeader: 'Plugin',
      },
    }),
    columnHelper.accessor('chain', {
      header: (props) => <SortableHeader {...props} label="Chain" />,
      meta: {
        csvHeader: 'Chain',
      },
    }),
    columnHelper.accessor('txHash', {
      header: (props) => <SortableHeader {...props} label="Tx hash" />,
      cell: ({ getValue, row }) => {
        const hash = getValue()
        const explorerUrl = options.getExplorerUrl(row.original.chain)
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
      meta: {
        csvHeader: 'Tx hash',
      },
    }),
    columnHelper.accessor('logIndex', {
      header: (props) => <SortableHeader {...props} label="Log index" />,
      meta: {
        csvHeader: 'Log index',
      },
    }),
    columnHelper.accessor('direction', {
      header: (props) => <SortableHeader {...props} label="Direction" />,
      cell: ({ row }) => row.original.direction ?? '-',
      meta: {
        csvHeader: 'Direction',
        getCsvValue: ({ row }) => row.original.direction ?? '-',
      },
    }),
    columnHelper.accessor('srcChain', {
      header: (props) => <SortableHeader {...props} label="$srcChain" />,
      cell: ({ row }) => row.original.srcChain ?? '-',
      meta: {
        csvHeader: '$srcChain',
        getCsvValue: ({ row }) => row.original.srcChain ?? '-',
      },
    }),
    columnHelper.accessor('dstChain', {
      header: (props) => <SortableHeader {...props} label="$dstChain" />,
      cell: ({ row }) => row.original.dstChain ?? '-',
      meta: {
        csvHeader: '$dstChain',
        getCsvValue: ({ row }) => row.original.dstChain ?? '-',
      },
    }),
    columnHelper.accessor('args', {
      header: (props) => <SortableHeader {...props} label="Args" />,
      cell: ({ row }) => (
        <code
          className="whitespace-nowrap font-mono text-muted-foreground text-xs"
          title={row.original.args}
        >
          {row.original.args}
        </code>
      ),
      meta: {
        csvHeader: 'Args',
      },
    }),
  ]
}
