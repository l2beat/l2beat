import type { ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from '~/components/ExternalLink'
import { SortableHeader } from '~/components/table/SortableHeader'
import { formatDollars } from '../transfers/utils'
import type { SummaryTransferDetailsRow } from '../types'
import {
  formatTokenAmount,
  formatTransferDuration,
  formatTransferTimestamp,
  getAddTokenLinkOptions,
  getTransferSideLabel,
  shortenHash,
  toCsvIsoTimestamp,
} from './utils'

interface CreateTransferDetailsColumnsOptions {
  getExplorerUrl: (chain: string) => string | undefined
}

export function createTransferDetailsColumns({
  getExplorerUrl,
}: CreateTransferDetailsColumnsOptions): ColumnDef<SummaryTransferDetailsRow>[] {
  return [
    {
      id: 'timestamp',
      accessorFn: (row) => row.timestamp,
      header: (props) => <SortableHeader {...props} label="Timestamp UTC" />,
      cell: ({ row }) => formatTransferTimestamp(row.original.timestamp),
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
      accessorKey: 'bridgeType',
      header: (props) => <SortableHeader {...props} label="Bridge type" />,
      cell: ({ row }) => row.original.bridgeType ?? '-',
      meta: {
        csvHeader: 'Bridge type',
        csvValue: ({ row }) => row.original.bridgeType ?? '-',
      },
    },
    {
      id: 'duration',
      accessorFn: (row) => row.duration,
      header: (props) => <SortableHeader {...props} label="Duration" />,
      cell: ({ row }) => formatTransferDuration(row.original.duration),
      meta: {
        csvHeader: 'Duration',
        csvValue: ({ row }) => formatTransferDuration(row.original.duration),
      },
    },
    {
      accessorKey: 'srcChain',
      header: (props) => <SortableHeader {...props} label="Source chain" />,
      meta: {
        csvHeader: 'Source chain',
      },
    },
    {
      accessorKey: 'srcTxHash',
      header: (props) => <SortableHeader {...props} label="Source tx" />,
      cell: ({ row }) => {
        const hash = row.original.srcTxHash
        const explorerUrl = getExplorerUrl(row.original.srcChain)
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
      },
    },
    {
      accessorKey: 'srcLogIndex',
      header: (props) => <SortableHeader {...props} label="Source log index" />,
      meta: {
        csvHeader: 'Source log index',
      },
    },
    {
      id: 'srcToken',
      accessorFn: (row) => {
        const tokenAmount = formatTokenAmount(row.srcSymbol, row.srcAmount)
        return tokenAmount !== '-' ? tokenAmount : (row.srcTokenAddress ?? '-')
      },
      header: (props) => <SortableHeader {...props} label="Source token" />,
      cell: ({ row }) => {
        const tokenAmount = formatTokenAmount(
          row.original.srcSymbol,
          row.original.srcAmount,
        )

        if (tokenAmount !== '-') {
          return tokenAmount
        }

        const addTokenLink = getAddTokenLinkOptions({
          address: row.original.srcTokenAddress,
          chain: row.original.srcChain,
          otherSideAbstractTokenId: row.original.dstAbstractTokenId,
        })

        if (!addTokenLink) {
          return '-'
        }

        return (
          <ExternalLink href={addTokenLink.href} className="text-xs">
            {addTokenLink.label}
          </ExternalLink>
        )
      },
      meta: {
        csvHeader: 'Source token',
        csvValue: ({ row }) => {
          const tokenAmount = formatTokenAmount(
            row.original.srcSymbol,
            row.original.srcAmount,
          )
          return tokenAmount !== '-'
            ? tokenAmount
            : (row.original.srcTokenAddress ?? '-')
        },
      },
    },
    {
      id: 'srcValueUsd',
      accessorFn: (row) => row.srcValueUsd,
      header: (props) => <SortableHeader {...props} label="Source value" />,
      cell: ({ row }) => formatDollars(row.original.srcValueUsd),
      meta: {
        csvHeader: 'Source value',
        csvValue: ({ row }) => formatDollars(row.original.srcValueUsd),
      },
    },
    {
      id: 'srcStatus',
      accessorFn: (row) =>
        getTransferSideLabel(row.srcWasBurned, 'burned', 'locked'),
      header: (props) => <SortableHeader {...props} label="Source flow" />,
      cell: ({ row }) =>
        getTransferSideLabel(row.original.srcWasBurned, 'burned', 'locked'),
      meta: {
        csvHeader: 'Source flow',
        csvValue: ({ row }) =>
          getTransferSideLabel(row.original.srcWasBurned, 'burned', 'locked'),
      },
    },
    {
      accessorKey: 'dstChain',
      header: (props) => (
        <SortableHeader {...props} label="Destination chain" />
      ),
      meta: {
        csvHeader: 'Destination chain',
      },
    },
    {
      accessorKey: 'dstTxHash',
      header: (props) => <SortableHeader {...props} label="Destination tx" />,
      cell: ({ row }) => {
        const hash = row.original.dstTxHash
        const explorerUrl = getExplorerUrl(row.original.dstChain)
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
      },
    },
    {
      accessorKey: 'dstLogIndex',
      header: (props) => (
        <SortableHeader {...props} label="Destination log index" />
      ),
      meta: {
        csvHeader: 'Destination log index',
      },
    },
    {
      id: 'dstToken',
      accessorFn: (row) => {
        const tokenAmount = formatTokenAmount(row.dstSymbol, row.dstAmount)
        return tokenAmount !== '-' ? tokenAmount : (row.dstTokenAddress ?? '-')
      },
      header: (props) => (
        <SortableHeader {...props} label="Destination token" />
      ),
      cell: ({ row }) => {
        const tokenAmount = formatTokenAmount(
          row.original.dstSymbol,
          row.original.dstAmount,
        )

        if (tokenAmount !== '-') {
          return tokenAmount
        }

        const addTokenLink = getAddTokenLinkOptions({
          address: row.original.dstTokenAddress,
          chain: row.original.dstChain,
          otherSideAbstractTokenId: row.original.srcAbstractTokenId,
        })

        if (!addTokenLink) {
          return '-'
        }

        return (
          <ExternalLink href={addTokenLink.href} className="text-xs">
            {addTokenLink.label}
          </ExternalLink>
        )
      },
      meta: {
        csvHeader: 'Destination token',
        csvValue: ({ row }) => {
          const tokenAmount = formatTokenAmount(
            row.original.dstSymbol,
            row.original.dstAmount,
          )
          return tokenAmount !== '-'
            ? tokenAmount
            : (row.original.dstTokenAddress ?? '-')
        },
      },
    },
    {
      id: 'dstValueUsd',
      accessorFn: (row) => row.dstValueUsd,
      header: (props) => (
        <SortableHeader {...props} label="Destination value" />
      ),
      cell: ({ row }) => formatDollars(row.original.dstValueUsd),
      meta: {
        csvHeader: 'Destination value',
        csvValue: ({ row }) => formatDollars(row.original.dstValueUsd),
      },
    },
    {
      id: 'dstStatus',
      accessorFn: (row) =>
        getTransferSideLabel(row.dstWasMinted, 'minted', 'released'),
      header: (props) => <SortableHeader {...props} label="Destination flow" />,
      cell: ({ row }) =>
        getTransferSideLabel(row.original.dstWasMinted, 'minted', 'released'),
      meta: {
        csvHeader: 'Destination flow',
        csvValue: ({ row }) =>
          getTransferSideLabel(row.original.dstWasMinted, 'minted', 'released'),
      },
    },
  ]
}
