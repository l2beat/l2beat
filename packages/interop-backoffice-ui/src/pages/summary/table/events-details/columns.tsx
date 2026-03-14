import type { ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from '~/components/ExternalLink'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { SummaryEventDetailsRow } from '../types'
import { formatEventTimestamp, shortenHash, toCsvIsoTimestamp } from './utils'

interface CreateEventDetailsColumnsOptions {
  getExplorerUrl: (chain: string) => string | undefined
}

export function createEventDetailsColumns({
  getExplorerUrl,
}: CreateEventDetailsColumnsOptions): ColumnDef<SummaryEventDetailsRow>[] {
  return [
    {
      id: 'timestamp',
      accessorFn: (row) => row.timestamp,
      header: (props) => <SortableHeader {...props} label="Timestamp UTC" />,
      cell: ({ row }) => formatEventTimestamp(row.original.timestamp),
      meta: {
        csvHeader: 'Timestamp UTC',
        csvValue: ({ row }) => toCsvIsoTimestamp(row.original.timestamp),
      },
    },
    {
      accessorKey: 'plugin',
      header: (props) => <SortableHeader {...props} label="Plugin" />,
      meta: {
        csvHeader: 'Plugin',
      },
    },
    {
      accessorKey: 'chain',
      header: (props) => <SortableHeader {...props} label="Chain" />,
      meta: {
        csvHeader: 'Chain',
      },
    },
    {
      accessorKey: 'txHash',
      header: (props) => <SortableHeader {...props} label="Tx hash" />,
      cell: ({ row }) => {
        const hash = row.original.txHash
        const explorerUrl = getExplorerUrl(row.original.chain)
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
    },
    {
      accessorKey: 'logIndex',
      header: (props) => <SortableHeader {...props} label="Log index" />,
      meta: {
        csvHeader: 'Log index',
      },
    },
    {
      accessorKey: 'direction',
      header: (props) => <SortableHeader {...props} label="Direction" />,
      cell: ({ row }) => row.original.direction ?? '-',
      meta: {
        csvHeader: 'Direction',
        csvValue: ({ row }) => row.original.direction ?? '-',
      },
    },
    {
      accessorKey: 'srcChain',
      header: (props) => <SortableHeader {...props} label="$srcChain" />,
      cell: ({ row }) => row.original.srcChain ?? '-',
      meta: {
        csvHeader: '$srcChain',
        csvValue: ({ row }) => row.original.srcChain ?? '-',
      },
    },
    {
      accessorKey: 'dstChain',
      header: (props) => <SortableHeader {...props} label="$dstChain" />,
      cell: ({ row }) => row.original.dstChain ?? '-',
      meta: {
        csvHeader: '$dstChain',
        csvValue: ({ row }) => row.original.dstChain ?? '-',
      },
    },
    {
      accessorKey: 'args',
      header: (props) => <SortableHeader {...props} label="Args" />,
      cell: ({ row }) => (
        <pre className="max-w-[560px] whitespace-pre-wrap break-all font-mono text-muted-foreground text-xs">
          {row.original.args}
        </pre>
      ),
      meta: {
        csvHeader: 'Args',
      },
    },
  ]
}
