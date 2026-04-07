import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { ExternalLink } from '~/components/ExternalLink'
import type { EventDetailsRow } from '../../types'
import { shortenHash } from '../../utils/shorten-hash'
import { formatEventTimestamp, toCsvIsoTimestamp } from '../../utils/timestamps'

const columnHelper = createColumnHelper<EventDetailsRow>()

export function createEventDetailsColumns(options: {
  getExplorerUrl: (chain: string) => string | undefined
}): TableOptions<EventDetailsRow>['columns'] {
  return [
    columnHelper.accessor('timestamp', {
      header: 'Timestamp UTC',
      cell: ({ row }) => formatEventTimestamp(row.original.timestamp),
      meta: {
        csvHeader: 'Timestamp UTC',
        getCsvValue: ({ row }) => toCsvIsoTimestamp(row.original.timestamp),
      },
    }),
    columnHelper.accessor('plugin', {
      header: 'Plugin',
      meta: {
        csvHeader: 'Plugin',
      },
    }),
    columnHelper.accessor('chain', {
      header: 'Chain',
      meta: {
        csvHeader: 'Chain',
      },
    }),
    columnHelper.accessor('txHash', {
      header: 'Tx hash',
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
      enableSorting: false,
    }),
    columnHelper.accessor('logIndex', {
      header: 'Log index',
      meta: {
        csvHeader: 'Log index',
      },
    }),
    columnHelper.accessor('direction', {
      header: 'Direction',
      cell: ({ row }) => row.original.direction ?? '-',
      meta: {
        csvHeader: 'Direction',
        getCsvValue: ({ row }) => row.original.direction ?? '-',
      },
    }),
    columnHelper.accessor('srcChain', {
      header: '$srcChain',
      cell: ({ row }) => row.original.srcChain ?? '-',
      meta: {
        csvHeader: '$srcChain',
        getCsvValue: ({ row }) => row.original.srcChain ?? '-',
      },
    }),
    columnHelper.accessor('dstChain', {
      header: '$dstChain',
      cell: ({ row }) => row.original.dstChain ?? '-',
      meta: {
        csvHeader: '$dstChain',
        getCsvValue: ({ row }) => row.original.dstChain ?? '-',
      },
    }),
    columnHelper.accessor('args', {
      header: 'Args',
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
      enableSorting: false,
    }),
  ]
}
