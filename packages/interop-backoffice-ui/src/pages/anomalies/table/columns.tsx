import { Address32 } from '@l2beat/shared-pure'
import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { ExternalLink } from '~/components/ExternalLink'
import {
  formatDollars,
  formatTransferTimestamp,
  getTokenAddressDisplay,
  shortenHash,
  toCsvIsoTimestamp,
} from '~/pages/transfers/utils'
import type { SuspiciousTransferRow } from '../types'

const columnHelper = createColumnHelper<SuspiciousTransferRow>()

export function createSuspiciousTransfersColumns(options: {
  getExplorerUrl: (chain: string) => string | undefined
  valueDiffThresholdPercent: number
}): TableOptions<SuspiciousTransferRow>['columns'] {
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
    columnHelper.accessor('transferId', {
      header: 'Transfer ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.transferId}</span>
      ),
      enableSorting: false,
      meta: {
        csvHeader: 'Transfer ID',
      },
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      meta: {
        csvHeader: 'Type',
      },
    }),
    columnHelper.accessor('bridgeType', {
      header: 'Bridge type',
      meta: {
        csvHeader: 'Bridge type',
      },
    }),
    columnHelper.accessor('srcChain', {
      header: 'Source chain',
      meta: {
        csvHeader: 'Source chain',
      },
    }),
    columnHelper.accessor('dstChain', {
      header: 'Destination chain',
      meta: {
        csvHeader: 'Destination chain',
      },
    }),
    columnHelper.accessor('srcTokenAddress', {
      id: 'srcToken',
      header: 'Source token',
      cell: ({ row }) => (
        <TokenCell
          chain={row.original.srcChain}
          address={row.original.srcTokenAddress}
          symbol={row.original.srcSymbol}
        />
      ),
      meta: {
        csvHeader: 'Source token',
        getCsvValue: ({ row }) =>
          getTokenLabel(row.original.srcSymbol, row.original.srcTokenAddress),
      },
      sortingFn: (left, right) =>
        getTokenLabel(
          left.original.srcSymbol,
          left.original.srcTokenAddress,
        ).localeCompare(
          getTokenLabel(
            right.original.srcSymbol,
            right.original.srcTokenAddress,
          ),
        ),
    }),
    columnHelper.accessor('dstTokenAddress', {
      id: 'dstToken',
      header: 'Destination token',
      cell: ({ row }) => (
        <TokenCell
          chain={row.original.dstChain}
          address={row.original.dstTokenAddress}
          symbol={row.original.dstSymbol}
        />
      ),
      meta: {
        csvHeader: 'Destination token',
        getCsvValue: ({ row }) =>
          getTokenLabel(row.original.dstSymbol, row.original.dstTokenAddress),
      },
      sortingFn: (left, right) =>
        getTokenLabel(
          left.original.dstSymbol,
          left.original.dstTokenAddress,
        ).localeCompare(
          getTokenLabel(
            right.original.dstSymbol,
            right.original.dstTokenAddress,
          ),
        ),
    }),
    columnHelper.accessor('srcValueUsd', {
      header: 'Source value',
      cell: ({ row }) => formatDollars(row.original.srcValueUsd),
      meta: {
        csvHeader: 'Source value',
        getCsvValue: ({ row }) => formatDollars(row.original.srcValueUsd),
      },
      sortingFn: (left, right) =>
        (left.original.srcValueUsd ?? 0) - (right.original.srcValueUsd ?? 0),
    }),
    columnHelper.accessor('dstValueUsd', {
      header: 'Destination value',
      cell: ({ row }) => formatDollars(row.original.dstValueUsd),
      meta: {
        csvHeader: 'Destination value',
        getCsvValue: ({ row }) => formatDollars(row.original.dstValueUsd),
      },
      sortingFn: (left, right) =>
        (left.original.dstValueUsd ?? 0) - (right.original.dstValueUsd ?? 0),
    }),
    columnHelper.accessor('valueDifferencePercent', {
      header: 'Diff %',
      cell: ({ row }) => {
        const value = row.original.valueDifferencePercent
        const isOverThreshold = value > options.valueDiffThresholdPercent

        return (
          <span className={isOverThreshold ? 'font-semibold text-red-700' : ''}>
            {value.toFixed(2)}%
          </span>
        )
      },
      meta: {
        csvHeader: 'Diff %',
        getCsvValue: ({ row }) =>
          `${row.original.valueDifferencePercent.toFixed(2)}%`,
      },
    }),
    columnHelper.accessor('srcTxHash', {
      header: 'Source tx',
      cell: ({ row }) => (
        <TxHashCell
          chain={row.original.srcChain}
          hash={row.original.srcTxHash}
          getExplorerUrl={options.getExplorerUrl}
        />
      ),
      enableSorting: false,
      meta: {
        csvHeader: 'Source tx',
        getCsvValue: ({ row }) => row.original.srcTxHash ?? '-',
      },
    }),
    columnHelper.accessor('dstTxHash', {
      header: 'Destination tx',
      cell: ({ row }) => (
        <TxHashCell
          chain={row.original.dstChain}
          hash={row.original.dstTxHash}
          getExplorerUrl={options.getExplorerUrl}
        />
      ),
      enableSorting: false,
      meta: {
        csvHeader: 'Destination tx',
        getCsvValue: ({ row }) => row.original.dstTxHash ?? '-',
      },
    }),
  ]
}

function TxHashCell(props: {
  chain: string
  hash: string | undefined
  getExplorerUrl: (chain: string) => string | undefined
}) {
  if (!props.hash) {
    return <span className="text-muted-foreground">-</span>
  }

  const explorerUrl = props.getExplorerUrl(props.chain)
  const label = shortenHash(props.hash)

  if (!explorerUrl) {
    return <span className="font-mono text-xs">{label}</span>
  }

  return (
    <ExternalLink
      href={`${explorerUrl}/tx/${props.hash}`}
      className="font-mono text-xs"
    >
      {label}
    </ExternalLink>
  )
}

function TokenCell(props: {
  chain: string
  address: string | undefined
  symbol: string | undefined
}) {
  const label = getTokenLabel(props.symbol, props.address)
  const href = getTokenUiHref(props.chain, props.address)

  if (!href) {
    return label
  }

  return (
    <ExternalLink href={href} className="text-xs">
      {label}
    </ExternalLink>
  )
}

function getTokenUiHref(chain: string, address: string | undefined) {
  if (!chain || !address) {
    return undefined
  }

  const normalizedAddress =
    address === Address32.NATIVE
      ? address
      : Address32.cropToEthereumAddress(Address32(address))

  return `https://tokens.l2beat.com/tokens/${chain}/${normalizedAddress}`
}

function getTokenLabel(
  symbol: string | undefined,
  address: string | undefined,
) {
  return symbol ?? getTokenAddressDisplay(address)
}
