import type { ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from '~/components/ExternalLink'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { SummaryMessageDetailsRow } from '../types'
import {
  formatMessageDuration,
  formatMessageTimestamp,
  shortenHash,
  toCsvIsoTimestamp,
} from './utils'

interface CreateMessageDetailsColumnsOptions {
  getExplorerUrl: (chain: string) => string | undefined
}

export function createMessageDetailsColumns({
  getExplorerUrl,
}: CreateMessageDetailsColumnsOptions): ColumnDef<SummaryMessageDetailsRow>[] {
  return [
    {
      id: 'timestamp',
      accessorFn: (row) => row.timestamp,
      header: (props) => <SortableHeader {...props} label="Timestamp UTC" />,
      cell: ({ row }) => formatMessageTimestamp(row.original.timestamp),
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
      accessorKey: 'app',
      header: (props) => <SortableHeader {...props} label="App" />,
      meta: {
        csvHeader: 'App',
      },
    },
    {
      id: 'duration',
      accessorFn: (row) => row.duration,
      header: (props) => <SortableHeader {...props} label="Duration" />,
      cell: ({ row }) => formatMessageDuration(row.original.duration),
      meta: {
        csvHeader: 'Duration',
        csvValue: ({ row }) => formatMessageDuration(row.original.duration),
      },
    },
    {
      accessorKey: 'srcChain',
      header: (props) => <SortableHeader {...props} label="Source chain" />,
      cell: ({ row }) => row.original.srcChain ?? '-',
      meta: {
        csvHeader: 'Source chain',
        csvValue: ({ row }) => row.original.srcChain ?? '-',
      },
    },
    {
      accessorKey: 'srcTxHash',
      header: (props) => <SortableHeader {...props} label="Source tx" />,
      cell: ({ row }) => {
        const hash = row.original.srcTxHash
        if (!hash) {
          return '-'
        }

        const chain = row.original.srcChain
        const explorerUrl = chain ? getExplorerUrl(chain) : undefined
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
        csvHeader: 'Source tx',
        csvValue: ({ row }) => row.original.srcTxHash ?? '-',
      },
    },
    {
      accessorKey: 'srcLogIndex',
      header: (props) => <SortableHeader {...props} label="Source log index" />,
      cell: ({ row }) => row.original.srcLogIndex ?? '-',
      meta: {
        csvHeader: 'Source log index',
        csvValue: ({ row }) =>
          row.original.srcLogIndex !== undefined
            ? String(row.original.srcLogIndex)
            : '-',
      },
    },
    {
      accessorKey: 'dstChain',
      header: (props) => (
        <SortableHeader {...props} label="Destination chain" />
      ),
      cell: ({ row }) => row.original.dstChain ?? '-',
      meta: {
        csvHeader: 'Destination chain',
        csvValue: ({ row }) => row.original.dstChain ?? '-',
      },
    },
    {
      accessorKey: 'dstTxHash',
      header: (props) => <SortableHeader {...props} label="Destination tx" />,
      cell: ({ row }) => {
        const hash = row.original.dstTxHash
        if (!hash) {
          return '-'
        }

        const chain = row.original.dstChain
        const explorerUrl = chain ? getExplorerUrl(chain) : undefined
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
        csvHeader: 'Destination tx',
        csvValue: ({ row }) => row.original.dstTxHash ?? '-',
      },
    },
    {
      accessorKey: 'dstLogIndex',
      header: (props) => (
        <SortableHeader {...props} label="Destination log index" />
      ),
      cell: ({ row }) => row.original.dstLogIndex ?? '-',
      meta: {
        csvHeader: 'Destination log index',
        csvValue: ({ row }) =>
          row.original.dstLogIndex !== undefined
            ? String(row.original.dstLogIndex)
            : '-',
      },
    },
  ]
}
