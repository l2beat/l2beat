import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { ExternalLink } from '~/components/ExternalLink'
import type { TransferDetailsRow } from '../../types'
import {
  formatDollars,
  formatTokenAmount,
  formatTransferDuration,
  formatTransferTimestamp,
  getAddTokenLinkOptions,
  getTokenAddressDisplay,
  getTransferSideLabel,
  shortenHash,
  toCsvIsoTimestamp,
} from '../../utils'

const columnHelper = createColumnHelper<TransferDetailsRow>()

export function createTransferDetailsColumns(options: {
  getExplorerUrl: (chain: string) => string | undefined
}): TableOptions<TransferDetailsRow>['columns'] {
  return [
    columnHelper.accessor('timestamp', {
      header: 'Timestamp UTC',
      cell: ({ row }) => formatTransferTimestamp(row.original.timestamp),
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
    columnHelper.accessor('bridgeType', {
      header: 'Bridge type',
      meta: {
        csvHeader: 'Bridge type',
      },
    }),
    columnHelper.accessor('duration', {
      header: 'Duration',
      cell: ({ row }) => formatTransferDuration(row.original.duration),
      meta: {
        csvHeader: 'Duration',
        getCsvValue: ({ row }) => formatTransferDuration(row.original.duration),
      },
    }),
    columnHelper.accessor('srcChain', {
      header: 'Source chain',
      meta: {
        csvHeader: 'Source chain',
      },
    }),
    columnHelper.accessor('srcTxHash', {
      header: 'Source tx',
      cell: ({ row }) => {
        const hash = row.original.srcTxHash

        if (!hash) {
          return <span className="text-muted-foreground">-</span>
        }

        const explorerUrl = options.getExplorerUrl(row.original.srcChain)
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
      header: 'Source log index',
      cell: ({ row }) => row.original.srcLogIndex ?? '-',
      meta: {
        csvHeader: 'Source log index',
        getCsvValue: ({ row }) => String(row.original.srcLogIndex ?? '-'),
      },
    }),
    columnHelper.accessor('srcTokenAddress', {
      id: 'srcToken',
      header: 'Source token',
      cell: ({ row }) => {
        const tokenAmount = formatTokenAmount(
          row.original.srcSymbol,
          row.original.srcAmount,
        )

        if (tokenAmount) {
          return tokenAmount
        }

        const addTokenLink = getAddTokenLinkOptions({
          address: row.original.srcTokenAddress,
          chain: row.original.srcChain,
          otherSideAbstractTokenId: row.original.dstAbstractTokenId,
        })

        if (addTokenLink) {
          return (
            <ExternalLink href={addTokenLink.href} className="text-xs">
              {addTokenLink.label}
            </ExternalLink>
          )
        }

        return getTokenAddressDisplay(row.original.srcTokenAddress)
      },
      sortingFn: (left, right) => {
        return (left.original.srcAmount ?? 0) - (right.original.srcAmount ?? 0)
      },
      sortUndefined: 'last',
      meta: {
        csvHeader: 'Source token',
        getCsvValue: ({ row }) =>
          formatTokenAmount(row.original.srcSymbol, row.original.srcAmount) ??
          getTokenAddressDisplay(row.original.srcTokenAddress),
      },
    }),
    columnHelper.accessor('srcValueUsd', {
      header: 'Source value',
      cell: ({ row }) => formatDollars(row.original.srcValueUsd),
      sortUndefined: 'last',
      meta: {
        csvHeader: 'Source value',
        getCsvValue: ({ row }) => formatDollars(row.original.srcValueUsd),
      },
    }),
    columnHelper.display({
      id: 'srcFlow',
      header: 'Source flow',
      cell: ({ row }) =>
        getTransferSideLabel(row.original.srcWasBurned, 'burned', 'locked'),
      sortingFn: (left, right) =>
        getTransferSideLabel(
          left.original.srcWasBurned,
          'burned',
          'locked',
        ).localeCompare(
          getTransferSideLabel(right.original.srcWasBurned, 'burned', 'locked'),
        ),
      meta: {
        csvHeader: 'Source flow',
        getCsvValue: ({ row }) =>
          getTransferSideLabel(row.original.srcWasBurned, 'burned', 'locked'),
      },
    }),
    columnHelper.accessor('dstChain', {
      header: 'Destination chain',
      meta: {
        csvHeader: 'Destination chain',
      },
    }),
    columnHelper.accessor('dstTxHash', {
      header: 'Destination tx',
      cell: ({ row }) => {
        const hash = row.original.dstTxHash

        if (!hash) {
          return <span className="text-muted-foreground">-</span>
        }

        const explorerUrl = options.getExplorerUrl(row.original.dstChain)
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
      header: 'Destination log index',
      cell: ({ row }) => row.original.dstLogIndex ?? '-',
      meta: {
        csvHeader: 'Destination log index',
        getCsvValue: ({ row }) => String(row.original.dstLogIndex ?? '-'),
      },
    }),
    columnHelper.accessor('dstTokenAddress', {
      id: 'dstToken',
      header: 'Destination token',
      cell: ({ row }) => {
        const tokenAmount = formatTokenAmount(
          row.original.dstSymbol,
          row.original.dstAmount,
        )

        if (tokenAmount) {
          return tokenAmount
        }

        const addTokenLink = getAddTokenLinkOptions({
          address: row.original.dstTokenAddress,
          chain: row.original.dstChain,
          otherSideAbstractTokenId: row.original.srcAbstractTokenId,
        })

        if (addTokenLink) {
          return (
            <ExternalLink href={addTokenLink.href} className="text-xs">
              {addTokenLink.label}
            </ExternalLink>
          )
        }

        return getTokenAddressDisplay(row.original.dstTokenAddress)
      },
      sortingFn: (left, right) =>
        (left.original.dstAmount ?? 0) - (right.original.dstAmount ?? 0),
      sortUndefined: 'last',
      meta: {
        csvHeader: 'Destination token',
        getCsvValue: ({ row }) =>
          formatTokenAmount(row.original.dstSymbol, row.original.dstAmount) ??
          getTokenAddressDisplay(row.original.dstTokenAddress),
      },
    }),
    columnHelper.accessor('dstValueUsd', {
      header: 'Destination value',
      cell: ({ row }) => formatDollars(row.original.dstValueUsd),
      sortUndefined: 'last',
      meta: {
        csvHeader: 'Destination value',
        getCsvValue: ({ row }) => formatDollars(row.original.dstValueUsd),
      },
    }),
    columnHelper.display({
      id: 'dstFlow',
      header: 'Destination flow',
      cell: ({ row }) =>
        getTransferSideLabel(row.original.dstWasMinted, 'minted', 'released'),
      sortingFn: (left, right) =>
        getTransferSideLabel(
          left.original.dstWasMinted,
          'minted',
          'released',
        ).localeCompare(
          getTransferSideLabel(
            right.original.dstWasMinted,
            'minted',
            'released',
          ),
        ),
      meta: {
        csvHeader: 'Destination flow',
        getCsvValue: ({ row }) =>
          getTransferSideLabel(row.original.dstWasMinted, 'minted', 'released'),
      },
    }),
    columnHelper.accessor('transferId', {
      header: 'Transfer ID',
      enableSorting: false,
      meta: {
        csvHeader: 'Transfer ID',
        getCsvValue: ({ row }) => row.original.transferId,
      },
    }),
  ]
}
